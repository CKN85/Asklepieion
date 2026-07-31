import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTablets } from "../lib/github.js";

// Cache the single listTablets() call across every Hall on the page,
// instead of each hall re-fetching the whole folder separately.
let cachedPromise = null;
function getAllTablets() {
  if (!cachedPromise) cachedPromise = listTablets();
  return cachedPromise;
}

export default function TabletList({ hall }) {
  const [state, setState] = useState({ status: "loading", tablets: [] });

  useEffect(() => {
    let cancelled = false;
    getAllTablets()
      .then((all) => {
        if (cancelled) return;
        const mine = all
          .filter((t) => t.hall === hall)
          .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
        setState({ status: "ready", tablets: mine });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ status: "error", tablets: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [hall]);

  if (state.status === "loading") {
    return (
      <ul className="tablet-list">
        <li className="empty">Loading Tablets…</li>
      </ul>
    );
  }
  if (state.status === "error") {
    return (
      <ul className="tablet-list">
        <li className="empty">Couldn't load Tablets — check src/config.js.</li>
      </ul>
    );
  }
  if (state.tablets.length === 0) {
    return (
      <ul className="tablet-list">
        <li className="empty">No Tablets in this hall yet.</li>
      </ul>
    );
  }
  return (
    <ul className="tablet-list">
      {state.tablets.map((t) => (
        <li key={t.slug}>
          <Link to={`/tablet/${t.slug}`}>
            {t.title || t.slug}
            {t.summary && <span className="summary">{t.summary}</span>}
          </Link>
        </li>
      ))}
    </ul>
  );
}
