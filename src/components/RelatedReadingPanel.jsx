import React from 'react';
import { Link } from 'react-router-dom';

function RefGroup({ heading, refs }) {
  if (!refs || refs.length === 0) return null;
  return (
    <div className="mb-10">
      <div className="label-caps text-[#C9A84C] text-[9px] tracking-[0.25em] mb-5">{heading}</div>
      <div className="flex flex-col">
        {refs.map((ref, i) => (
          <Link
            key={`${ref.chapter_id}-${i}`}
            to={`/chapter/${ref.chapter_id}`}
            className="py-3 border-b border-[#1A1815] last:border-0 group"
          >
            {ref.hall_name && (
              <div className="label-caps text-[#3A3530] text-[8px] mb-1">{ref.hall_name}</div>
            )}
            <div
              style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.9rem', color: '#A89880' }}
              className="group-hover:text-[#E2DED0] transition-colors leading-snug"
            >
              {ref.label || ref.chapter_title}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * Desktop-only companion column. On narrower screens the chapter page renders
 * the same references inline beneath the prose instead.
 */
export default function RelatedReadingPanel({ crossReferences, relatedReading }) {
  const hasAny =
    (crossReferences?.length > 0) || (relatedReading?.length > 0);
  if (!hasAny) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-24">
        <RefGroup heading="Related Reading" refs={relatedReading} />
        <RefGroup heading="Cross-References" refs={crossReferences} />
      </div>
    </aside>
  );
}
