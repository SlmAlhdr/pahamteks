import React, { lazy, Suspense, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BackgroundDrift from './components/BackgroundDrift';
import { Analytics2DIcon } from './components/Art2DIcons';
import { dict } from './utils/i18n';
import { apolloClient } from './apolloClient';
import { GET_MY_QUIZ_HISTORY } from './graphql/queries';
import { SAVE_QUIZ_SCORE_MUTATION } from './graphql/mutations';

const HomeHero = lazy(() => import('./components/HomeHero'));
const WelcomePortal = lazy(() => import('./components/WelcomePortal'));
const LearningHub = lazy(() => import('./components/LearningHub'));
const CombinedDictTranslator = lazy(() => import('./components/CombinedDictTranslator'));
const DashboardView = lazy(() => import('./components/DashboardView'));
const AdminDashboardView = lazy(() => import('./components/AdminDashboardView'));
const KamusFloating = lazy(() => import('./components/KamusFloating'));
const AuthModal = lazy(() => import('./components/AuthModal'));
const CenterNotificationModal = lazy(() => import('./components/CenterNotificationModal'));

const getQuizHistoryStorageKey = (userId) => `pahamteks_logs_${userId}`;
const getTopicProgressStorageKey = (userId) => `pahamteks_topic_progress_${userId}`;

function restoreProgressFromHistory(history, userId) {
  const progressByTopic = {};
  for (const item of history) {
    if (!item.topic || !Number.isInteger(item.unit) || item.unit < 1 || item.unit > 5) continue;
    const progress = progressByTopic[item.topic] || { currentUnit: 1, completedUnits: [] };
    if (!progress.completedUnits.includes(item.unit)) progress.completedUnits.push(item.unit);
    progressByTopic[item.topic] = progress;
  }

  for (const progress of Object.values(progressByTopic)) {
    const highestCompleted = Math.max(...progress.completedUnits);
    progress.currentUnit = Math.min(highestCompleted + 1, 5);
  }

  if (Object.keys(progressByTopic).length) {
    const storageKey = getTopicProgressStorageKey(userId);
    let localProgress = {};
    try {
      const parsed = JSON.parse(localStorage.getItem(storageKey) || '{}');
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) localProgress = parsed;
    } catch (err) {
      console.warn('[AppHistory] Failed to parse local topic progress:', err.message);
    }
    for (const [topic, remote] of Object.entries(progressByTopic)) {
      const existing = localProgress[topic] || { currentUnit: 1, completedUnits: [] };
      const completedUnits = Array.from(new Set([...(existing.completedUnits || []), ...remote.completedUnits]));
      const highestCompleted = Math.max(...completedUnits);
      localProgress[topic] = {
        completedUnits,
        currentUnit: Math.max(existing.currentUnit || 1, Math.min(highestCompleted + 1, 5))
      };
    }
    localStorage.setItem(storageKey, JSON.stringify(localProgress));
  }
}

function refreshQuizHistoryFromServer(userId) {
  return apolloClient.query({
    query: GET_MY_QUIZ_HISTORY,
    variables: { limit: 100 },
    fetchPolicy: 'network-only'
  }).then(({ data }) => {
    const remoteHistory = data?.myQuizHistory || [];
    localStorage.setItem(getQuizHistoryStorageKey(userId), JSON.stringify(remoteHistory));
    restoreProgressFromHistory(remoteHistory, userId);
    return remoteHistory;
  });
}

const isAdminPath = (path = window.location.pathname) => (
  path.replace(/\/+$/, '').toLowerCase() === '/admin'
);

