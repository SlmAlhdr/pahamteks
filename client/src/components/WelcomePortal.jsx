import React, { useEffect, useState } from 'react';
import { useMutation } from '@apollo/client';
import {
  LOGIN_MUTATION,
  ADMIN_LOGIN_MUTATION,
  REGISTER_MUTATION,
  SEND_OTP_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION
} from '../graphql/mutations';
import {
  CharacterCluster,
  PeekingPointer,
  AkiCat,
  BittoBot,
  TeksieFox,
  LukiCivet
} from './MiniCharacters';
import {
  Book2DIcon,
  Interactive2DIcon,
  Lightning2DIcon,
  Analytics2DIcon,
  Globe2DIcon,
  AudioSpeaker2DIcon,
  Search2DIcon,
  Lightbulb2DIcon,
  Sparkle2DIcon,
  Rocket2DIcon,
  User2DIcon,
  Trophy2DIcon,
  CodeTag2DIcon
} from './Art2DIcons';

export default function WelcomePortal({
  onAuthSuccess,
  onGuestLogin,
  initialTab = 'login',
  onTabChange,
  currentLang,
  t
}) {
  const [activeTab, setActiveTab] = useState(initialTab); // login, admin, register, atau forgot
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [adminLoginMutation, { loading: adminLoginLoading }] = useMutation(ADMIN_LOGIN_MUTATION);
  const [registerMutation, { loading: regLoading }] = useMutation(REGISTER_MUTATION);
  const [sendOtpMutation, { loading: otpLoading }] = useMutation(SEND_OTP_MUTATION);
  const [requestResetMutation, { loading: resetReqLoading }] = useMutation(REQUEST_PASSWORD_RESET_MUTATION);
  const [resetPasswordMutation, { loading: resetLoading }] = useMutation(RESET_PASSWORD_MUTATION);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Minta kode verifikasi email sebelum pendaftaran.
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setStatusMsg({ text: 'Masukkan alamat email terlebih dahulu.', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await sendOtpMutation({ variables: { email } });
      if (res.data?.sendOtp?.success) {
        setStatusMsg({ text: t('auth_otp_msg'), isError: false });
      } else {
        setStatusMsg({ text: res.data?.sendOtp?.message || 'Gagal mengirim kode verifikasi.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  // Minta OTP reset berdasarkan email atau username.
  const handleRequestPasswordReset = async () => {
    if (!email.trim()) {
      setStatusMsg({ text: 'Masukkan email atau username akun Anda!', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await requestResetMutation({ variables: { email } });
      if (res.data?.requestPasswordReset?.success) {
        setStatusMsg({ text: res.data.requestPasswordReset.message, isError: false });
      } else {
        setStatusMsg({ text: res.data?.requestPasswordReset?.message || 'Gagal meminta reset kata sandi', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  // Validasi formulir lalu kirim OTP dan kata sandi baru ke server.
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!email.trim() || !otp.trim() || !newPassword.trim()) {
      setStatusMsg({ text: 'Harap lengkapi semua kolom!', isError: true });
      return;
    }
    if (newPassword.length < 6) {
      setStatusMsg({ text: 'Kata sandi baru minimal 6 karakter!', isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatusMsg({ text: 'Konfirmasi kata sandi tidak cocok!', isError: true });
      return;
    }

    setStatusMsg({ text: '', isError: false });
    try {
      const res = await resetPasswordMutation({
        variables: { email, otp, newPassword }
      });
      if (res.data?.resetPassword?.success) {
        setStatusMsg({ text: res.data.resetPassword.message, isError: false });
        setTimeout(() => {
          setActiveTab('login');
          setPassword('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
        }, 1800);
      } else {
        setStatusMsg({ text: res.data?.resetPassword?.message || 'Gagal mereset kata sandi', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  // Kirim kredensial dan teruskan data akun saat login berhasil.
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await loginMutation({ variables: { email, password } });
      if (res.data?.login?.success) {
        onAuthSuccess(res.data.login.user);
      } else {
        setStatusMsg({ text: res.data?.login?.message || 'Email/username atau kata sandi tidak cocok.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  // Verifikasi login admin melalui API sebelum membuka dashboard privat.
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await adminLoginMutation({ variables: { email: email.trim().toLowerCase(), password } });
      if (res.data?.adminLogin?.success && res.data.adminLogin.user?.role === 'ADMIN') {
        onAuthSuccess(res.data.adminLogin.user);
      } else {
        setStatusMsg({ text: res.data?.adminLogin?.message || 'Kredensial admin tidak valid.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  // Daftarkan akun dengan email, username, kata sandi, dan OTP.
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setStatusMsg({ text: 'Silakan isi username unik untuk akun Anda!', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await registerMutation({
        variables: { email, password, username: username.trim(), otp }
      });
      if (res.data?.register?.success) {
        onAuthSuccess(res.data.register.user);
      } else {
        setStatusMsg({ text: res.data?.register?.message || 'Registrasi akun gagal diproses.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div className="welcome-portal">
      {/* SECTION 1: HERO SPLIT DENGAN MASKOT & KARTU LOGIN */}
      <div className="welcome-hero-split">
        {/* Kolom Kiri: Visual Karakter Ceria & Tagline Menarik */}
        <div className="welcome-hero-left">
          <div className="welcome-badge-pill">
            <Book2DIcon size={18} color="#38bdf8" />
            <span>{t('welcome_badge')}</span>
          </div>
          <h1 className="welcome-hero-title">
            {t('welcome_hero_tag')}
          </h1>
          <p className="welcome-hero-desc">
            {t('welcome_hero_sub')}
          </p>

          {/* Kluster Karakter Mini Lengkap (4 Karakter Interaktif) */}
          <CharacterCluster currentLang={currentLang} />

          {/* Highlights Mini Pills (2D Vector Art Icons) */}
          <div className="welcome-perks-pills">
            <span className="perk-pill">
              <Interactive2DIcon size={16} />
              <span>100% Interaktif</span>
            </span>
            <span className="perk-pill">
              <Lightning2DIcon size={16} />
              <span>Kuis Cepat & Adaptif</span>
            </span>
            <span className="perk-pill">
              <Analytics2DIcon size={16} />
              <span>Pelacakan Akurat</span>
            </span>
          </div>
        </div>

        {/* Kolom Kanan: Karakter Nongol Menunjuk Tombol + Kartu Autentikasi */}
        <div className="welcome-hero-right">
          <PeekingPointer
            activeTab={activeTab}
            onPointerClick={() => {
              setActiveTab('register');
              setStatusMsg({ text: '', isError: false });
            }}
            t={t}
            currentLang={currentLang}
          />

          <div className="welcome-card-wrapper">
        {/* Tab Switcher */}
        {activeTab === 'forgot' || activeTab === 'admin' ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              {activeTab === 'admin' ? 'Login Administrator' : t('auth_reset_title')}
            </h3>
            <button
              type="button"
              className="welcome-tab-btn"
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
              onClick={() => {
                setActiveTab('login');
                setAdminPassword('');
                setStatusMsg({ text: '', isError: false });
                if (onTabChange) {
                  onTabChange('home');
                } else if (window.location.pathname.replace(/\/+$/, '').toLowerCase() === '/admin') {
                  window.history.pushState({}, '', '/');
                }
              }}
            >
              {t('auth_back_to_login')}
            </button>
          </div>
        ) : (
          <div className="welcome-tabs">
            <button
              type="button"
              className={`welcome-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('login');
                setStatusMsg({ text: '', isError: false });
              }}
            >
              {t('welcome_login_tab')}
            </button>
            <button
              type="button"
              className={`welcome-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('register');
                setStatusMsg({ text: '', isError: false });
              }}
            >
              {t('welcome_reg_tab')}
            </button>
          </div>
        )}

        {/* Status / Error Message */}
        {statusMsg.text && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '12px',
              fontSize: '0.9rem',
              background: statusMsg.isError ? 'rgba(255, 71, 87, 0.18)' : 'rgba(88, 204, 2, 0.18)',
              color: statusMsg.isError ? 'var(--wrong)' : 'var(--correct)',
              border: `1px solid ${statusMsg.isError ? 'rgba(255, 71, 87, 0.4)' : 'rgba(88, 204, 2, 0.4)'}`,
              lineHeight: 1.4
            }}
            dangerouslySetInnerHTML={{ __html: statusMsg.text }}
          />
        )}

        {/* Tab Form: Login */}
        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_email_or_user')}
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="nama@email.com atau username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                  {t('auth_ph_pass')}
                </label>
                <span
                  style={{ fontSize: '0.82rem', color: 'var(--btn-cyan)', cursor: 'pointer', fontWeight: 700 }}
                  onClick={() => {
                    setActiveTab('forgot');
                    setStatusMsg({ text: '', isError: false });
                  }}
                >
                  {t('auth_forgot_pass')}
                </span>
              </div>
              <input
                type="password"
                className="auth-input"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-huge btn-green"
              style={{ width: '100%', marginTop: '6px', minWidth: 'unset' }}
              disabled={loginLoading}
            >
              {loginLoading ? 'Memproses...' : t('auth_btn_login')}
            </button>
          </form>
        )}

        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <p className="admin-login-hint">Gunakan email yang terdaftar di ADMIN_EMAILS dan kata sandi akun pribadi Anda.</p>
            <label className="admin-login-label" htmlFor="welcome-admin-email">Email admin</label>
            <input
              id="welcome-admin-email"
              type="email"
              className="auth-input"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="admin-login-label" htmlFor="welcome-admin-account-password">Password akun</label>
            <input
              id="welcome-admin-account-password"
              type="password"
              className="auth-input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="btn-huge btn-green"
              style={{ width: '100%', marginTop: '6px', minWidth: 'unset' }}
              disabled={adminLoginLoading}
            >
              {adminLoginLoading ? 'Memverifikasi…' : 'Masuk ke Dashboard Admin'}
            </button>
          </form>
        )}

        {/* Tab Form: Pendaftaran Akun Resmi */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            {/* 1 Kotak Username Saja */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_username')}
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder={t('auth_ph_username_hint')}
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_email')}
              </label>
              <div className="auth-row">
                <input
                  type="email"
                  className="auth-input"
                  placeholder="nama@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-huge btn-cyan"
                  style={{
                    minWidth: '115px',
                    padding: '12px 14px',
                    fontSize: '0.85rem',
                    borderRadius: '14px',
                    flexShrink: 0
                  }}
                  onClick={handleSendOtp}
                  disabled={otpLoading || !email.trim()}
                >
                  {otpLoading ? '...' : 'Kirim Kode'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Kode Verifikasi Email (6 Digit)
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Masukkan 6 digit kode verifikasi"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_pass')}
              </label>
              <input
                type="password"
                className="auth-input"
                placeholder="Minimal 6 karakter"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-huge btn-green"
              style={{ width: '100%', marginTop: '6px', minWidth: 'unset' }}
              disabled={regLoading}
            >
              {regLoading ? 'Memproses...' : t('auth_btn_verify')}
            </button>
          </form>
        )}

        {/* Tab Form: Reset Password (Lupa Kata Sandi) */}
        {activeTab === 'forgot' && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: '0 0 10px', lineHeight: 1.5 }}>
              {t('auth_reset_desc')}
            </p>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_email_or_user')}
              </label>
              <div className="auth-row">
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Email terdaftar akun Anda"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  type="button"
                  className="btn-huge btn-cyan"
                  style={{
                    minWidth: '120px',
                    padding: '12px 14px',
                    fontSize: '0.85rem',
                    borderRadius: '14px',
                    flexShrink: 0
                  }}
                  onClick={handleRequestPasswordReset}
                  disabled={resetReqLoading || !email.trim()}
                >
                  {resetReqLoading ? '...' : t('auth_btn_send_reset')}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Kode Verifikasi Reset (6 Digit)
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Masukkan 6 digit kode dari email"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <div className="auth-row">
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('auth_new_pass')}
                </label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder={t('auth_new_pass_ph')}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('auth_confirm_pass')}
                </label>
                <input
                  type="password"
                  className="auth-input"
                  placeholder={t('auth_confirm_pass_ph')}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-huge btn-green"
              style={{ width: '100%', marginTop: '6px', minWidth: 'unset' }}
              disabled={resetLoading}
            >
              {resetLoading ? 'Menyimpan...' : t('auth_btn_save_pass')}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="auth-divider">
          <span>{t('or_divider')}</span>
        </div>

        {/* Guest Account Button (Tanpa Simbol Emoji Roket) */}
        <button
          type="button"
          className="btn-guest"
          onClick={onGuestLogin}
        >
          {t('guest_btn')}
        </button>

        {/* Guest Warning Box with clear human-like explanation */}
        <div className="guest-warning-box">
          <div className="guest-title">
            {t('guest_warning_title')}
          </div>
          <div>
            {t('guest_warning_desc')}
          </div>
          <div style={{ marginTop: '4px', fontSize: '0.82rem', color: 'rgba(255, 234, 167, 0.85)' }}>
            {t('guest_warning_tip')}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* SEKSI SHOWCASE FITUR (TERINSPIRASI DARI GAMBAR 2 DUOLINGO) */}
  <div className="welcome-showcase-container">
      <div className="showcase-header-center">
        <h2 className="showcase-main-title">
          {currentLang === 'en' ? 'Why Learning with PahamTeks is Extraordinary' : 'Kenapa Belajar di PahamTeks Lebih Menyenangkan?'}
        </h2>
        <p className="showcase-main-sub">
          {currentLang === 'en' ? 'Explore our premier learning features designed to help you succeed.' : 'Jelajahi fitur unggulan yang dirancang khusus untuk mempercepat pemahamanmu.'}
        </p>
      </div>

      {/* SHOWCASE 1: 50+ BAHASA DUNIA */}
      <div className="showcase-row">
        <div className="showcase-text-col">
          <span className="showcase-badge badge-green">{t('showcase_1_badge')}</span>
          <h3 className="showcase-title text-green">{t('showcase_1_title')}</h3>
          <p className="showcase-desc">{t('showcase_1_desc')}</p>
          <ul className="showcase-perk-list">
            <li><span>✓</span> {t('showcase_1_p1')}</li>
            <li><span>✓</span> {t('showcase_1_p2')}</li>
            <li><span>✓</span> {t('showcase_1_p3')}</li>
          </ul>
        </div>
        <div className="showcase-visual-col">
          <div className="showcase-card visual-card-flags">
            <div className="visual-card-header">
              <span className="visual-pill" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Globe2DIcon size={15} /> Multilingual Cards
              </span>
              <span className="visual-badge-audio" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <AudioSpeaker2DIcon size={15} /> Audio Native
              </span>
            </div>
            <div className="flashcards-mockup">
              <div className="mock-card card-jp">
                <span className="mock-flag">🇯🇵</span>
                <div className="mock-text">
                  <strong>ありがとう (Arigatou)</strong>
                  <span>Terima kasih / Thank you</span>
                </div>
              </div>
              <div className="mock-card card-es">
                <span className="mock-flag">🇪🇸</span>
                <div className="mock-text">
                  <strong>¡Hola, amigo!</strong>
                  <span>Halo teman! / Hello friend!</span>
                </div>
              </div>
              <div className="mock-card card-ar">
                <span className="mock-flag">🇸🇦</span>
                <div className="mock-text">
                  <strong>صباح الخير (Sabah al-khair)</strong>
                  <span>Selamat pagi / Good morning</span>
                </div>
              </div>
            </div>
            <div className="showcase-character-corner">
              <AkiCat size={95} />
            </div>
          </div>
        </div>
      </div>

      {/* GARIS PEMBATAS ANTAR FITUR 1 & 2 (2D Vector Art) */}
      <div className="showcase-divider">
        <div className="showcase-divider-line" />
        <div className="showcase-divider-badge">
          <CodeTag2DIcon size={16} color="#58cc02" />
          <span>{currentLang === 'en' ? 'Logic & Programming' : 'Logika & Koding'}</span>
        </div>
        <div className="showcase-divider-line" />
      </div>

      {/* SHOWCASE 2: PEMROGRAMAN & LOGIKA (REVERSE / ALTERNATING LAYOUT) */}
      <div className="showcase-row showcase-reverse">
        <div className="showcase-text-col">
          <span className="showcase-badge badge-cyan">{t('showcase_2_badge')}</span>
          <h3 className="showcase-title text-cyan">{t('showcase_2_title')}</h3>
          <p className="showcase-desc">{t('showcase_2_desc')}</p>
          <ul className="showcase-perk-list">
            <li><span>✓</span> {t('showcase_2_p1')}</li>
            <li><span>✓</span> {t('showcase_2_p2')}</li>
            <li><span>✓</span> {t('showcase_2_p3')}</li>
          </ul>
        </div>
        <div className="showcase-visual-col">
          <div className="showcase-card visual-card-code">
            <div className="code-window-topbar">
              <div className="code-dots">
                <span className="dot-red" />
                <span className="dot-yellow" />
                <span className="dot-green" />
              </div>
              <span className="code-filename">solution.py</span>
              <span className="code-lang-pill">Python 3</span>
            </div>
            <pre className="code-snippet-box">
              <code>{`def cek_logika(pemahaman):\n    if pemahaman == "PahamTeks":\n        return "Level Up! ⚡"\n    return "Lanjut Belajar!"\n\n# Output: "Level Up! ⚡"`}</code>
            </pre>
            <div className="code-test-result">
              <span className="test-check">✓</span> 3/3 Test Cases Passed! (+15 Poin)
            </div>
            <div className="showcase-character-corner">
              <BittoBot size={95} />
            </div>
          </div>
        </div>
      </div>

      {/* GARIS PEMBATAS ANTAR FITUR 2 & 3 (2D Vector Art) */}
      <div className="showcase-divider">
        <div className="showcase-divider-line" />
        <div className="showcase-divider-badge">
          <Book2DIcon size={16} color="#ffd700" />
          <span>{currentLang === 'en' ? 'Smart Dictionary' : 'Kamus Pintar & Glosarium'}</span>
        </div>
        <div className="showcase-divider-line" />
      </div>

      {/* SHOWCASE 3: KAMUS PINTAR & GLOSARIUM */}
      <div className="showcase-row">
        <div className="showcase-text-col">
          <span className="showcase-badge badge-yellow">{t('showcase_3_badge')}</span>
          <h3 className="showcase-title text-yellow">{t('showcase_3_title')}</h3>
          <p className="showcase-desc">{t('showcase_3_desc')}</p>
          <ul className="showcase-perk-list">
            <li><span>✓</span> {t('showcase_3_p1')}</li>
            <li><span>✓</span> {t('showcase_3_p2')}</li>
            <li><span>✓</span> {t('showcase_3_p3')}</li>
          </ul>
        </div>
        <div className="showcase-visual-col">
          <div className="showcase-card visual-card-dict">
            <div className="dict-mock-searchbar" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search2DIcon size={16} color="#38bdf8" />
              <input type="text" readOnly value="Serendipity / Asynchronous" />
              <button type="button">CARI</button>
            </div>
            <div className="dict-mock-result">
              <div className="dict-mock-word">
                <h4>Serendipity</h4>
                <span className="dict-type-pill">Noun • Idiom</span>
              </div>
              <p className="dict-mock-meaning">
                &quot;Menemukan sesuatu yang berharga dan membahagiakan secara tidak sengaja.&quot;
              </p>
              <div className="dict-mock-synonyms">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Lightbulb2DIcon size={14} color="#ffd700" /> Penjelasan ramah manusia
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkle2DIcon size={14} color="#38bdf8" /> Contoh kontekstual
                </span>
              </div>
            </div>
            <div className="showcase-character-corner">
              <TeksieFox size={95} />
            </div>
          </div>
        </div>
      </div>

      {/* GARIS PEMBATAS ANTAR FITUR 3 & 4 (2D Vector Art) */}
      <div className="showcase-divider">
        <div className="showcase-divider-line" />
        <div className="showcase-divider-badge">
          <Trophy2DIcon size={16} color="#ffd700" />
          <span>{currentLang === 'en' ? 'Tracking & Podium' : 'Pelacakan & Prestasi'}</span>
        </div>
        <div className="showcase-divider-line" />
      </div>

      {/* SHOWCASE 4: PELACAKAN & PRESTASI (PODIUM SEPERTI FOTO 2 DUOLINGO) */}
      <div className="showcase-row showcase-reverse">
        <div className="showcase-text-col">
          <span className="showcase-badge badge-green">{t('showcase_4_badge')}</span>
          <h3 className="showcase-title text-green">{t('showcase_4_title')}</h3>
          <p className="showcase-desc">{t('showcase_4_desc')}</p>
          <ul className="showcase-perk-list">
            <li><span>✓</span> {t('showcase_4_p1')}</li>
            <li><span>✓</span> {t('showcase_4_p2')}</li>
            <li><span>✓</span> {t('showcase_4_p3')}</li>
          </ul>
        </div>
        <div className="showcase-visual-col">
          <div className="showcase-card visual-card-podium">
            {/* Mockup Card Podium Prestasi */}
            <div className="leaderboard-card-mockup">
              <div className="leaderboard-progress-bar">
                <div className="progress-fill" style={{ width: '85%' }} />
              </div>
              <div className="leaderboard-avatars-grid">
                <div className="avatar-chip chip-fox" title="Teksie">🦊</div>
                <div className="avatar-chip chip-bot" title="Bitto">🤖</div>
                <div className="avatar-chip chip-cat" title="Aki">🐱</div>
                <div className="avatar-chip chip-mentor" title="Luki">🦡</div>
              </div>
              <div className="podium-banner-gold">
                <span className="podium-number">#1</span>
                <span className="podium-label">Akurasi 95% • Peringkat Teratas</span>
              </div>
            </div>
            <div className="showcase-character-corner mentor-corner">
              <LukiCivet size={115} />
            </div>
          </div>
        </div>
      </div>

      {/* GARIS PEMBATAS MENUJU CALL TO ACTION (2D Vector Art) */}
      <div className="showcase-divider">
        <div className="showcase-divider-line" />
        <div className="showcase-divider-badge">
          <Rocket2DIcon size={16} color="#58cc02" />
          <span>{currentLang === 'en' ? 'Start Your Journey' : 'Mulai Petualangan Belajarmu'}</span>
        </div>
        <div className="showcase-divider-line" />
      </div>

      {/* FINAL CALL TO ACTION BANNER (2D Vector Art Buttons) */}
      <div className="welcome-cta-banner">
        <h3>{t('welcome_cta_title')}</h3>
        <p>{t('welcome_cta_desc')}</p>
        <div className="cta-buttons-row">
          <button
            type="button"
            className="btn-huge btn-green"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={() => {
              setActiveTab('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Rocket2DIcon size={20} color="#ffffff" />
            <span>{t('welcome_cta_btn')}</span>
          </button>
          <button
            type="button"
            className="btn-huge btn-cyan"
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            onClick={onGuestLogin}
          >
            <User2DIcon size={20} color="#ffffff" />
            <span>{t('welcome_cta_guest')}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
