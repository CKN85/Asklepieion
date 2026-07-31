# Admin mode — patch

Six files. Drop them into your project, overwriting where the path already
exists. Nothing else changes.

    src/hooks/useSession.js        NEW  — tracks whether you're signed in
    src/components/AdminBar.jsx    NEW  — the admin strip + draft badges
    src/components/SiteNav.jsx     replace
    src/pages/HallPage.jsx         replace
    src/pages/Archive.jsx          replace
    src/pages/ChapterPage.jsx      replace

## What changes

**When signed out** — nothing at all. The site looks and behaves exactly as it
does now. No admin strip, no drafts, no hint the admin area exists beyond the
quiet "Scribe's Chamber" link already in the footer.

**When signed in** — a thin bar appears along the bottom of every public page:
a gold dot, "ADMIN VIEW", your email, and links to the dashboard and sign-out.
On a chapter page it also shows **Edit this chapter**, which takes you straight
to that chapter in the editor.

Alongside that, your unpublished work becomes visible *to you* while browsing
the public site: drafts appear in hall listings and the Archive with a small
DRAFT tag, and an unpublished chapter carries a banner reading "Unpublished
draft — visible only to you."

## Why this is safe

The visibility is not a UI trick. The database policies decide what gets sent:
a signed-out visitor's request for drafts returns nothing, so there is nothing
in the page for anyone to uncover. If you sign out, the drafts vanish because
the server stops sending them — not because a class was toggled.

The session is also live. Sign out in another tab and the bar disappears here
without a refresh.
