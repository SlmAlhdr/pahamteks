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

      {/* Menu navigasi HANYA muncul jika sudah login atau sudah masuk sebagai Akun Tamu */}
      {user && (
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
      )}

      {/* Sisi Kanan Navbar */}
      <div className="nav-right">
        {user ? (
          user.isGuest ? (
            <>
              <div className="guest-navbar-badge" title="Data sesi bersifat sementara">
                {t('guest_badge')}
              </div>
              <button
                className="btn-auth primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={() => onOpenAuth('register')}
                title="Daftar akun resmi agar data tersimpan permanen"
              >
                {t('guest_upgrade_btn')}
              </button>
              <button className="btn-logout" onClick={onLogout}>
                {t('btn_logout')}
              </button>
            </>
          ) : (
            <>
              <div className="user-profile" title="Profil Akun Resmi">
                {user.name}
              </div>
              <button className="btn-logout" onClick={onLogout}>
                {t('btn_logout')}
              </button>
            </>
          )
        ) : (
          /* Saat belum login: Tampilan bersih, hanya tombol ganti bahasa */
          <button className="lang-toggle" onClick={onToggleLang} title="Ubah Bahasa / Switch Language">
            🌐 {currentLang.toUpperCase()}
          </button>
        )}
      </div>
    </div>
  );
}
