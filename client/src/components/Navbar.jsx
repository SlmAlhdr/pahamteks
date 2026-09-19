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
      {/* Baris Utama: Logo di kiri, Menu di tengah */}
      <div className="navbar-main">
        <div className="nav-left">
          <div className="logo" onClick={() => setActiveTab('home')}>
            Paham<span style={{ color: 'var(--btn-cyan)' }}>Teks</span>
          </div>
        </div>

        {/* Menu Navigasi (Hanya muncul jika sudah login atau masuk sebagai Akun Tamu) */}
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

        {/* Sisi Kanan Penyeimbang Simetris Desktop */}
        <div className="nav-right-balancer">
          {!user && (
            <button className="lang-toggle" onClick={onToggleLang} title="Ubah Bahasa / Switch Language">
              🌐 {currentLang.toUpperCase()}
            </button>
          )}
        </div>
      </div>

      {/* Baris Kedua (DI BAWAH MENU): Akun Tamu, Buat Akun Resmi, dan Keluar */}
      {user && (
        <div className="navbar-sub-row">
          {user.isGuest ? (
            <div className="guest-action-bar">
              <span className="guest-navbar-badge" title="Data sesi bersifat sementara">
                {t('guest_badge')}
              </span>
              <button
                className="btn-auth primary guest-sub-upgrade"
                onClick={() => onOpenAuth('register')}
                title="Daftar akun resmi agar data tersimpan permanen"
              >
                {t('guest_upgrade_btn')}
              </button>
              <button className="btn-logout" onClick={onLogout}>
                {t('btn_logout')}
              </button>
            </div>
          ) : (
            <div className="user-action-bar">
              <div className="user-profile" title="Profil Akun Resmi">
                {user.name}
              </div>
              <button className="btn-logout" onClick={onLogout}>
                {t('btn_logout')}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
