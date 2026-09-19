import React from 'react';

export default function HomeHero({ onNavigate, t }) {
  return (
    <div className="page" style={{ width: '100%', maxWidth: '1000px' }}>
      <div className="hero">
        <h1>{t('hero_title')}</h1>
        <p>{t('hero_desc')}</p>
      </div>

      <div className="cards-container">
        {/* Card 1: Translator */}
        <div className="feature-card">
          <h2>{t('card_1_title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('card_1_desc')}
          </p>
          <button
            className="btn-huge btn-green"
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => onNavigate('translator')}
          >
            {t('nav_translator')}
          </button>
        </div>

        {/* Card 2: Bahasa Asing */}
        <div className="feature-card">
          <h2>{t('card_2_title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('card_2_desc')}
          </p>
          <button
            className="btn-huge btn-cyan"
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => onNavigate('learn')}
          >
            {t('btn_start_learn')}
          </button>
        </div>

        {/* Card 3: Ngoding / Pemrograman */}
        <div className="feature-card">
          <h2>{t('card_3_title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('card_3_desc')}
          </p>
          <button
            className="btn-huge btn-grey"
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => onNavigate('coding')}
          >
            {t('btn_start_code')}
          </button>
        </div>
      </div>
    </div>
  );
}

