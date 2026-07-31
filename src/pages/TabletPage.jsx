import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Footer from "../components/Footer.jsx";
import { getTablet } from "../lib/github.js";
import { HALLS_BY_ID, hallLabel } from "../data/halls.js";

export default function TabletPage() {
  const { slug } = useParams();
  const [state, setState] = useState({ status: "loading", tablet: null });

  useEffect(() => {
    let cancelled = false;
    window.scrollTo(0, 0);
    setState({ status: "loading", tablet: null });

    getTablet(slug)
      .then((tablet) => { if (!cancelled) setState({ status: "ready", tablet }); })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setState({ status: "error", tablet: null });
      });

    return () => { cancelled = true; };
  }, [slug]);

  useEffect(() => {
    document.title = state.tablet
      ? `${state.tablet.title} — Asklepieion`
      : "Asklepieion";
  }, [state.tablet]);

  const tablet = state.tablet;
  const hall = tablet ? HALLS_BY_ID[tablet.hall] : null;

  return (
    <>
      <main className="tablet-page">
        <Link className="back-link" to={hall ? `/hall/${hall.id}` : "/"}>
          ←{" "}
          {hall
            ? hall.kind === "propylon"
              ? "The Propylon"
              : `Hall of ${hall.name}`
            : "The Sanctuary"}
        </Link>

        {state.status === "loading" && <p className="status">Loading Tablet…</p>}

        {state.status === "error" && (
          <p className="status">
            This Tablet couldn't be read. It may have been renamed or moved.
          </p>
        )}

        {state.status === "ready" && tablet && (
          <>
            <span className="eyebrow">{hallLabel(tablet.hall)}</span>
            <h1>{tablet.title || "Untitled Tablet"}</h1>
            <p className="meta">
              {tablet.date
                ? new Date(tablet.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""}
            </p>
            <div className="meander" style={{ margin: "2.5rem 0 0", maxWidth: "160px", marginLeft: 0 }} aria-hidden="true" />
            <div className="tablet-body">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {tablet.body || ""}
              </ReactMarkdown>
            </div>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
