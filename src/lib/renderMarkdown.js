// ---------------------------------------------------------------------------
// Turns a Tablet's stored body (Markdown, with LaTeX math and any raw HTML
// the author typed directly) into the final HTML shown on the page.
//
// Math has to be pulled out and rendered *before* the text reaches marked —
// otherwise Markdown mangles it (an underscore inside a subscript reads as
// italics, a backslash disappears, etc). So the order is:
//
//   1. Find every $$...$$ block and $...$ inline span, render each with
//      KaTeX, and swap it for a short placeholder token built from control
//      characters that Markdown has no rules for and will never touch.
//   2. Run the rest of the text through marked, exactly as before.
//   3. Swap the placeholders back out for the rendered KaTeX HTML.
//
// A tablet with no $ in it at all round-trips through this unchanged.
// ---------------------------------------------------------------------------

import { marked } from 'marked';
import katex from 'katex';

marked.setOptions({ breaks: true });

const PLACEHOLDER_OPEN = 'MATH';
const PLACEHOLDER_CLOSE = '';

function renderMath(expr, displayMode) {
  try {
    return katex.renderToString(expr, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
    });
  } catch {
    // If KaTeX itself throws (rather than just annotating an error span),
    // fall back to showing the raw source rather than losing the content.
    const wrapper = displayMode ? 'div' : 'span';
    return `<${wrapper} class="katex-error" title="Could not render this expression">${expr}</${wrapper}>`;
  }
}

export function renderTabletBody(source) {
  if (!source) return '';

  const stash = [];
  const stow = (html) => {
    const token = `${PLACEHOLDER_OPEN}${stash.length}${PLACEHOLDER_CLOSE}`;
    stash.push(html);
    return token;
  };

  // Block math first ($$...$$), so a $$ pair is never re-read as two
  // separate inline $...$ spans by the next pass.
  let working = source.replace(/\$\$([\s\S]+?)\$\$/g, (_, expr) =>
    stow(renderMath(expr.trim(), true))
  );

  // Inline math ($...$). Follows the same convention Pandoc and most
  // Markdown-plus-math tools use, precisely so ordinary prices in a
  // sentence ("costs $5 and $12.50") are never mistaken for math:
  //   - no newline inside the span
  //   - the character right after the opening $ can't be whitespace
  //   - the character right before the closing $ can't be whitespace
  //     ("$5 and $12.50" fails here — there's a space before the second $)
  //   - the character right after the closing $, and right before the
  //     opening $, can't be a digit (so "$x$5" / "12$x$" fusions can't
  //     happen either)
  working = working.replace(
    /\$([^\s$](?:[^$\n]*[^\s$])?)\$/g,
    (match, expr, offset, str) => {
      const before = str[offset - 1];
      const after = str[offset + match.length];
      if ((before && /\d/.test(before)) || (after && /\d/.test(after))) return match;
      return stow(renderMath(expr.trim(), false));
    }
  );

  const html = marked.parse(working);

  return html.replace(
    new RegExp(`${PLACEHOLDER_OPEN}(\\d+)${PLACEHOLDER_CLOSE}`, 'g'),
    (_, i) => stash[Number(i)]
  );
}
