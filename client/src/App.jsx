import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHero from './components/HomeHero';
import Translator from './components/Translator';
import QuizView from './components/QuizView';
import DictionaryView from './components/DictionaryView';
import DashboardView from './components/DashboardView';
import KamusFloating from './components/KamusFloating';
import AuthModal from './components/AuthModal';
import BackgroundDrift from './components/BackgroundDrift';
import { dict } from './utils/i18n';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentLang, setCurrentLang] = useState('id');
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState('login');
  const [quizHistory, setQuizHistory] = useState([]);

  // Muat preferensi user & riwayat dari localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('pahamteks_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('pahamteks_user');
      }
    }

    const savedLogs = localStorage.getItem('pahamteks_logs');
    if (savedLogs) {
      try {
        setQuizHistory(JSON.parse(savedLogs));
      } catch (e) {
        setQuizHistory([]);
      }
    }
  }, []);

  const t = (key) => {
    return dict[currentLang]?.[key] || dict['id']?.[key] || key;
  };

  const toggleLanguage = () => {
    setCurrentLang(prev => prev === 'id' ? 'en' : 'id');
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthInitialMode(mode);
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('pahamteks_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('pahamteks_user');
    localStorage.removeItem('pahamteks_logs');
    setQuizHistory([]);
    setActiveTab('home');
    alert(currentLang === 'id' ? 'Anda berhasil keluar.' : 'Successfully logged out.');
  };

  const handleFinishQuiz = (newLog) => {
    setQuizHistory(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('pahamteks_logs', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      {/* Background Floating Greetings */}
      <BackgroundDrift />

      {/* Navbar Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        currentLang={currentLang}
        onToggleLang={toggleLanguage}
        t={t}
      />

      {/* Main Content Pages */}
      <main style={{ flex: 1, width: '100%', display: 'flex', justifyContent: 'center' }}>
        {activeTab === 'home' && (
          <HomeHero onNavigate={setActiveTab} t={t} />
        )}
        {activeTab === 'translator' && (
          <Translator t={t} currentLang={currentLang} />
        )}
        {activeTab === 'learn' && (
          <QuizView mode="learn" t={t} currentLang={currentLang} onFinishQuiz={handleFinishQuiz} />
        )}
        {activeTab === 'coding' && (
          <QuizView mode="coding" t={t} currentLang={currentLang} onFinishQuiz={handleFinishQuiz} />
        )}
        {activeTab === 'dictionary' && (
          <DictionaryView t={t} currentLang={currentLang} />
        )}
        {activeTab === 'tracking' && (
          <DashboardView t={t} history={quizHistory} />
        )}
      </main>

      {/* Floating Kamus AI di Bawah Kanan */}
      <KamusFloating t={t} currentLang={currentLang} />

      {/* Modal Autentikasi */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        t={t}
      />

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
