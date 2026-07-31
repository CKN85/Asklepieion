# Asklepieion — setup

A complete, self-contained project: public site, admin interface, and database
schema. Content lives in Supabase (free); the site is hosted on GitHub Pages
(free). Nothing else to pay for.

---

## 1. Supabase

1. Sign up at https://supabase.com and create a project.
2. Open **SQL Editor**, paste in the whole of `supabase/schema.sql`, press
   **Run**. This creates the three tables, seeds the five halls, and sets the
   security rules.
3. **Authentication → Users → Add user → Create new user.** Use your email and
   a strong password, and tick "Auto Confirm User". This is your only admin
   account — don't create a second one.
4. **Project Settings → API.** Copy the **Project URL** and the **anon public**
   key into `src/api/config.js`.

Never copy the **service_role** key anywhere into this project. It bypasses
every security rule. The anon key is safe and is meant to be public.

## 2. Push to GitHub

Copy every file here into your repo (including the hidden `.github` folder),
commit, and push. In **Settings → Pages**, set **Source** to **GitHub
Actions**. The workflow builds and deploys on every push.

If your repo isn't named `Asklepieion`, change `base` in `vite.config.js` to
match — otherwise the page loads blank.

## 3. Write

- Public site: `https://ckn85.github.io/Asklepieion/`
- Admin: `https://ckn85.github.io/Asklepieion/#/admin`

Log in, add sections to a hall under **Halls & Sections**, then write chapters.
Chapters stay invisible until you press **Publish**.

## Running locally (optional)

```
npm install
npm run dev
```

---

## What's here

```
src/
  api/client.js       the data + auth layer (Supabase behind a simple interface)
  api/config.js       your project URL and public key
  pages/Home          floor plan; each wing enters a hall, the tholos the Archive
  pages/HallPage      one hall, its sections, and their published chapters
  pages/ChapterPage   the reading view
  pages/Archive       alphabetical index with search and hall filters
  pages/Admin*        dashboard, halls/sections, chapter list, chapter editor
  components/         nav, footer, reading progress, related-reading sidebar
supabase/schema.sql   tables, security policies, seed halls
```

## How the permissions work

Enforced by Supabase on the server, not by the interface:

- Anyone may read **published** chapters and the hall/section structure.
- **Drafts are never sent to the public at all** — not hidden by the UI,
  genuinely withheld.
- Only a signed-in session may create, edit, or delete anything.

`/admin` being a guessable address doesn't matter — it loads a login form and
does nothing without your password.

## Notes and caveats

- **Chapter bodies are raw HTML**, rendered with `dangerouslySetInnerHTML`.
  That's fine while you're the only author. Don't ever paste in HTML from a
  source you don't trust.
- **The Supabase free tier pauses after ~1 week of inactivity.** One click in
  the dashboard restores it and nothing is lost, but visitors during a pause
  see an error.
- **No automatic backups on the free tier.** Export your chapters
  periodically: Table Editor → `chapters` → Export CSV.
- `SiteNav`, `SiteFooter`, `ReadingProgress`, and `RelatedReadingPanel` were
  written fresh here — they were imported by your pages but weren't in what you
  pasted, so these are new implementations in the same palette.
