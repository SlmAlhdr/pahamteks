import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import WelcomePortal from './components/WelcomePortal';
import LearningHub from './components/LearningHub';
import CombinedDictTranslator from './components/CombinedDictTranslator';
import DashboardView from './components/DashboardView';
import KamusFloating from './components/KamusFloating';
import AuthModal from './components/AuthModal';
import BackgroundDrift from './components/BackgroundDrift';
import TeksieMascotCompanion from './components/TeksieMascotCompanion';
import CenterNotificationModal from './components/CenterNotificationModal';
import { Analytics2DIcon } from './components/Art2DIcons';
import { dict } from './utils/i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentLang, setCurrentLang] = useState('id');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [quizHistory, setQuizHistory] = useState([]);
  const [centerNotice, setCenterNotice] = useState(null);

  // Muat status user & riwayat dari localStorage (akun permanen) atau sessionStorage (guest)
  useEffect(() => {
    // 1. Cek akun permanen tersimpan di localStorage
    const savedUser = localStorage.getItem('pahamteks_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        const savedLogs = localStorage.getItem('pahamteks_logs');
        if (savedLogs) {
          setQuizHistory(JSON.parse(savedLogs));
        }
        return;
      } catch (err) {
        console.warn('[AppAuth] Failed to parse stored user, resetting state:', err.message);
        localStorage.removeItem('pahamteks_user');
      }
    }

    const savedGuest = sessionStorage.getItem('pahamteks_guest_user');
    if (savedGuest) {
      try {
        setUser(JSON.parse(savedGuest));
        const savedGuestLogs = sessionStorage.getItem('pahamteks_guest_logs');
        if (savedGuestLogs) {
          setQuizHistory(JSON.parse(savedGuestLogs));
        }
      } catch (err) {
        console.warn('[AppAuth] Failed to parse guest user, resetting state:', err.message);
        sessionStorage.removeItem('pahamteks_guest_user');
      }
    }
  }, []);

  // Ambil teks sesuai bahasa aktif, lalu gunakan Bahasa Indonesia sebagai fallback.
  const t = (key) => {
    return dict[currentLang]?.[key] || dict['id']?.[key] || key;
  };

  // Ganti bahasa UI antara Indonesia dan Inggris.
  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'id' ? 'en' : 'id');
  };

  // Buka modal akun pada alur login, daftar, atau reset yang dipilih.
  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  // Masuk sebagai Akun Tamu (Session-only, data hilang saat browser ditutup)
  const handleGuestLogin = () => {
    const guestUser = { name: 'Tamu (Guest)', isGuest: true };
    setUser(guestUser);
    sessionStorage.setItem('pahamteks_guest_user', JSON.stringify(guestUser));
    
    // Inisialisasi riwayat tamu dari sessionStorage jika ada
    const savedGuestLogs = sessionStorage.getItem('pahamteks_guest_logs');
    if (savedGuestLogs) {
      try {
        setQuizHistory(JSON.parse(savedGuestLogs));
      } catch (err) {
        console.warn('[AppHistory] Failed to parse guest logs:', err.message);
        setQuizHistory([]);
      }
    } else {
      setQuizHistory([]);
    }
    setActiveTab('home');
  };

  // Masuk/Daftar dengan Akun Permanen
  const handleAuthSuccess = (userData) => {
    const fullUser = { ...userData, isGuest: false };
    setUser(fullUser);
    localStorage.setItem('pahamteks_user', JSON.stringify(fullUser));
    sessionStorage.removeItem('pahamteks_guest_user');

    // Ambil riwayat tersimpan dari akun permanen
    const savedLogs = localStorage.getItem('pahamteks_logs');
    if (savedLogs) {
      try {
        setQuizHistory(JSON.parse(savedLogs));
      } catch (err) {
        console.warn('[AppHistory] Failed to parse permanent logs:', err.message);
        setQuizHistory([]);
      }
    }
    setActiveTab('home');
  };

  // Bersihkan sesi dan data sementara sebelum kembali ke beranda.
  const handleLogout = () => {
    const wasGuest = user?.isGuest;
    setUser(null);
    localStorage.removeItem('pahamteks_user');
    sessionStorage.removeItem('pahamteks_guest_user');
    sessionStorage.removeItem('pahamteks_guest_logs');
    setQuizHistory([]);
    setActiveTab('home');

    setCenterNotice({
      isOpen: true,
      title: wasGuest
        ? (currentLang === 'id' ? 'Sesi Tamu Diakhiri' : 'Guest Session Ended')
        : (currentLang === 'id' ? 'Sampai Jumpa!' : 'See You Soon!'),
      message: wasGuest
        ? (currentLang === 'id' ? 'Sesi tamu telah diakhiri. Data sementara telah dibersihkan.' : 'Guest session ended. Temporary data cleared.')
        : (currentLang === 'id' ? 'Anda berhasil keluar dari akun.' : 'Successfully logged out.'),
      icon: wasGuest ? '👋' : '✨',
      buttonText: currentLang === 'id' ? 'OK, Mengerti' : 'OK, Got It'
    });
  };

  // Tambahkan hasil kuis dan simpan sesuai jenis sesi pengguna.
  const handleFinishQuiz = (newLog) => {
    setQuizHistory(prev => {
      const updated = [newLog, ...prev];
      if (user?.isGuest) {
        // Simpan hanya di sessionStorage agar hilang saat browser ditutup
        sessionStorage.setItem('pahamteks_guest_logs', JSON.stringify(updated));
      } else {
        localStorage.setItem('pahamteks_logs', JSON.stringify(updated));
      }
      return updated;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Background Floating Greetings */}
      <BackgroundDrift />

      {/* Garis Blok Paling Atas (Full width dari samping ke samping) */}
      {user?.isGuest && (
        <div className="guest-top-banner">
          <div className="guest-top-banner-text">
            <span>{t('guest_notice_bar')}</span>
          </div>
          <div className="guest-top-banner-actions">
            <span
              className="guest-top-badge"
              style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => setActiveTab('account')}
              title="Klik untuk membuka Data Akun & Pelacakan Belajar"
            >
              <Analytics2DIcon size={14} color="#ffd700" />
              <span>{t('guest_badge')}</span>
            </span>
            <button
              className="btn-banner-upgrade"
              onClick={() => handleOpenAuth('register')}
              title="Daftar akun resmi agar data tersimpan permanen"
            >
              {t('guest_upgrade_btn')}
            </button>
            <button
              className="btn-banner-logout"
              onClick={handleLogout}
              title="Keluar dari sesi tamu"
            >
              {t('btn_logout')}
            </button>
          </div>
        </div>
      )}

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onGuestLogin={handleGuestLogin}
        onLogout={handleLogout}
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        t={t}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {!user ? (
          <WelcomePortal
            onAuthSuccess={handleAuthSuccess}
            onGuestLogin={handleGuestLogin}
            onOpenAuthModal={handleOpenAuth}
            currentLang={currentLang}
            t={t}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <HomeHero onNavigate={setActiveTab} t={t} currentLang={currentLang} />
            )}
            {activeTab === 'learning' && (
              <LearningHub
                t={t}
                currentLang={currentLang}
                onFinishQuiz={handleFinishQuiz}
              />
            )}
            {activeTab === 'dict_trans' && (
              <CombinedDictTranslator
                t={t}
                currentLang={currentLang}
              />
            )}
            {activeTab === 'account' && (
              <DashboardView
                t={t}
                user={user}
                history={quizHistory}
                onOpenAuth={handleOpenAuth}
                onBackHome={() => setActiveTab('home')}
                currentLang={currentLang}
              />
            )}
            {/* Fallback kompatibilitas jika navigasi memanggil nama tab spesifik */}
            {(activeTab === 'translator' || activeTab === 'dictionary') && (
              <CombinedDictTranslator
                t={t}
                currentLang={currentLang}
                initialSubTab={activeTab === 'translator' ? 'trans' : 'dict'}
              />
            )}
            {(activeTab === 'learn' || activeTab === 'coding') && (
              <LearningHub
                t={t}
                currentLang={currentLang}
                onFinishQuiz={handleFinishQuiz}
                initialMode={activeTab === 'coding' ? 'coding' : 'learn'}
              />
            )}
            {activeTab === 'tracking' && (
              <DashboardView
                t={t}
                user={user}
                history={quizHistory}
                onOpenAuth={handleOpenAuth}
                onBackHome={() => setActiveTab('home')}
                currentLang={currentLang}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Kamus AI HANYA muncul jika sudah login atau masuk sebagai guest */}
      {user && <KamusFloating t={t} currentLang={currentLang} />}

      {/* Maskot Teman Belajar Interaktif Teksie di Setiap Halaman */}
      {user && (
        <TeksieMascotCompanion
          activeTab={activeTab}
          currentLang={currentLang}
        />
      )}

      {/* Modal Autentikasi Pop-up */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        onGuestLogin={handleGuestLogin}
        t={t}
      />

      {/* Modal Notifikasi di Tengah Layar (Pengganti alert pop-up atas) */}
      {centerNotice?.isOpen && (
        <CenterNotificationModal
          isOpen={centerNotice.isOpen}
          onClose={() => setCenterNotice(null)}
          title={centerNotice.title}
          message={centerNotice.message}
          icon={centerNotice.icon}
          buttonText={centerNotice.buttonText}
        />
      )}

      {/* Watermark Footer */}
      <footer className="watermark-footer">
        <div className="watermark-inner">
          <div className="watermark-box">
            © 2026 PahamTeks. Global Edu & Tracking. Built with AI.
          </div>
        </div>
      </footer>
    </div>
  );
}
