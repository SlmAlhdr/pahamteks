import React from 'react';
import {
  TeksieNavMascot,
  Book2DIcon,
  Search2DIcon,
  Globe2DIcon,
  Analytics2DIcon,
  User2DIcon
} from './Art2DIcons';

export default function Navbar({
  activeTab,
  setActiveTab,
  user,
  onOpenAuth,
  onLogout,
  currentLang,
  onToggleLang,
  theme,
  onToggleTheme,
  t
}) {
  return (
    <div className="navbar">
      {/* Sisi Kiri: Maskot Teksie si Musang Cerdas + Logo PahamTeks */}
      <div className="nav-left">
        <div
          className="logo"
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          title="PahamTeks - Maskot: Teksie si Musang Cerdas"
        >
          <TeksieNavMascot size={32} />
          <span>Paham<span style={{ color: 'var(--btn-cyan)' }}>Teks</span></span>
        </div>
      </div>

      {/* Sisi Tengah: Menu Navigasi tepat di tengah pas */}
      {user ? (
        <div className="nav-links-wrapper">
          <div className="nav-links">
            <button
              className={`btn-nav ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3.5 10.5 12 4l8.5 6.5V20h-6v-6h-5v6h-6v-9.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
              </svg>
              {t('nav_home')}
            </button>
            <button
              className={`btn-nav ${activeTab === 'learning' ? 'active' : ''}`}
              onClick={() => setActiveTab('learning')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Book2DIcon size={16} />
              <span>{t('nav_learning')}</span>
            </button>
            <button
              className={`btn-nav ${activeTab === 'dict_trans' ? 'active' : ''}`}
              onClick={() => setActiveTab('dict_trans')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Search2DIcon size={14} />
              <span>{t('nav_dict_trans')}</span>
            </button>
            {user?.role === 'ADMIN' && (
              <button
                className={`btn-nav admin-nav-link ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => setActiveTab('admin')}
                title="Buka dashboard administrator"
              >
                <Analytics2DIcon size={14} />
                Admin
              </button>
            )}
            <button
              className="lang-toggle"
              onClick={onToggleLang}
              title="Ubah Bahasa / Switch Language"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Globe2DIcon size={14} />
              <span>{currentLang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Sisi Kanan: Penyeimbang simetris / Profil Akun Resmi jika login permanen */}
      <div className="nav-right-balancer">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Aktifkan mode siang' : 'Aktifkan mode malam'}
          title={theme === 'dark' ? 'Aktifkan mode siang' : 'Aktifkan mode malam'}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            {theme === 'dark' ? (
              <path d="M20.2 15.2A8.3 8.3 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <>
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
          <span>{theme === 'dark' ? 'Siang' : 'Malam'}</span>
        </button>
        {user && !user.isGuest ? (
          <div className="user-profile-header">
            <button
              className={`user-profile ${activeTab === 'account' ? 'active' : ''}`}
              onClick={() => setActiveTab('account')}
              title="Buka Data Akun & Pelacakan Belajar"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <User2DIcon size={14} />
              <span>{user?.username ? `@${user.username}` : user?.name}</span>
            </button>
            <button className="btn-logout" onClick={onLogout}>
              {t('btn_logout')}
            </button>
          </div>
        ) : !user ? (
          <button
            className="lang-toggle"
            onClick={onToggleLang}
            title="Ubah Bahasa / Switch Language"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Globe2DIcon size={14} />
            <span>{currentLang.toUpperCase()}</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
