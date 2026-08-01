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

create table if not exists chapters (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  hall_id       uuid references halls(id) on delete cascade,
  "order"       integer default 0,
  created_date  timestamptz default now(),
  updated_date  timestamptz default now()
);

create table if not exists tablets (
  id                    uuid primary key default gen_random_uuid(),
  title                 text not null,
  hall_id               uuid references halls(id) on delete set null,
  chapter_id            uuid references chapters(id) on delete set null,
  body                  text default '',
  status                text default 'draft',   -- 'draft' | 'published'
  reading_time_minutes  integer,
  cross_references      jsonb default '[]'::jsonb,
  related_reading       jsonb default '[]'::jsonb,
  created_date          timestamptz default now(),
  updated_date          timestamptz default now()
);

create index if not exists tablets_hall_idx    on tablets(hall_id);
create index if not exists tablets_chapter_idx on tablets(chapter_id);
create index if not exists tablets_status_idx  on tablets(status);

-- Admin-editable static pages (About, and any others added later).
create table if not exists pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  body          text default '',   -- "Why This Exists"
  author_note   text default '',   -- "The Author"
  created_date  timestamptz default now(),
  updated_date  timestamptz default now()
);

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

drop trigger if exists chapters_touch on chapters;
create trigger chapters_touch before update on chapters
  for each row execute function touch_updated_date();

drop trigger if exists tablets_touch on tablets;
create trigger tablets_touch before update on tablets
  for each row execute function touch_updated_date();

drop trigger if exists pages_touch on pages;
create trigger pages_touch before update on pages
  for each row execute function touch_updated_date();

-- ---------------------------------------------------------------------------
-- Security
--
-- This is the part that actually enforces "anyone may read, only I may write."
-- It runs on Supabase's servers, so it cannot be bypassed by editing the
-- website's JavaScript in a browser.
-- ---------------------------------------------------------------------------

alter table halls    enable row level security;
alter table chapters enable row level security;
alter table tablets enable row level security;
alter table pages    enable row level security;

-- Structure is public: any visitor can see the halls and their chapters.
drop policy if exists "halls readable by all" on halls;
create policy "halls readable by all"
  on halls for select using (true);

drop policy if exists "chapters readable by all" on chapters;
create policy "chapters readable by all"
  on chapters for select using (true);

-- Visitors see only PUBLISHED tablets. Your drafts stay invisible until you
-- publish them — the browser never receives them at all.
drop policy if exists "published tablets readable by all" on tablets;
create policy "published tablets readable by all"
  on tablets for select using (status = 'published');

-- Signed-in users (i.e. you) can see everything, drafts included.
drop policy if exists "signed in can read all tablets" on tablets;
create policy "signed in can read all tablets"
  on tablets for select to authenticated using (true);

-- Only signed-in users can create, edit, or delete anything.
drop policy if exists "signed in can write halls" on halls;
create policy "signed in can write halls"
  on halls for all to authenticated using (true) with check (true);

drop policy if exists "signed in can write chapters" on chapters;
create policy "signed in can write chapters"
  on chapters for all to authenticated using (true) with check (true);

drop policy if exists "signed in can write tablets" on tablets;
create policy "signed in can write tablets"
  on tablets for all to authenticated using (true) with check (true);

drop policy if exists "pages readable by all" on pages;
create policy "pages readable by all"
  on pages for select using (true);

drop policy if exists "signed in can write pages" on pages;
create policy "signed in can write pages"
  on pages for all to authenticated using (true) with check (true);

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

-- ---------------------------------------------------------------------------
-- Seed the About page
-- ---------------------------------------------------------------------------

insert into pages (slug, title, body, author_note) values (
  'about',
  'Why This Exists',
  $md$Most textbooks summarise. That is not a criticism — it is what a textbook is for, and it is usually the right call for someone trying to cover a curriculum in a semester. But summary was never enough for the kind of reading medicine actually rewards: the anatomy that only makes sense once you understand the physiology sitting on top of it, the biochemistry that explains why a disease behaves the way it does, the pathology that ties the whole thing back to a patient in front of you. That connective reading exists, but it is scattered — a paragraph in one book, a diagram in another, a paper nobody assigns. Gathering it is its own separate skill, one nobody really teaches, and it is hardest exactly when you can least afford it: in first year, arriving from sixth form with no real practice at the kind of independent reading a medical degree demands.

The Asklepieion is an attempt to do that gathering once, properly, and leave the result somewhere anyone can use it. It is organised the way the ancient healing sanctuaries were laid out — a Hall for anatomy, one for physiology, one for biochemistry, one for histopathology, and a Propylon, a gate, for ethics, since that is not a subject finished once and left behind but a threshold crossed into every one of the others. Inside each Hall, Chapters, and inside each Chapter, Tablets: individual essays written to the depth a physician would actually want, not the depth an exam demands.

This is being built gradually, alongside my own medical studies, one Tablet at a time — not a finished reference but a working one. If you are a doctor reading this: the project exists precisely so that people with real clinical experience can check it, correct it, and tell me where a first year's understanding of a topic still has real gaps. That scrutiny is the whole point, not an afterthought.$md$,
  $md$**[Your name]** is a [year of study, e.g. "third-year"] medical student at [institution — optional, leave this out entirely if you'd rather not name it]. [A sentence or two on your own background, particular interests within medicine, or why this project matters to you — replace this whole placeholder paragraph with your own words.]$md$
)
on conflict (slug) do nothing;