export default function App() {
  const [activeTab, setActiveTabState] = useState(() => (
    isAdminPath() ? 'admin' : 'home'
  ));
  const [currentLang, setCurrentLang] = useState('id');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [quizHistory, setQuizHistory] = useState([]);
  const [centerNotice, setCenterNotice] = useState(null);

  // Gunakan URL langsung untuk halaman admin dan root untuk tab aplikasi lainnya.
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    const nextPath = tab === 'admin' ? '/admin' : '/';
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
  };

  useEffect(() => {
    const syncTabWithUrl = () => {
      setActiveTabState(isAdminPath() ? 'admin' : 'home');
    };
    window.addEventListener('popstate', syncTabWithUrl);
    return () => window.removeEventListener('popstate', syncTabWithUrl);
  }, []);

  // Muat status user & riwayat dari localStorage (akun permanen) atau sessionStorage (guest)
  useEffect(() => {
    // 1. Cek akun permanen tersimpan di localStorage
    const savedUser = localStorage.getItem('pahamteks_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Sesi lama tanpa token server tidak boleh dianggap sebagai login terverifikasi.
        if (typeof parsedUser?.token === 'string' && parsedUser.token) {
          setUser(parsedUser);
          const savedLogs = localStorage.getItem(getQuizHistoryStorageKey(parsedUser.id)) || localStorage.getItem('pahamteks_logs');
          if (savedLogs) {
            setQuizHistory(JSON.parse(savedLogs));
          }
          refreshQuizHistoryFromServer(parsedUser.id)
            .then(setQuizHistory)
            .catch((err) => {
              console.warn('[AppHistory] Failed to refresh quiz history from server:', err.message);
            });
          return;
        }
        localStorage.removeItem('pahamteks_user');
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
    apolloClient.clearStore().catch((err) => {
      console.warn('[AppAuth] Failed to clear cached GraphQL data after login:', err.message);
    });
    setUser(fullUser);
    localStorage.setItem('pahamteks_user', JSON.stringify(fullUser));
    sessionStorage.removeItem('pahamteks_guest_user');

    // Ambil riwayat tersimpan dari akun permanen
    const savedLogs = localStorage.getItem(getQuizHistoryStorageKey(fullUser.id)) || localStorage.getItem('pahamteks_logs');
    if (savedLogs) {
      try {
        setQuizHistory(JSON.parse(savedLogs));
      } catch (err) {
        console.warn('[AppHistory] Failed to parse permanent logs:', err.message);
        setQuizHistory([]);
      }
    }
    refreshQuizHistoryFromServer(fullUser.id)
      .then(setQuizHistory)
      .catch((err) => {
        console.warn('[AppHistory] Failed to load quiz history from server:', err.message);
      });
    setActiveTab(fullUser.role === 'ADMIN' ? 'admin' : 'home');
  };

  // Bersihkan sesi dan data sementara sebelum kembali ke beranda.
  const handleLogout = () => {
    const wasGuest = user?.isGuest;
    // Bersihkan cache Apollo agar data privat sesi sebelumnya tidak tertinggal setelah logout.
    apolloClient.clearStore().catch((err) => {
      console.warn('[AppAuth] Failed to clear cached GraphQL data:', err.message);
    });
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
        const storageKey = getQuizHistoryStorageKey(user?.id || 'account');
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }
      return updated;
    });
    if (user && !user.isGuest) {
      const { topic, unit, unitTitle, answers, level, score, total } = newLog;
      apolloClient.mutate({
        mutation: SAVE_QUIZ_SCORE_MUTATION,
        variables: { topic, unit, unitTitle, answersJson: JSON.stringify(answers || []), level, score, total }
      }).then(({ data }) => {
        if (data?.saveQuizScore !== true) {
          console.warn('[AppHistory] Server did not confirm saving quiz history.');
        }
      }).catch((err) => {
        console.warn('[AppHistory] Failed to save quiz history to server:', err.message);
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Background Floating Greetings */}
      <BackgroundDrift />

      {/* Garis Blok Paling Atas (Full width dari samping ke samping) */}
      {user?.isGuest && (
        <div className="guest-top-banner">
          <div className="guest-top-banner-text">
            <span className="guest-notice-mark" aria-hidden="true">i</span>
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
      <Suspense fallback={
        <div
          role="status"
          style={{ width: '100%', minHeight: '45vh', display: 'grid', placeItems: 'center', color: 'var(--text-muted)' }}
        >
          {currentLang === 'en' ? 'Loading page...' : 'Memuat halaman...'}
        </div>
      }>
        <main style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {!user ? (
          <WelcomePortal
            onAuthSuccess={handleAuthSuccess}
            onGuestLogin={handleGuestLogin}
            onOpenAuthModal={handleOpenAuth}
            onTabChange={setActiveTab}
            initialTab={activeTab === 'admin' ? 'admin' : 'login'}
            currentLang={currentLang}
            t={t}
          />
        ) : (
          <>
            {activeTab === 'admin' && (
              <AdminDashboardView
                user={user}
                onBackHome={() => setActiveTab('home')}
                onSwitchToAdmin={() => {
                  handleLogout();
                  setActiveTab('admin');
                }}
              />
            )}
            {activeTab === 'home' && (
              <HomeHero onNavigate={setActiveTab} t={t} currentLang={currentLang} />
            )}
            {activeTab === 'learning' && (
              <LearningHub
                t={t}
                currentLang={currentLang}
                onFinishQuiz={handleFinishQuiz}
                progressScope={user?.isGuest ? 'guest' : user?.id}
                isGuest={Boolean(user?.isGuest)}
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
                progressScope={user?.isGuest ? 'guest' : user?.id}
                isGuest={Boolean(user?.isGuest)}
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
      </Suspense>

      {/* Floating Kamus AI HANYA muncul jika sudah login atau masuk sebagai guest */}
      {user && <Suspense fallback={null}><KamusFloating t={t} currentLang={currentLang} /></Suspense>}

      {/* Modal Autentikasi Pop-up */}
      {isAuthOpen && (
        <Suspense fallback={null}>
          <AuthModal
            isOpen={isAuthOpen}
            initialMode={authInitialMode}
            onClose={() => setIsAuthOpen(false)}
            onAuthSuccess={handleAuthSuccess}
            onGuestLogin={handleGuestLogin}
            t={t}
          />
        </Suspense>
      )}

      {/* Modal Notifikasi di Tengah Layar (Pengganti alert pop-up atas) */}
      {centerNotice?.isOpen && (
        <Suspense fallback={null}>
          <CenterNotificationModal
            isOpen={centerNotice.isOpen}
            onClose={() => setCenterNotice(null)}
            title={centerNotice.title}
            message={centerNotice.message}
            icon={centerNotice.icon}
            buttonText={centerNotice.buttonText}
          />
        </Suspense>
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
