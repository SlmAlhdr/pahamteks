import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import {
  LOGIN_MUTATION,
  ADMIN_LOGIN_MUTATION,
  REGISTER_MUTATION,
  SEND_OTP_MUTATION,
  REQUEST_PASSWORD_RESET_MUTATION,
  RESET_PASSWORD_MUTATION
} from '../graphql/mutations';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  onGuestLogin,
  initialMode = 'login',
  t
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSignature, setOtpSignature] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [adminLoginMutation, { loading: adminLoginLoading }] = useMutation(ADMIN_LOGIN_MUTATION);
  const [registerMutation, { loading: regLoading }] = useMutation(REGISTER_MUTATION);
  const [sendOtpMutation, { loading: otpLoading }] = useMutation(SEND_OTP_MUTATION);
  const [requestResetMutation, { loading: resetReqLoading }] = useMutation(REQUEST_PASSWORD_RESET_MUTATION);
  const [resetPasswordMutation, { loading: resetLoading }] = useMutation(RESET_PASSWORD_MUTATION);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStatusMsg({ text: '', isError: false });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const getFriendlyError = (err, defaultMsg = 'Terjadi kendala pada sistem.') => {
    const raw = String(err?.message || '');
    if (raw.includes('500') || raw.includes('status code 500')) {
      return 'Server Vercel belum membaca konfigurasi email (EMAIL_USER & EMAIL_PASS). Silakan tambahkan variabel tersebut di Vercel Dashboard > Settings > Environment Variables.';
    }
    if (raw.includes('Failed to fetch') || raw.includes('NetworkError')) {
      return 'Gagal terhubung ke server backend. Periksa koneksi internet Anda.';
    }
    return raw || defaultMsg;
  };

  // 1. Kirim OTP untuk Registrasi Akun Baru
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setStatusMsg({ text: 'Masukkan alamat email terlebih dahulu!', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await sendOtpMutation({ variables: { email } });
      if (res.data?.sendOtp?.success) {
        if (res.data.sendOtp.otpSignature) {
          setOtpSignature(res.data.sendOtp.otpSignature);
        }
        setStatusMsg({ text: t('auth_otp_msg'), isError: false });
      } else {
        setStatusMsg({ text: res.data?.sendOtp?.message || 'Gagal mengirim OTP', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: getFriendlyError(err), isError: true });
    }
  };

  // 2. Kirim OTP untuk Reset Password (Lupa Kata Sandi)
  const handleRequestPasswordReset = async () => {
    if (!email.trim()) {
      setStatusMsg({ text: 'Masukkan email atau username akun Anda!', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await requestResetMutation({ variables: { email } });
      if (res.data?.requestPasswordReset?.success) {
        if (res.data.requestPasswordReset.otpSignature) {
          setOtpSignature(res.data.requestPasswordReset.otpSignature);
        }
        setStatusMsg({ text: res.data.requestPasswordReset.message, isError: false });
      } else {
        setStatusMsg({ text: res.data?.requestPasswordReset?.message || 'Gagal meminta reset kata sandi', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: getFriendlyError(err), isError: true });
    }
  };

  // 3. Submit Reset Password dengan OTP
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
        variables: { email, otp, newPassword, otpSignature }
      });
      if (res.data?.resetPassword?.success) {
        setStatusMsg({ text: res.data.resetPassword.message, isError: false });
        // Bersihkan state & arahkan ke login
        setTimeout(() => {
          setMode('login');
          setPassword('');
          setOtp('');
          setOtpSignature('');
          setNewPassword('');
          setConfirmPassword('');
        }, 1800);
      } else {
        setStatusMsg({ text: res.data?.resetPassword?.message || 'Gagal mereset kata sandi', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: getFriendlyError(err), isError: true });
    }
  };

  // 4. Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await loginMutation({ variables: { email, password } });
      if (res.data?.login?.success) {
        onAuthSuccess(res.data.login.user);
        onClose();
      } else {
        setStatusMsg({ text: res.data?.login?.message || 'Email/username atau kata sandi salah', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: getFriendlyError(err), isError: true });
    }
  };

  // Login admin berbasis allowlist ADMIN_EMAILS dan password akun pribadi.
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await adminLoginMutation({ variables: { email: email.trim().toLowerCase(), password } });
      if (res.data?.adminLogin?.success && res.data.adminLogin.user?.role === 'ADMIN') {
        onAuthSuccess(res.data.adminLogin.user);
        onClose();
      } else {
        setStatusMsg({ text: res.data?.adminLogin?.message || 'Kredensial admin tidak valid.', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: getFriendlyError(err), isError: true });
    }
  };

  // 5. Submit Register Akun dengan 1 Kotak Username
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setStatusMsg({ text: 'Silakan isi username unik untuk akun Anda!', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await registerMutation({
        variables: { email, password, username: username.trim(), otp, otpSignature }
      });
      if (res.data?.register?.success) {
        onAuthSuccess(res.data.register.user);
        onClose();
      } else {
        setStatusMsg({ text: res.data?.register?.message || 'Registrasi gagal', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: getFriendlyError(err), isError: true });
    }
  };

  const getModalTitle = () => {
    if (mode === 'login') return t('auth_login_title');
    if (mode === 'admin') return 'Login Administrator';
    if (mode === 'register') return t('auth_reg_title');
    return t('auth_reset_title');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Close Button */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900, color: '#ffffff' }}>
            {getModalTitle()}
          </h2>
          <button type="button" className="modal-close-btn" onClick={onClose} title="Tutup / Close" aria-label="Tutup">
            <span aria-hidden="true">×</span>
          </button>
        </div>

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

        {/* 1. FORM LOGIN */}
        {mode === 'login' && (
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
                    setMode('forgot');
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

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Belum punya akun?{' '}
              </span>
              <span
                style={{ color: 'var(--btn-cyan)', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
                onClick={() => {
                  setMode('register');
                  setStatusMsg({ text: '', isError: false });
                }}
              >
                {t('auth_btn_reg')}
              </span>
            </div>
          </form>
        )}

        {mode === 'admin' && (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <p className="admin-login-hint">Gunakan email yang terdaftar di ADMIN_EMAILS dan kata sandi akun pribadi Anda.</p>
            <label className="admin-login-label" htmlFor="admin-email">Email admin</label>
            <input
              id="admin-email"
              type="email"
              className="auth-input"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="admin-login-label" htmlFor="admin-account-password">Password akun</label>
            <input
              id="admin-account-password"
              type="password"
              className="auth-input"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-huge btn-green" disabled={adminLoginLoading}>
              {adminLoginLoading ? 'Memverifikasi...' : 'Masuk ke Dashboard Admin'}
            </button>
            <button type="button" className="admin-login-link" onClick={() => setMode('login')}>
              Kembali ke login pengguna
            </button>
          </form>
        )}

        {/* 2. FORM REGISTER (1 KOTAK USERNAME) */}
        {mode === 'register' && (
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

            {/* Email & Tombol Kirim OTP */}
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
                  {otpLoading ? '...' : 'Kirim OTP'}
                </button>
              </div>
            </div>

            {/* Kode Verifikasi OTP */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Kode Verifikasi OTP (6 Digit)
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Masukkan 6 digit kode verifikasi email"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            {/* Kata Sandi */}
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

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Sudah punya akun?{' '}
              </span>
              <span
                style={{ color: 'var(--btn-cyan)', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
                onClick={() => {
                  setMode('login');
                  setStatusMsg({ text: '', isError: false });
                }}
              >
                {t('auth_btn_login')}
              </span>
            </div>
          </form>
        )}

        {/* 3. FORM RESET PASSWORD (LUPA KATA SANDI) */}
        {mode === 'forgot' && (
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
              {resetLoading ? 'Memproses...' : t('auth_btn_save_pass')}
            </button>

            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <span
                style={{ color: 'var(--btn-cyan)', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem' }}
                onClick={() => {
                  setMode('login');
                  setStatusMsg({ text: '', isError: false });
                }}
              >
                ← {t('auth_back_to_login')}
              </span>
            </div>
          </form>
        )}

        {/* Guest Mode Option with Warning (Hanya muncul jika mode login) */}
        {mode === 'login' && onGuestLogin && (
          <>
            <div className="auth-divider">
              <span>{t('or_divider')}</span>
            </div>

            <button
              type="button"
              className="btn-guest"
              onClick={() => {
                onGuestLogin();
                onClose();
              }}
            >
              {t('guest_btn')}
            </button>

            <div className="guest-warning-box">
              <div className="guest-title">
                {t('guest_warning_title')}
              </div>
              <div>
                {t('guest_warning_desc')}
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          className="btn-huge btn-grey"
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '0.9rem',
            padding: '10px',
            minWidth: 'unset',
            marginTop: '10px'
          }}
          onClick={onClose}
        >
          {t('btn_cancel')}
        </button>
      </div>
    </div>
  );
}
