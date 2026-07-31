-- ===========================================================================
-- Asklepieion — database schema
--
-- Paste this whole file into the Supabase SQL Editor and run it once.
-- It creates the three tables, seeds the five halls, and sets the security
-- rules that make the site readable by everyone and writable only by you.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table if not exists halls (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  greek_letter  text,
  latin_name    text,              -- the discipline, e.g. "Anatomy"
  slug          text unique not null,
  "order"       integer default 0, -- quoted: ORDER is a reserved SQL word
  created_date  timestamptz default now(),
  updated_date  timestamptz default now()
);

create table if not exists sections (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  hall_id       uuid references halls(id) on delete cascade,
  "order"       integer default 0,
  created_date  timestamptz default now(),
  updated_date  timestamptz default now()
);

create table if not exists chapters (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  hall_id               uuid references halls(id) on delete set null,
  section_id            uuid references sections(id) on delete set null,
  body                  text default '',
  status                text default 'draft',   -- 'draft' | 'published'
  reading_time_minutes  integer,
  cross_references      jsonb default '[]'::jsonb,
  related_reading       jsonb default '[]'::jsonb,
  created_date          timestamptz default now(),
  updated_date          timestamptz default now()
);

create index if not exists chapters_hall_idx    on chapters(hall_id);
create index if not exists chapters_section_idx on chapters(section_id);
create index if not exists chapters_status_idx  on chapters(status);

-- ---------------------------------------------------------------------------
-- Keep updated_date current automatically
-- ---------------------------------------------------------------------------

create or replace function touch_updated_date()
returns trigger language plpgsql as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

drop trigger if exists halls_touch on halls;
create trigger halls_touch before update on halls
  for each row execute function touch_updated_date();

drop trigger if exists sections_touch on sections;
create trigger sections_touch before update on sections
  for each row execute function touch_updated_date();

drop trigger if exists chapters_touch on chapters;
create trigger chapters_touch before update on chapters
  for each row execute function touch_updated_date();

-- ---------------------------------------------------------------------------
-- Security
--
-- This is the part that actually enforces "anyone may read, only I may write."
-- It runs on Supabase's servers, so it cannot be bypassed by editing the
-- website's JavaScript in a browser.
-- ---------------------------------------------------------------------------

alter table halls    enable row level security;
alter table sections enable row level security;
alter table chapters enable row level security;

-- Structure is public: any visitor can see the halls and their sections.
drop policy if exists "halls readable by all" on halls;
create policy "halls readable by all"
  on halls for select using (true);

drop policy if exists "sections readable by all" on sections;
create policy "sections readable by all"
  on sections for select using (true);

-- Visitors see only PUBLISHED chapters. Your drafts stay invisible until you
-- publish them — the browser never receives them at all.
drop policy if exists "published chapters readable by all" on chapters;
create policy "published chapters readable by all"
  on chapters for select using (status = 'published');

-- Signed-in users (i.e. you) can see everything, drafts included.
drop policy if exists "signed in can read all chapters" on chapters;
create policy "signed in can read all chapters"
  on chapters for select to authenticated using (true);

-- Only signed-in users can create, edit, or delete anything.
drop policy if exists "signed in can write halls" on halls;
create policy "signed in can write halls"
  on halls for all to authenticated using (true) with check (true);

drop policy if exists "signed in can write sections" on sections;
create policy "signed in can write sections"
  on sections for all to authenticated using (true) with check (true);

drop policy if exists "signed in can write chapters" on chapters;
create policy "signed in can write chapters"
  on chapters for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- Seed the five halls
-- ---------------------------------------------------------------------------

insert into halls (name, greek_letter, latin_name, slug, "order") values
  ('Trikka',    'Α', 'Anatomy',        'trikka',    1),
  ('Epidaurus', 'Β', 'Physiology',     'epidaurus', 2),
  ('Kos',       'Γ', 'Biochemistry',   'kos',       3),
  ('Pergamon',  'Δ', 'Histopathology', 'pergamon',  4),
  ('Athens',    'Ε', 'Ethics',         'athens',    5)
on conflict (slug) do nothing;
