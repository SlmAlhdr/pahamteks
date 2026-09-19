import React from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  currentLang,
  onToggleLang,
  t
}) {
  return (
    <div className="navbar">
      <div className="nav-left">
        <div className="logo" onClick={() => setActiveTab('home')}>
          Paham<span style={{ color: 'var(--btn-cyan)' }}>Teks</span>
        </div>
      </div>

      <div className="nav-links-wrapper">
        <div className="nav-links">
          <button
            className={`btn-nav ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
          >
            {t('nav_home')}
          </button>
          <button
            className={`btn-nav ${activeTab === 'translator' ? 'active' : ''}`}
            onClick={() => setActiveTab('translator')}
          >
            {t('nav_translator')}
          </button>
          <button
            className={`btn-nav ${activeTab === 'learn' ? 'active' : ''}`}
            onClick={() => setActiveTab('learn')}
          >
            {t('nav_learn')}
          </button>
          <button
            className={`btn-nav ${activeTab === 'coding' ? 'active' : ''}`}
            onClick={() => setActiveTab('coding')}
          >
            {t('nav_coding')}
          </button>
          <button
            className={`btn-nav ${activeTab === 'dictionary' ? 'active' : ''}`}
            onClick={() => setActiveTab('dictionary')}
          >
            {t('nav_dictionary')}
          </button>
          <button
            className={`btn-nav ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
            style={{ color: 'var(--btn-cyan)' }}
          >
            {t('nav_dashboard')}
          </button>
          <button className="lang-toggle" onClick={onToggleLang} title="Ubah Bahasa / Switch Language">
            🌐 {currentLang.toUpperCase()}
          </button>
        </div>
      </div>

      <div className="nav-right">
        {user ? (
          <>
            <div className="user-profile" title="Profil Anda">
              👤 {user.name}
            </div>
            <button className="btn-logout" onClick={onLogout}>
              {t('btn_logout')}
            </button>
          </>
        ) : (
          <>
            <button className="btn-auth" onClick={() => onOpenAuth('login')}>
              {t('btn_login')}
            </button>
            <button className="btn-auth primary" onClick={() => onOpenAuth('register')}>
              {t('btn_register')}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
