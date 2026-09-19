import React from 'react';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onGuestLogin,
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
          user.isGuest ? (
            <>
              <div className="guest-navbar-badge" title="Data akan hilang saat browser ditutup">
                👤 {t('guest_badge')}
              </div>
              <button
                className="btn-auth primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => onOpenAuth('register')}
                title="Daftar akun permanen untuk menyimpan progres"
              >
                💾 {t('guest_upgrade_btn')}
              </button>
              <button className="btn-logout" onClick={onLogout}>
                {t('btn_logout')}
              </button>
            </>
          ) : (
            <>
              <div className="user-profile" title="Profil Anda">
                👤 {user.name}
              </div>
              <button className="btn-logout" onClick={onLogout}>
                {t('btn_logout')}
              </button>
            </>
          )
        ) : (
          <>
            <button className="btn-auth" onClick={() => onOpenAuth('login')}>
              {t('btn_login')}
            </button>
            <button className="btn-auth primary" onClick={() => onOpenAuth('register')}>
              {t('btn_register')}
            </button>
            {onGuestLogin && (
              <button
                className="btn-auth"
                style={{ borderColor: 'rgba(255, 159, 67, 0.6)', color: '#ff9f43' }}
                onClick={onGuestLogin}
                title="Mode Tamu (Sesi Sementara)"
              >
                🚀 {t('guest')}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
