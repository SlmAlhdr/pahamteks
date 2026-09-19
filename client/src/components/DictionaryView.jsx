import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_DICTIONARY } from '../graphql/queries';

const QUICK_WORDS = [
  'Algorithm', 'Asynchronous', 'Polymorphism', 'Encapsulation', 'Database',
  'Middleware', 'Microservices', 'GraphQL', 'Bandwidth', 'Encryption',
  'Syntax Error', 'Deprecation', 'Paradigm', 'Serendipity', 'Resilience'
];

export default function DictionaryView({ t, currentLang }) {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');

  const [fetchDictionary, { loading }] = useLazyQuery(GET_DICTIONARY);

  const handleSearch = async (kw = keyword) => {
    if (!kw.trim()) return;
    setResult(currentLang === 'id' ? 'Menghubungkan ke server AI...' : 'Connecting to AI server...');
    try {
      const res = await fetchDictionary({ variables: { keyword: kw } });
      if (res.data?.dictionary?.result) {
        setResult(res.data.dictionary.result);
      } else if (res.data?.dictionary?.error) {
        setResult(res.data.dictionary.error);
      }
    } catch (err) {
      setResult('⚠️ AI Error: ' + err.message);
    }
  };

  const handleRandom = () => {
    const randomWord = QUICK_WORDS[Math.floor(Math.random() * QUICK_WORDS.length)];
    setKeyword(randomWord);
    handleSearch(randomWord);
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = currentLang === 'id' ? 'id-ID' : 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="page" style={{ width: '100%', maxWidth: '850px' }}>
      <div className="hero" style={{ marginBottom: '25px' }}>
        <h1>{t('dict_page_title')}</h1>
        <p>{t('dict_page_desc')}</p>
      </div>

      <div className="input-group" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <input
            type="text"
            className="auth-input"
            style={{ margin: 0, flex: 1, padding: '16px', fontSize: '1.1rem' }}
            placeholder={t('dict_ph')}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="btn-huge btn-green"
            style={{ minWidth: '100px', padding: '12px 20px' }}
            onClick={handleRandom}
          >
            {t('dict_btn_rand')}
          </button>
        </div>

        <button
          className="btn-huge btn-cyan"
          style={{ width: '100%' }}
          onClick={() => handleSearch()}
          disabled={loading || !keyword.trim()}
        >
          {loading ? 'Mencari...' : t('dict_btn')}
        </button>

        {result && (
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--btn-cyan)',
            borderRadius: '12px',
            padding: '20px',
            marginTop: '20px',
            position: 'relative',
            lineHeight: 1.7,
            whiteSpace: 'pre-line'
          }}>
            <button
              className="btn-speak"
              style={{ position: 'absolute', top: '15px', right: '15px', width: '35px', height: '35px' }}
              onClick={() => speakText(result)}
              title="Dengarkan Arti"
            >
              🔊
            </button>
            <div style={{ paddingRight: '45px' }}>{result}</div>
          </div>
        )}

        {/* Quick word list */}
        <div style={{ marginTop: '25px' }}>
          <h4 style={{ color: 'var(--text-muted)', marginBottom: '10px', fontSize: '0.95rem' }}>
            {t('dict_word_list')}
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {QUICK_WORDS.map((w, idx) => (
              <button
                key={idx}
                className="btn-outline"
                style={{
                  padding: '6px 14px',
                  borderRadius: '15px',
                  fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.15)'
                }}
                onClick={() => { setKeyword(w); handleSearch(w); }}
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

