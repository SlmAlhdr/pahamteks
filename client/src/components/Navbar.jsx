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
      {/* Sisi Kiri: Logo PahamTeks di pojok kiri */}
      <div className="nav-left">
        <div className="logo" onClick={() => setActiveTab('home')}>
          Paham<span style={{ color: 'var(--btn-cyan)' }}>Teks</span>
        </div>
      </div>

      {/* Sisi Tengah: Menu Navigasi tepat di tengah pas */}
      {user ? (
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
      ) : null}

      {/* Sisi Kanan: Penyeimbang simetris / Profil Akun Resmi jika login permanen */}
      <div className="nav-right-balancer">
        {user && !user.isGuest ? (
          <div className="user-profile-header">
            <div className="user-profile" title="Profil Akun Resmi">
              {user.name}
            </div>
            <button className="btn-logout" onClick={onLogout}>
              {t('btn_logout')}
            </button>
          </div>
        ) : !user ? (
          <button className="lang-toggle" onClick={onToggleLang} title="Ubah Bahasa / Switch Language">
            🌐 {currentLang.toUpperCase()}
          </button>
        ) : null}
      </div>
    </div>
  );
}
