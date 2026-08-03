-- ===========================================================================
-- Adds manual ordering to Tablets, to match the "order" column Halls and
-- Chapters already have — this is what lets you drag Tablets into a
-- specific order within a Chapter (and Chapters within a Hall) from
-- /admin/halls, rather than always seeing them in whatever order Supabase
-- happens to return.
--
-- Safe to run whether or not you've already run this before — every
-- statement is idempotent, and the one-time backfill below only touches
-- rows if NOTHING has ever been manually reordered yet, so re-running this
-- will never undo a drag you've already done.
-- ===========================================================================

alter table tablets add column if not exists "order" integer default 0;

create index if not exists tablets_order_idx on tablets(hall_id, chapter_id, "order");

-- One-time backfill: gives existing Tablets a sensible starting order
-- (oldest first, grouped by which Hall/Chapter they're filed under) instead
-- of leaving them all at the default 0. Only runs if every Tablet is still
-- at the default — i.e. only on the very first run, before you've dragged
-- anything.
do $$
begin
  if not exists (select 1 from tablets where "order" <> 0) then
    with ranked as (
      select id, row_number() over (
        partition by hall_id, chapter_id
        order by created_date asc
      ) as rn
      from tablets
    )
    update tablets t
    set "order" = ranked.rn
    from ranked
    where t.id = ranked.id;
  end if;
end $$;
