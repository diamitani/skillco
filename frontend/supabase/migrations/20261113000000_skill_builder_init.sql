-- SkillCo skill builder: initial schema (MVP)
-- Ported and trimmed from Product/infrastructure/supabase-schema.sql.
-- Apply with: supabase db push  (or paste into the Supabase SQL editor)

create extension if not exists vector;
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: one row per auth user
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  username text unique,
  plan text not null default 'free' check (plan in ('free','builder','pro','team')),
  stripe_customer_id text unique,
  credits_included int not null default 3,          -- credits granted this period
  credits_used int not null default 0,              -- credits consumed this period
  overage_enabled boolean not null default false,   -- allow metered overage past included credits
  overage_cap_cents int not null default 1000,      -- hard monthly overage cap ($10 default)
  overage_cents_this_period int not null default 0,
  storage_bytes bigint not null default 0,
  storage_quota_bytes bigint not null default 104857600, -- 100 MB free
  period_start timestamptz not null default date_trunc('month', now()),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- auto-create a profile when a user signs up (Google / GitHub OAuth)
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- subscriptions: mirror of Stripe subscription state (written by webhook only)
-- ---------------------------------------------------------------------------
create table if not exists public.subscriptions (
  id text primary key,                      -- Stripe subscription id
  user_id uuid not null references public.profiles(id) on delete cascade,
  status text not null,                     -- trialing | active | past_due | canceled | ...
  plan text not null,                       -- builder | pro | team
  price_id text,
  metered_item_id text,                     -- subscription item for token overage meter
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists subscriptions_user_idx on public.subscriptions(user_id);

-- ---------------------------------------------------------------------------
-- skills + versions
-- ---------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 64),
  name text not null,
  description text not null check (length(description) <= 1024),
  category text default 'Other',
  tags text[] default '{}',
  platforms text[] default '{agent-skills,cursor,claude}',
  visibility text not null default 'private' check (visibility in ('private','unlisted','public')),
  source text not null default 'generated' check (source in ('generated','imported','catalog','manual')),
  current_version_id uuid,
  installs int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (owner_id, slug)
);

create table if not exists public.skill_versions (
  id uuid primary key default gen_random_uuid(),
  skill_id uuid not null references public.skills(id) on delete cascade,
  version int not null,
  -- files: { "SKILL.md": "...", "references/tools.md": "...", ... }
  files jsonb not null,
  manifest jsonb not null default '{}'::jsonb,   -- skillco.json contents (tools, steps, sources)
  qa_report jsonb,
  change_note text,
  size_bytes int not null default 0,
  run_id uuid,
  created_at timestamptz not null default now(),
  unique (skill_id, version)
);

alter table public.skills
  drop constraint if exists skills_current_version_fk,
  add constraint skills_current_version_fk
  foreign key (current_version_id) references public.skill_versions(id) on delete set null;

-- ---------------------------------------------------------------------------
-- generation runs + usage events (metering source of truth)
-- ---------------------------------------------------------------------------
create table if not exists public.generation_runs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  input jsonb not null,
  status text not null default 'running' check (status in ('running','succeeded','failed')),
  steps jsonb not null default '[]'::jsonb,
  model_draft text,
  model_final text,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_usd numeric(10,5) not null default 0,
  credits int not null default 1,
  skill_id uuid references public.skills(id) on delete set null,
  error text,
  created_at timestamptz not null default now(),
  finished_at timestamptz
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('generation','tokens','storage','export')),
  quantity numeric not null,
  unit text not null,                         -- credit | token | byte | export
  overage boolean not null default false,
  run_id uuid references public.generation_runs(id) on delete set null,
  stripe_meter_event_id text,
  created_at timestamptz not null default now()
);
create index if not exists usage_owner_time_idx on public.usage_events(owner_id, created_at desc);

-- ---------------------------------------------------------------------------
-- knowledge base: sources + chunked cards with embeddings
-- ---------------------------------------------------------------------------
create table if not exists public.kb_sources (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('doc','llms_txt','changelog','x','reddit','blog','github')),
  platform text not null,                     -- agent-skills | cursor | claude-code | mcp | openai | gemini | ...
  title text not null,
  url text not null unique,
  author_handle text,
  vetted boolean not null default true,
  trust_score real not null default 1.0,
  refresh_interval interval not null default '7 days',
  content_hash text,
  last_fetched timestamptz,
  last_status int,
  created_at timestamptz not null default now()
);

create table if not exists public.kb_cards (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.kb_sources(id) on delete cascade,
  platform text not null,
  topic text,
  title text,
  content text not null,
  content_hash text not null,
  embedding vector(1536),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  unique (source_id, content_hash)
);
create index if not exists kb_cards_platform_idx on public.kb_cards(platform);
create index if not exists kb_cards_embedding_idx on public.kb_cards using hnsw (embedding vector_cosine_ops);

