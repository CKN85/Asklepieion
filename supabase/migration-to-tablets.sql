-- ===========================================================================
-- Migration: Section/Chapter → Chapter/Tablet
--
-- Run this ONCE in your EXISTING project's SQL Editor — do NOT run schema.sql
-- again, it now describes the new names and expects a fresh database.
--
-- This only renames things. Nothing is deleted, and your 5 halls are
-- untouched. Renaming a table in Postgres keeps every row, every trigger,
-- and every security policy attached — they just move with the table.
-- ===========================================================================

begin;

-- Free up the name "chapters" by moving the old content table aside first.
alter table chapters rename to tablets;
alter table tablets rename column section_id to chapter_id;

-- The old folder table now takes the name "chapters".
alter table sections rename to chapters;

-- Cosmetic only — keeps trigger and policy names matching what they actually
-- do now. Nothing here changes behaviour.
alter trigger chapters_touch on tablets rename to tablets_touch;
alter trigger sections_touch on chapters rename to chapters_touch;

alter policy "sections readable by all" on chapters
  rename to "chapters readable by all";
alter policy "published chapters readable by all" on tablets
  rename to "published tablets readable by all";
alter policy "signed in can read all chapters" on tablets
  rename to "signed in can read all tablets";
alter policy "signed in can write sections" on chapters
  rename to "signed in can write chapters";
alter policy "signed in can write chapters" on tablets
  rename to "signed in can write tablets";

commit;

-- After this succeeds: Table Editor should show "chapters" (was your old
-- sections — the folders) and "tablets" (was your old chapters — the
-- content). Your 5 halls, and anything else you'd already created, are
-- unchanged.
