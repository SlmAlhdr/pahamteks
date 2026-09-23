export const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * Normalizes question option text by removing prefixes like "A.", "1.", etc.
 */
export function cleanOptionText(raw) {
  if (raw == null) return '';
  return String(raw).trim().replace(/^[A-Ea-e1-5][.)\:\-\s]\s*/, '').trim();
}

/**
 * Validates whether a selected option matches the correct answer key
 */
export function isOptionCorrect(opt, index, q) {
  if (!q || !q.answer) return false;
  const targetLetter = LETTERS[index] || '';
  const rawAns = String(q.answer).trim();
  const cleanAns = rawAns.toUpperCase();
  const cleanOpt = cleanOptionText(opt).toUpperCase();
  const rawOpt = String(opt).trim().toUpperCase();

  if (cleanAns === targetLetter) return true;
  if (cleanAns.startsWith(targetLetter + '.') || cleanAns.startsWith(targetLetter + ')') || cleanAns.startsWith(targetLetter + ' ')) {
    return true;
  }
  if (cleanAns === cleanOpt || cleanAns === rawOpt) return true;

  const stripQuotes = (s) => s.replace(/['"`]/g, '').trim();
  if (stripQuotes(cleanAns) === stripQuotes(cleanOpt) || stripQuotes(cleanAns) === stripQuotes(rawOpt)) {
    return true;
  }

  return false;
}

