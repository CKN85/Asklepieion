import React, { useRef, useState } from 'react';
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered, Quote, Code2,
  Link2, Image as ImageIcon, Sigma, Type, Pencil, Eye, ChevronDown,
} from 'lucide-react';
import { renderTabletBody } from '@/lib/renderMarkdown';

// Pasted/uploaded images are stored inline as base64 data URLs, right in the
// tablet's body text — there's no image hosting set up for this project, so
// this is what makes "paste an image and it just appears" work with zero
// extra infrastructure. The tradeoff is that a big image makes for a big
// database row, so a sane ceiling is enforced and the reader is told when
// they've hit it, rather than the paste silently doing nothing.
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const SIZES = [
  { label: 'Small',  size: '0.85em' },
  { label: 'Large',  size: '1.3em' },
  { label: 'Larger',  size: '1.7em' },
  { label: 'Huge',   size: '2.2em' },
];

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function ToolbarButton({ onClick, title, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="p-1.5 border border-[#2A2620] text-[#7A7268] hover:border-[#3A3530] hover:text-[#E2DED0] transition-colors"
    >
      {children}
    </button>
  );
}

export default function TabletBodyEditor({ value, onChange, placeholder, accent = '#3F8A66' }) {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mode, setMode] = useState('write'); // 'write' | 'preview'
  const [notice, setNotice] = useState('');
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);

  const flashNotice = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 6000);
  };

  // Every toolbar action and keyboard shortcut goes through here: replace
  // whatever's selected (or insert at the cursor if nothing is), then put
  // the cursor/selection back exactly where the edit implies it should be —
  // so clicking "Bold" on a word selects just that word afterward, ready to
  // keep typing, rather than dumping the cursor at the end of the textarea.
  const applyEdit = (build) => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const before = value.slice(0, start);
    const selected = value.slice(start, end);
    const after = value.slice(end);
    const { text, selStart, selEnd } = build(selected);

    onChange(before + text + after);

    requestAnimationFrame(() => {
      el.focus();
      const s = before.length + (selStart ?? text.length);
      const e = before.length + (selEnd ?? selStart ?? text.length);
      el.setSelectionRange(s, e);
    });
  };

  const toggleBold = () =>
    applyEdit((selected) => {
      if (selected.startsWith('**') && selected.endsWith('**') && selected.length >= 4) {
        const inner = selected.slice(2, -2);
        return { text: inner, selStart: 0, selEnd: inner.length };
      }
      const body = selected || 'bold text';
      return { text: `**${body}**`, selStart: 2, selEnd: 2 + body.length };
    });

  const toggleItalic = () =>
    applyEdit((selected) => {
      const isItalic =
        selected.startsWith('*') && !selected.startsWith('**') &&
        selected.endsWith('*') && !selected.endsWith('**') &&
        selected.length >= 2;
      if (isItalic) {
        const inner = selected.slice(1, -1);
        return { text: inner, selStart: 0, selEnd: inner.length };
      }
      const body = selected || 'italic text';
      return { text: `*${body}*`, selStart: 1, selEnd: 1 + body.length };
    });

  const prefixLines = (prefix, fallback) => () =>
    applyEdit((selected) => {
      const body = selected || fallback;
      const text = body.split('\n').map((line) => prefix + line).join('\n');
      return { text, selStart: 0, selEnd: text.length };
    });

  const toggleOrderedList = () =>
    applyEdit((selected) => {
      const body = selected || 'List item';
      const text = body.split('\n').map((line, i) => `${i + 1}. ${line}`).join('\n');
      return { text, selStart: 0, selEnd: text.length };
    });

  const toggleCode = () =>
    applyEdit((selected) => {
      const body = selected || 'code';
      if (body.includes('\n')) {
        const text = '```\n' + body + '\n```';
        return { text, selStart: 4, selEnd: 4 + body.length };
      }
      return { text: `\`${body}\``, selStart: 1, selEnd: 1 + body.length };
    });

  const insertLink = () =>
    applyEdit((selected) => {
      const label = selected || 'link text';
      const text = `[${label}](https://)`;
      const urlStart = 1 + label.length + 2;
      return { text, selStart: urlStart, selEnd: urlStart + 'https://'.length };
    });

  const insertMath = () =>
    applyEdit((selected) => {
      if (selected && selected.includes('\n')) {
        const text = `$$\n${selected}\n$$`;
        return { text, selStart: 3, selEnd: 3 + selected.length };
      }
      const body = selected || 'x^2 + y^2 = z^2';
      return { text: `$${body}$`, selStart: 1, selEnd: 1 + body.length };
    });

  const applySize = (size) => () => {
    setSizeMenuOpen(false);
    applyEdit((selected) => {
      const body = selected || 'text';
      const text = `<span style="font-size:${size}">${body}</span>`;
      const innerStart = text.indexOf('>') + 1;
      return { text, selStart: innerStart, selEnd: innerStart + body.length };
    });
  };

  const insertImage = (dataUrl) =>
    applyEdit(() => {
      const text = `\n\n![](${dataUrl})\n\n`;
      return { text, selStart: text.length, selEnd: text.length };
    });

  const handleImageFile = async (file) => {
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      flashNotice(
        `That image is ${(file.size / 1024 / 1024).toFixed(1)}MB — pasted images are stored inline and need to stay under 5MB. Try a smaller screenshot or a compressed export.`
      );
      return;
    }
    try {
      const dataUrl = await readFileAsDataURL(file);
      insertImage(dataUrl);
    } catch {
      flashNotice('Could not read that image — try again.');
    }
  };

  const handlePaste = (e) => {
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find((it) => it.type.startsWith('image/'));
    if (!imageItem) return; // ordinary text paste — let the browser handle it
    e.preventDefault();
    handleImageFile(imageItem.getAsFile());
  };

  const handleFileChosen = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    handleImageFile(file);
  };

  const handleKeyDown = (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (!mod) return;
    const key = e.key.toLowerCase();
    if (key === 'b') { e.preventDefault(); toggleBold(); }
    else if (key === 'i') { e.preventDefault(); toggleItalic(); }
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChosen}
        className="hidden"
      />

      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {mode === 'write' && (
            <>
              <ToolbarButton onClick={toggleBold} title="Bold (Ctrl+B)"><Bold size={13} /></ToolbarButton>
              <ToolbarButton onClick={toggleItalic} title="Italic (Ctrl+I)"><Italic size={13} /></ToolbarButton>
              <ToolbarButton onClick={prefixLines('## ', 'Heading')} title="Heading"><Heading2 size={13} /></ToolbarButton>
              <ToolbarButton onClick={prefixLines('### ', 'Subheading')} title="Subheading"><Heading3 size={13} /></ToolbarButton>
              <ToolbarButton onClick={prefixLines('- ', 'List item')} title="Bulleted list"><List size={13} /></ToolbarButton>
              <ToolbarButton onClick={toggleOrderedList} title="Numbered list"><ListOrdered size={13} /></ToolbarButton>
              <ToolbarButton onClick={prefixLines('> ', 'Quote')} title="Quote"><Quote size={13} /></ToolbarButton>
              <ToolbarButton onClick={toggleCode} title="Code"><Code2 size={13} /></ToolbarButton>
              <ToolbarButton onClick={insertLink} title="Link"><Link2 size={13} /></ToolbarButton>
              <ToolbarButton onClick={insertMath} title="Math ($inline$ or select multiple lines for $$block$$)"><Sigma size={13} /></ToolbarButton>
              <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Insert image"><ImageIcon size={13} /></ToolbarButton>

              <div className="relative">
                <ToolbarButton onClick={() => setSizeMenuOpen((v) => !v)} title="Text size">
                  <span className="flex items-center gap-0.5"><Type size={13} /><ChevronDown size={10} /></span>
                </ToolbarButton>
                {sizeMenuOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-[#1A1815] border border-[#2A2620] z-20 min-w-28">
                    {SIZES.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={applySize(s.size)}
                        className="block w-full text-left px-3 py-1.5 text-[#A89880] hover:bg-[#2A2620] hover:text-[#E2DED0] transition-colors text-xs"
                        style={{ fontFamily: 'Source Serif 4, Georgia, serif' }}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center border border-[#2A2620]">
          <button
            type="button"
            onClick={() => setMode('write')}
            className="flex items-center gap-1.5 label-caps text-[9px] tracking-[0.15em] px-3 py-1.5 transition-colors"
            style={mode === 'write' ? { color: accent, background: `${accent}1A` } : { color: '#3A3530' }}
          >
            <Pencil size={10} /> Write
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className="flex items-center gap-1.5 label-caps text-[9px] tracking-[0.15em] px-3 py-1.5 transition-colors border-l border-[#2A2620]"
            style={mode === 'preview' ? { color: accent, background: `${accent}1A` } : { color: '#3A3530' }}
          >
            <Eye size={10} /> Preview
          </button>
        </div>
      </div>

      {notice && (
        <div className="mb-2 px-3 py-2 border border-red-900/40 bg-red-950/20">
          <p style={{ fontFamily: 'Source Serif 4, Georgia, serif', fontSize: '0.8rem', color: '#F87171', fontStyle: 'italic' }}>
            {notice}
          </p>
        </div>
      )}

      {mode === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="w-full bg-[#0E0C09] border border-[#2A2620] text-[#E2DED0] px-4 py-4 focus:outline-none transition-colors placeholder:text-[#2A2620] resize-none"
          style={{
            fontFamily: 'Source Serif 4, Georgia, serif',
            fontSize: '1rem',
            lineHeight: '1.75',
            minHeight: '600px',
            borderColor: '#2A2620',
          }}
          onFocus={(e) => { e.target.style.borderColor = accent; }}
          onBlur={(e) => { e.target.style.borderColor = '#2A2620'; }}
        />
      ) : (
        <div
          className="prose-sanctum border border-[#2A2620] px-4 py-4 overflow-y-auto"
          style={{ minHeight: '600px' }}
          dangerouslySetInnerHTML={{
            __html: value
              ? renderTabletBody(value)
              : '<p style="color:#3A3530;font-style:italic">Nothing to preview yet — switch to Write and start typing.</p>',
          }}
        />
      )}
    </div>
  );
}
