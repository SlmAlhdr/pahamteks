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
              className={`btn-nav ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveTab('learning')}
            >
              📚 {t('nav_learning')}
            </button>
            <button
              className={`btn-nav ${activeTab === 'dict_trans' ? 'active' : ''}`}
              onClick={() => setActiveTab('dict_trans')}
            >
              📖 {t('nav_dict_trans')}
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
            <button
              className={`user-profile ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
              title="Buka Data Akun & Pelacakan Belajar"
            >
              📊 {user.name}
            </button>
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
