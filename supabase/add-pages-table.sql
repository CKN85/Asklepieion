-- ===========================================================================
-- Adds a "pages" table for admin-editable static pages (currently just
-- About), split into two fields: body (the mission) and author_note (the
-- credentials section) so they're editable independently.
--
-- Safe to run whether or not you already ran an earlier version of this
-- file — every statement below is idempotent.
-- ===========================================================================

create table if not exists pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  body          text default '',   -- "Why This Exists"
  author_note   text default '',   -- "The Author"
  created_date  timestamptz default now(),
  updated_date  timestamptz default now()
);

-- In case you already ran the earlier one-field version of this migration.
alter table pages add column if not exists author_note text default '';

create or replace function touch_updated_date()
returns trigger language plpgsql as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

drop trigger if exists pages_touch on pages;
create trigger pages_touch before update on pages
  for each row execute function touch_updated_date();

alter table pages enable row level security;

drop policy if exists "pages readable by all" on pages;
create policy "pages readable by all"
  on pages for select using (true);

drop policy if exists "signed in can write pages" on pages;
create policy "signed in can write pages"
  on pages for all to authenticated using (true) with check (true);

-- Seeds the About page. Only inserts if the row doesn't already exist, so
-- this is safe to run even a second time — it won't overwrite anything
-- you've already edited.
insert into pages (slug, title, body, author_note) values (
  'about',
  'Why This Exists',
  $md$Most textbooks summarise. That is not a criticism — it is what a textbook is for, and it is usually the right call for someone trying to cover a curriculum in a semester. But summary was never enough for the kind of reading medicine actually rewards: the anatomy that only makes sense once you understand the physiology sitting on top of it, the biochemistry that explains why a disease behaves the way it does, the pathology that ties the whole thing back to a patient in front of you. That connective reading exists, but it is scattered — a paragraph in one book, a diagram in another, a paper nobody assigns. Gathering it is its own separate skill, one nobody really teaches, and it is hardest exactly when you can least afford it: in first year, arriving from sixth form with no real practice at the kind of independent reading a medical degree demands.

The Asklepieion is an attempt to do that gathering once, properly, and leave the result somewhere anyone can use it. It is organised the way the ancient healing sanctuaries were laid out — a Hall for anatomy, one for physiology, one for biochemistry, one for histopathology, and a Propylon, a gate, for ethics, since that is not a subject finished once and left behind but a threshold crossed into every one of the others. Inside each Hall, Chapters, and inside each Chapter, Tablets: individual essays written to the depth a physician would actually want, not the depth an exam demands.

This is being built gradually, alongside my own medical studies, one Tablet at a time — not a finished reference but a working one. If you are a doctor reading this: the project exists precisely so that people with real clinical experience can check it, correct it, and tell me where a first year's understanding of a topic still has real gaps. That scrutiny is the whole point, not an afterthought.$md$,
  $md$**[Your name]** is a [year of study, e.g. "third-year"] medical student at [institution — optional, leave this out entirely if you'd rather not name it]. [A sentence or two on your own background, particular interests within medicine, or why this project matters to you — replace this whole placeholder paragraph with your own words.]$md$
)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- OPTIONAL — only run this part if you already ran the earlier one-field
-- version of this migration AND haven't edited the About page since. It
-- splits your existing combined body back into the two fields. Safe to skip
-- entirely if this is your first time running any pages migration, or if
-- you've already made edits you don't want overwritten.
-- ---------------------------------------------------------------------------

-- update pages
-- set
--   body = split_part(body, '## The Author', 1),
--   author_note = $md$**[Your name]** is a [year of study, e.g. "third-year"] medical student at [institution — optional, leave this out entirely if you'd rather not name it]. [A sentence or two on your own background, particular interests within medicine, or why this project matters to you — replace this whole placeholder paragraph with your own words.]$md$
-- where slug = 'about' and author_note = '' and body like '%## The Author%';
