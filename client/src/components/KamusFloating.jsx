import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_DICTIONARY } from '../graphql/queries';
import HumanFormattedText from './HumanFormattedText';
import { speakText } from '../utils/speechUtils';

const RANDOM_WORDS = [
  'Algorithm', 'Asynchronous', 'Polymorphism', 'Encapsulation', 'Database',
  'Repository', 'Middleware', 'Microservices', 'GraphQL', 'Bandwidth',
  'Encryption', 'Deprecation', 'Paradigm', 'Serendipity', 'Resilience'
];

export default function KamusFloating({ t, currentLang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');

  const [fetchDictionary, { loading }] = useLazyQuery(GET_DICTIONARY);

  // Cari definisi AI dari panel kamus mengambang.
  const handleSearch = async (kw = keyword) => {
    if (!kw.trim()) return;
    setResult(currentLang === 'id' ? 'Mencari penjelasan...' : 'Searching definition...');
    try {
      const res = await fetchDictionary({ variables: { keyword: kw, lang: currentLang } });
      if (res.data?.dictionary?.result) {
        setResult(res.data.dictionary.result);
      } else if (res.data?.dictionary?.error) {
        setResult(res.data.dictionary.error);
      }
    } catch (err) {
      setResult('AI Error: ' + err.message);
    }
  };

  // Pilih istilah acak untuk contoh pencarian cepat.
  const handleRandom = () => {
    const randomWord = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];
    setKeyword(randomWord);
    handleSearch(randomWord);
  };

  return (
    <>
      {/* Floating Button di Bawah Kanan */}
      <div className="floating-kamus-btn" onClick={() => setIsOpen(!isOpen)}>
        <span className="kamus-text">{t('dict_btn_float')}</span>
      </div>

      {/* Floating Kamus Modal */}
      {isOpen && (
        <div className="kamus-modal" style={{ display: 'flex' }}>
          <div className="kamus-header">
            <span>{t('dict_title')}</span>
            <span
              style={{ cursor: 'pointer', fontSize: '1.4rem' }}
              onClick={() => setIsOpen(false)}
            >
              &times;
            </span>
          </div>

          <div className="kamus-body">
            <div style={{ display: 'flex', gap: '5px' }}>
              <input
                type="text"
                placeholder={t('dict_ph')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid var(--card-border)',
                  color: 'white',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <button
                className="btn-huge btn-green"
                style={{
                  padding: '10px 16px',
                  minWidth: 'auto',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  textTransform: 'none',
                  fontWeight: 800
                }}
                onClick={handleRandom}
                title={currentLang === 'en' ? 'Pick a random word' : 'Pilih kata acak'}
              >
                {t('dict_btn_rand_short') || (currentLang === 'en' ? 'Random' : 'Acak')}
              </button>
            </div>

            <button
              className="btn-huge btn-cyan"
              style={{ padding: '10px', width: '100%', minWidth: 'auto', color: 'black', fontSize: '0.9rem' }}
              onClick={() => handleSearch()}
              disabled={loading || !keyword.trim()}
            >
              {loading ? (currentLang === 'en' ? 'Searching...' : 'Mencari...') : t('dict_btn')}
            </button>

            {result && (
              <div style={{ position: 'relative', marginTop: '5px' }}>
                <div id="float-kamus-result" style={{ display: 'block' }}>
                  <HumanFormattedText content={result} />
                </div>
                <button
                  id="btn-speak-float-kamus"
                  className="btn-speak"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    width: '34px',
                    height: '34px',
                    fontSize: '0.95rem',
                    zIndex: 2
                  }}
                  onClick={() => speakText(result, currentLang)}
                  title={currentLang === 'en' ? 'Listen to definition' : 'Baca Hasil'}
                >
                  Dengarkan
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
