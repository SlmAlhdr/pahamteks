import React, { useState } from 'react';

/**
 * Format string inline sederhana: **bold**, *italic*, dan `code`
 */
function renderInline(text) {
  if (!text) return null;

  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={idx} className="inline-code-pill">
          {part.slice(1, -1)}
        </code>
      );
    }

    // Split by bold: **text**
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**') && bPart.length >= 4) {
        const inner = bPart.slice(2, -2);
        // Cek apakah di dalam bold ada italic: *italic*
        return (
          <strong key={`${idx}-${bIdx}`} style={{ color: '#fff', fontWeight: 800 }}>
            {renderItalicOnly(inner)}
          </strong>
        );
      }
      return renderItalicOnly(bPart, `${idx}-${bIdx}`);
    });
  });
}

function renderItalicOnly(text, keyPrefix = '') {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('*') && p.endsWith('*') && p.length >= 2) {
      return (
        <em key={`${keyPrefix}-${i}`} style={{ color: 'var(--btn-cyan)', fontStyle: 'italic' }}>
          {p.slice(1, -1)}
        </em>
      );
    }
    return p;
  });
}

function CodeSnippet({ code, lang }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="human-code-box">
      <div className="human-code-header">
        <span>{lang || 'KODE'}</span>
        <button className="human-code-copy-btn" onClick={handleCopy}>
          {copied ? '✓ Tersalin' : 'Salin'}
        </button>
      </div>
      <pre className="human-code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function HumanFormattedText({ content }) {
  if (!content) return null;

  // 1. Bersihkan header kaku robotik dan garis pemisah markdown kasar
  let cleanText = content
    .replace(/^(\*{0,3}\s*)?Kamus\s+(Pintar\s+)?AI\s*(\*{0,3})?:?/gim, '')
    .replace(/^\s*[-*_]{3,}\s*$/gm, '') // hapus garis horizontal ---
    .trim();

  // 2. Pisahkan blok kode ```lang ... ```
  // Menggunakan regex untuk split blok kode
  const tokenRegex = /(```[\s\S]*?```)/g;
  const tokens = cleanText.split(tokenRegex);

  const elements = [];
  let metaBadges = [];

  tokens.forEach((token, tIdx) => {
    if (token.startsWith('```') && token.endsWith('```')) {
      // Ini blok kode
      const lines = token.slice(3, -3).trim().split('\n');
      let lang = 'code';
      let codeLines = lines;
      if (lines.length > 0 && /^[a-zA-Z0-9_\-]+$/.test(lines[0].trim())) {
        lang = lines[0].trim();
        codeLines = lines.slice(1);
      }
      elements.push(
        <CodeSnippet key={`code-${tIdx}`} code={codeLines.join('\n')} lang={lang} />
      );
    } else {
      // Ini teks biasa
      const lines = token.split('\n');

      let currentList = [];

      const flushList = () => {
        if (currentList.length > 0) {
          elements.push(
            <ul key={`ul-${elements.length}`} className="human-list">
              {currentList.map((item, lIdx) => (
                <li key={lIdx} className="human-list-item">
                  {renderInline(item)}
                </li>
              ))}
            </ul>
          );
          currentList = [];
        }
      };

      lines.forEach((rawLine, lIdx) => {
        const line = rawLine.trim();
        if (!line) {
          flushList();
          return;
        }

        // Cek metadata chip (Kata Kunci / Kategori)
        const metaMatch = line.match(/^\*{0,2}(Kata Kunci|Kategori|Keyword|Category):\*{0,2}\s*(.+)$/i);
        if (metaMatch) {
          flushList();
          metaBadges.push({
            label: metaMatch[1],
            value: metaMatch[2].replace(/^\*+|\*+$/g, '').trim()
          });
          return;
        }

        // Cek heading (### ... atau ## ... atau **Fungsi:** dsb)
        const headingMatch = line.match(/^(?:#{1,4}\s+|\*{2})([^:*]+)(?:\*{2}|:)?\s*$/);
        if (headingMatch && !line.startsWith('-') && !line.startsWith('*') && line.length < 60) {
          flushList();
          const title = headingMatch[1].replace(/^\*+|\*+$/g, '').trim();
          elements.push(
            <div key={`h-${elements.length}`} className="human-section-title">
              <span>📌</span> {title}
            </div>
          );
          return;
        }

        // Cek list item (- ... atau * ... atau 1. ...)
        const listMatch = line.match(/^[-*•]\s+(.+)$/) || line.match(/^(\d+[\.\)])\s+(.+)$/);
        if (listMatch) {
          const listText = listMatch[2] ? `${listMatch[1]} ${listMatch[2]}` : listMatch[1];
          currentList.push(listText);
          return;
        }

        // Paragraf biasa
        flushList();
        elements.push(
          <p key={`p-${elements.length}`} className="human-paragraph">
            {renderInline(line)}
          </p>
        );
      });

      flushList();
    }
  });

  return (
    <div className="human-text-container">
      {/* Tampilkan baris chip metadata jika ada */}
      {metaBadges.length > 0 && (
        <div className="human-meta-row">
          {metaBadges.map((badge, bIdx) => (
            <span key={bIdx} className="human-meta-badge">
              <strong>{badge.label}:</strong> {badge.value}
            </span>
          ))}
        </div>
      )}

      {elements}
    </div>
  );
}

