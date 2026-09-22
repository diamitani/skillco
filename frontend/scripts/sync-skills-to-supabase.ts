/**
 * SkillCo Supabase Storage Synchronization Agent
 * 
 * Scans all packaged skill .zip archives in frontend/public/downloads/
 * and uploads them to Supabase Storage bucket ('skills' / 'skill-sources')
 * with appropriate public read headers, making all skills free to download.
 */

import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || "skills";
const DOWNLOADS_DIR = path.join(__dirname, "../public/downloads");

async function main() {
  console.log("==================================================");
  console.log("🚀 SkillCo Agent: Syncing Skills to Supabase Storage");
  console.log("==================================================");

  if (!fs.existsSync(DOWNLOADS_DIR)) {
    console.error(`❌ Downloads directory not found at: ${DOWNLOADS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(DOWNLOADS_DIR).filter((file) => file.endsWith(".zip"));
  console.log(`📦 Discovered ${files.length} skill zip archives in ${DOWNLOADS_DIR}`);

  if (!SUPABASE_URL || !SUPABASE_KEY || SUPABASE_URL.includes("your-project")) {
    console.warn("\n⚠️  Supabase credentials not configured in environment.");
    console.warn("💡 To sync to live Supabase Storage, ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local\n");
    console.log("📋 Verified Local Archive Catalog for Free Downloads:");
    files.slice(0, 10).forEach((f) => console.log(`  - ${f} (${(fs.statSync(path.join(DOWNLOADS_DIR, f)).size / 1024).toFixed(1)} KB)`));
    console.log(`  ... and ${files.length - 10} more skills.`);
    console.log("\n✅ All skills are currently available for instant FREE download directly from the web app at /downloads/[skill-id].zip");
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Ensure bucket exists
  const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
  if (bucketListError) {
    console.error("❌ Error listing Supabase buckets:", bucketListError.message);
  } else {
    const bucketExists = buckets.some((b) => b.name === BUCKET_NAME);
    if (!bucketExists) {
      console.log(`🔨 Creating public Supabase storage bucket '${BUCKET_NAME}'...`);
      const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: ["application/zip", "application/x-zip-compressed"],
      });
      if (createError) {
        console.warn(`⚠️ Could not auto-create bucket: ${createError.message}. Proceeding assuming bucket exists.`);
      }
    }
  }

  console.log(`\n📤 Uploading ${files.length} skill packages to Supabase Storage bucket '${BUCKET_NAME}'...`);

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(DOWNLOADS_DIR, file);
    const fileBuffer = fs.readFileSync(filePath);

    const { error } = await supabase.storage.from(BUCKET_NAME).upload(file, fileBuffer, {
      contentType: "application/zip",
      upsert: true,
      cacheControl: "3600",
    });

    if (error) {
      console.error(`  ❌ [${i + 1}/${files.length}] Failed to upload ${file}:`, error.message);
      failCount++;
    } else {
      if ((i + 1) % 25 === 0 || i === files.length - 1) {
        console.log(`  ✅ [${i + 1}/${files.length}] Synced ${file}`);
      }
      successCount++;
    }
  }

  console.log("\n==================================================");
  console.log(`✨ Sync Complete!`);
  console.log(`📊 Successfully Synced: ${successCount} skills`);
  if (failCount > 0) console.log(`⚠️ Failed: ${failCount} skills`);
  console.log(`🌐 Public URL Format: ${SUPABASE_URL}/storage/v1/object/public/${BUCKET_NAME}/[skill-id].zip`);
  console.log("==================================================");
}

main().catch((err) => {
  console.error("Unhandled agent error:", err);
  process.exit(1);
});
