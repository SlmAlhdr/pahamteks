import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, SEND_OTP_MUTATION } from '../graphql/mutations';

export default function WelcomePortal({
  onAuthSuccess,
  onGuestLogin,
  currentLang,
  t
}) {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [otp, setOtp] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: regLoading }] = useMutation(REGISTER_MUTATION);
  const [sendOtpMutation, { loading: otpLoading }] = useMutation(SEND_OTP_MUTATION);

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await loginMutation({ variables: { email, password } });
      if (res.data?.login?.success) {
        onAuthSuccess(res.data.login.user);
      } else {
        setStatusMsg({ text: res.data?.login?.message || 'Email atau kata sandi tidak cocok.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await registerMutation({
        variables: { email, password, fname, lname, otp }
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
      {/* Welcome Hero Greeting */}
      <div className="welcome-hero">
        <div className="welcome-badge-pill">
          {t('welcome_badge')}
        </div>
        <h1>{t('welcome_title')}</h1>
        <p>{t('welcome_subtitle')}</p>
      </div>

      {/* Main Authentication & Guest Entry Card */}
      <div className="welcome-card-wrapper">
        {/* Tab Switcher */}
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
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="auth-form">
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_email')}
              </label>
              <input
                type="email"
                className="auth-input"
                placeholder="nama@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                {t('auth_ph_pass')}
              </label>
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
        ) : (
          /* Tab Form: Pendaftaran Akun Resmi */
          <form onSubmit={handleRegister} className="auth-form">
            <div className="auth-row">
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('auth_ph_fname')}
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nama Depan"
                  required
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {t('auth_ph_lname')}
                </label>
                <input
                  type="text"
                  className="auth-input"
                  placeholder="Nama Belakang"
                  required
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </div>
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
                  {otpLoading ? 'Mengirim...' : 'Kirim Kode'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Kode Verifikasi Email
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Kode verifikasi (Demo: 123456)"
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

      {/* Feature Highlights Footer (Dipertahankan seperti Foto ke-5) */}
      <div className="welcome-features-mini">
        <div className="mini-feature-chip">🌐 50+ Bahasa Asing</div>
        <div className="mini-feature-chip">💻 Pemrograman & Logika</div>
        <div className="mini-feature-chip">🤖 AI Smart Dictionary</div>
        <div className="mini-feature-chip">📊 Riwayat & Pelacakan</div>
      </div>
    </div>
  );
}