-- semantic search helper for the builder
create or replace function public.match_kb_cards(
  query_embedding vector(1536), match_count int default 8, platforms text[] default null
) returns table (id uuid, platform text, title text, content text, url text, similarity float)
language sql stable as $$
  select c.id, c.platform, c.title, c.content, s.url,
         1 - (c.embedding <=> query_embedding) as similarity
  from public.kb_cards c join public.kb_sources s on s.id = c.source_id
  where c.embedding is not null
    and (platforms is null or c.platform = any(platforms))
  order by c.embedding <=> query_embedding
  limit match_count
$$;

-- ---------------------------------------------------------------------------
-- updated_at triggers
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists profiles_touch on public.profiles;
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
drop trigger if exists skills_touch on public.skills;
create trigger skills_touch before update on public.skills for each row execute function public.touch_updated_at();
drop trigger if exists subs_touch on public.subscriptions;
create trigger subs_touch before update on public.subscriptions for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.skills enable row level security;
alter table public.skill_versions enable row level security;
alter table public.generation_runs enable row level security;
alter table public.usage_events enable row level security;
alter table public.kb_sources enable row level security;
alter table public.kb_cards enable row level security;

-- profiles: users read their own row; billing columns are only written by the service role
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id)
  with check (auth.uid() = id);
-- prevent users from editing billing fields through the anon key
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url, username, overage_enabled, overage_cap_cents) on public.profiles to authenticated;

create policy "subs_select_own" on public.subscriptions for select using (auth.uid() = user_id);

create policy "skills_select" on public.skills for select
  using (owner_id = auth.uid() or visibility in ('public','unlisted'));
create policy "skills_insert_own" on public.skills for insert with check (owner_id = auth.uid());
create policy "skills_update_own" on public.skills for update using (owner_id = auth.uid());
create policy "skills_delete_own" on public.skills for delete using (owner_id = auth.uid());

create policy "versions_select" on public.skill_versions for select using (
  exists (select 1 from public.skills s where s.id = skill_id
          and (s.owner_id = auth.uid() or s.visibility in ('public','unlisted'))));
create policy "versions_insert_own" on public.skill_versions for insert with check (
  exists (select 1 from public.skills s where s.id = skill_id and s.owner_id = auth.uid()));

create policy "runs_select_own" on public.generation_runs for select using (owner_id = auth.uid());
create policy "usage_select_own" on public.usage_events for select using (owner_id = auth.uid());

-- KB is readable by any signed-in user; written by the service role (cron) only
create policy "kb_sources_read" on public.kb_sources for select using (auth.role() = 'authenticated');
create policy "kb_cards_read" on public.kb_cards for select using (auth.role() = 'authenticated');

-- ---------------------------------------------------------------------------
-- Seed: official platform docs for the best-practices knowledge base
-- ---------------------------------------------------------------------------
insert into public.kb_sources (kind, platform, title, url) values
  ('doc',      'agent-skills', 'Agent Skills specification',            'https://agentskills.io/specification'),
  ('llms_txt', 'agent-skills', 'Agent Skills llms.txt',                 'https://agentskills.io/llms.txt'),
  ('doc',      'claude-code',  'Claude Code: Agent Skills',             'https://code.claude.com/docs/en/skills'),
  ('doc',      'claude-code',  'Claude Code: Plugins',                  'https://code.claude.com/docs/en/plugins'),
  ('doc',      'claude-code',  'Claude Code: Plugin marketplaces',      'https://code.claude.com/docs/en/plugin-marketplaces'),
  ('doc',      'claude',       'Anthropic: Skill authoring best practices', 'https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices'),
  ('doc',      'cursor',       'Cursor: Plugins',                       'https://cursor.com/docs/plugins'),
  ('doc',      'cursor',       'Cursor: Plugins reference',             'https://cursor.com/docs/reference/plugins'),
  ('doc',      'cursor',       'Cursor: Rules',                         'https://cursor.com/docs/context/rules'),
  ('doc',      'cursor',       'Cursor: Skills',                        'https://cursor.com/docs/context/skills'),
  ('doc',      'mcp',          'MCP specification',                     'https://modelcontextprotocol.io/specification/latest'),
  ('doc',      'mcp',          'MCP authorization',                     'https://modelcontextprotocol.io/specification/latest/basic/authorization'),
  ('llms_txt', 'mcp',          'MCP llms.txt',                          'https://modelcontextprotocol.io/llms.txt'),
  ('doc',      'openai',       'AGENTS.md',                             'https://agents.md'),
  ('doc',      'gemini',       'Gemini CLI extensions',                 'https://geminicli.com/docs/extensions/')
on conflict (url) do nothing;
