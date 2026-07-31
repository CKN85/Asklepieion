import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getTablet } from "../lib/github.js";

const HALL_LABELS = {
  trikka: "Hall of Trikka · Anatomy",
  epidaurus: "Hall of Epidaurus · Physiology",
  kos: "Hall of Kos · Biochemistry",
  pergamon: "Hall of Pergamon · Histopathology",
  ethics: "The Propylon · Ethics",
};

export default function TabletPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", tablet: null });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", tablet: null });
    getTablet(slug)
      .then((tablet) => {
        if (!cancelled) setState({ status: "ready", tablet });
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ status: "error", tablet: null });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    document.title = state.tablet ? `${state.tablet.title} — Asklepieion` : "Asklepieion";
  }, [state.tablet]);

  return (
    <main className="tablet-page">
      <Link className="back-link" to="/">&larr; Back to the Asklepieion</Link>

      {state.status === "loading" && <p className="status">Loading Tablet…</p>}

      {state.status === "error" && (
        <p className="status">
          Couldn't load this Tablet. It may have been moved or renamed, or
          src/config.js needs updating.
        </p>
      )}

      {state.status === "ready" && state.tablet && (
        <>
          <span className="eyebrow">{HALL_LABELS[state.tablet.hall] || state.tablet.hall}</span>
          <h1>{state.tablet.title || "Untitled Tablet"}</h1>
          <p className="meta">
            {state.tablet.date
              ? new Date(state.tablet.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : ""}
          </p>
          <div className="tablet-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{state.tablet.body || ""}</ReactMarkdown>
          </div>
        </>
      )}
    </main>
  );
}
