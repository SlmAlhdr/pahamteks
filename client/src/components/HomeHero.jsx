import React from 'react';

export default function HomeHero({ onNavigate, t }) {
  return (
    <div className="page" style={{ width: '100%', maxWidth: '1000px' }}>
      <div className="hero">
        <h1>{t('hero_title')}</h1>
        <p>{t('hero_desc')}</p>
      </div>

      <div className="cards-container">
        {/* Card 1: Pembelajaran Bahasa (Bahasa Dunia & Pemrograman) */}
        <div className="feature-card">
          <h2>📚 {t('nav_learning')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('card_2_desc')} Asah juga logika pemrograman algoritma dalam satu modul belajar terintegrasi.
          </p>
          <button
            className="btn-huge btn-green"
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => onNavigate('learning')}
          >
            {t('nav_learning')}
          </button>
        </div>

        {/* Card 2: Kamus & Penerjemah AI */}
        <div className="feature-card">
          <h2>📖 {t('nav_dict_trans')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('card_1_desc')} Dilengkapi glosarium kosakata lengkap A - Z dan fitur komparasi wawasan bahasa.
          </p>
          <button
            className="btn-huge btn-cyan"
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => onNavigate('dict_trans')}
          >
            {t('nav_dict_trans')}
          </button>
        </div>

        {/* Card 3: Data Akun & Pelacakan Belajar */}
        <div className="feature-card">
          <h2>📊 {t('account_title')}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('account_subtitle')} Pantau tingkat akurasi dan riwayat pengerjaan kuis Anda.
          </p>
          <button
            className="btn-huge btn-grey"
            style={{ marginTop: 'auto', width: '100%' }}
            onClick={() => onNavigate('account')}
          >
            Buka Pelacakan Akun
          </button>
        </div>
      </div>
    </div>
  );
}

