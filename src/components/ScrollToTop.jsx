import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * React Router just swaps page content in place — it doesn't reset scroll
 * position. Without this, clicking a footer link (or any link while
 * scrolled down) leaves you looking at the bottom of the new page, often
 * its own footer, rather than the top.
 *
 * Render this once, anywhere inside the Router, and it handles every route
 * change on the whole site.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const firstRender = useRef(true);

  useEffect(() => {
    // Don't animate the very first load — only actual in-app navigations.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
  }, [pathname]);

  return null;
}
