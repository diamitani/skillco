#!/usr/bin/env python3
"""
SkillCo Agent: Sync Skill Archives to Supabase Storage

Uploads all 377+ skill .zip packages from frontend/public/downloads/
into Supabase Storage bucket 'skills', ensuring free download distribution.
"""

import os
import sys
import glob
import urllib.request
import urllib.error
import mimetypes

DOWNLOADS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../public/downloads"))
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "") or os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")
BUCKET_NAME = os.getenv("SUPABASE_STORAGE_BUCKET", "skills")


def main():
    print("=" * 60)
    print("🚀 SkillCo Python Agent: Syncing Skills to Supabase Storage")
    print("=" * 60)

    if not os.path.exists(DOWNLOADS_DIR):
        print(f"❌ Downloads directory not found at: {DOWNLOADS_DIR}")
        sys.exit(1)

    zip_files = sorted(glob.glob(os.path.join(DOWNLOADS_DIR, "*.zip")))
    print(f"📦 Discovered {len(zip_files)} skill zip files in {DOWNLOADS_DIR}")

    if not SUPABASE_URL or not SUPABASE_KEY or "your-project" in SUPABASE_URL:
        print("\n⚠️  Supabase credentials not configured in environment.")
        print("💡 To execute live uploads, set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.")
        print(f"\n✅ All {len(zip_files)} skills are active and free to download directly via Next.js at /downloads/*.zip")
        return

    print(f"\n📤 Uploading to {SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/...")

    success = 0
    failed = 0

    for i, file_path in enumerate(zip_files, 1):
        filename = os.path.basename(file_path)
        upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{filename}"

        with open(file_path, "rb") as f:
            data = f.read()

        req = urllib.request.Request(
            upload_url,
            data=data,
            headers={
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "apikey": SUPABASE_KEY,
                "Content-Type": "application/zip",
                "x-upsert": "true",
            },
            method="POST",
        )

        try:
            with urllib.request.urlopen(req) as resp:
                if resp.status in (200, 201):
                    success += 1
                    if i % 25 == 0 or i == len(zip_files):
                        print(f"  ✅ [{i}/{len(zip_files)}] Synced {filename}")
        except urllib.error.HTTPError as e:
            failed += 1
            print(f"  ❌ [{i}/{len(zip_files)}] Failed {filename}: HTTP {e.code}")
        except Exception as e:
            failed += 1
            print(f"  ❌ [{i}/{len(zip_files)}] Error {filename}: {e}")

    print("=" * 60)
    print(f"✨ Sync Finished! Synced: {success}, Failed: {failed}")
    print(f"🌐 Supabase CDN Base: {SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/")
    print("=" * 60)


if __name__ == "__main__":
    main()
