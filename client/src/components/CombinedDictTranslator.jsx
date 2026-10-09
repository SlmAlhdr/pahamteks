import React, { useState } from 'react';
import DictionaryView from './DictionaryView';
import Translator from './Translator';
import LanguageInsights from './LanguageInsights';

export default function CombinedDictTranslator({ t, currentLang, initialSubTab = 'dict' }) {
  const [subTab, setSubTab] = useState(initialSubTab); // 'dict' | 'trans' | 'insights'

  return (
    <div className="page" style={{ width: '100%', maxWidth: '1050px' }}>
      {/* Sub-Navigasi Kapsul Terpadu: Kamus AI, Translator, & Wawasan Komparasi */}
      <div className="sub-tabs-container" style={{ margin: '10px auto 25px' }}>
        <button
          className={`sub-tab-btn ${subTab === 'dict' ? 'active' : ''}`}
          onClick={() => setSubTab('dict')}
        >
          {t('tab_dict')}
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'trans' ? 'active' : ''}`}
          onClick={() => setSubTab('trans')}
        >
          {t('tab_trans')}
        </button>
        <button
          className={`sub-tab-btn ${subTab === 'insights' ? 'active' : ''}`}
          onClick={() => setSubTab('insights')}
        >
          {t('tab_insights')}
        </button>
      </div>

      {/* Konten Sesuai Sub-Tab Terpilih */}
      {subTab === 'dict' && (
        <DictionaryView t={t} currentLang={currentLang} />
      )}
      {subTab === 'trans' && (
        <Translator t={t} currentLang={currentLang} />
      )}
      {subTab === 'insights' && (
        <LanguageInsights t={t} currentLang={currentLang} />
      )}
    </div>
  );
}
