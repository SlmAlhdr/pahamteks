// Ucapkan teks dengan Web Speech API jika fitur tersedia di browser.
export function speakText(text, lang = 'id') {
  if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) {
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'id' ? 'id-ID' : 'en-US';
    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('[SpeechSynthesis] Failed to play audio:', err.message);
  }
}
