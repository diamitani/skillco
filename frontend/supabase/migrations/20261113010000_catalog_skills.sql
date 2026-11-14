-- Scraped GitHub skills library (written by scripts/scraper/github-skills.ts with the service role)
create table if not exists public.catalog_skills (
  id text primary key,                 -- owner/repo/path (lowercase)
  name text not null,
  description text not null,
  category text not null,
  repo text not null,
  owner text not null,
  stars int not null default 0,
  license text,
  path text,
  url text not null,
  raw_url text not null,
  files int default 0,
  grade text not null check (grade in ('A','B','C','F')),
  findings jsonb not null default '[]'::jsonb,
  verified boolean not null default false,  -- false for grade F (never shown in the library)
  pushed_at timestamptz,
  scanned_at timestamptz not null default now()
);
create index if not exists catalog_skills_category_idx on public.catalog_skills(category) where verified;
create index if not exists catalog_skills_stars_idx on public.catalog_skills(stars desc) where verified;
alter table public.catalog_skills enable row level security;
create policy "catalog_public_read" on public.catalog_skills for select using (verified);
