import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, SEND_OTP_MUTATION } from '../graphql/mutations';

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  onGuestLogin,
  initialMode = 'login',
  t
}) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [otp, setOtp] = useState('');
  const [statusMsg, setStatusMsg] = useState({ text: '', isError: false });

  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: regLoading }] = useMutation(REGISTER_MUTATION);
  const [sendOtpMutation, { loading: otpLoading }] = useMutation(SEND_OTP_MUTATION);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setStatusMsg({ text: '', isError: false });
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    if (!email.trim()) {
      setStatusMsg({ text: 'Masukkan email terlebih dahulu!', isError: true });
      return;
    }
    setStatusMsg({ text: '', isError: false });
    try {
      const res = await sendOtpMutation({ variables: { email } });
      if (res.data?.sendOtp?.success) {
        setStatusMsg({ text: t('auth_otp_msg'), isError: false });
      } else {
        setStatusMsg({ text: res.data?.sendOtp?.message || 'Gagal mengirim OTP', isError: true });
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
        onClose();
      } else {
        setStatusMsg({ text: res.data?.login?.message || 'Email atau password salah', isError: true });
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
        onClose();
      } else {
        setStatusMsg({ text: res.data?.register?.message || 'Registrasi gagal', isError: true });
      }
    } catch (err) {
      setStatusMsg({ text: err.message, isError: true });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header with Close Button */}
        <div className="modal-header">
          <h2 style={{ fontSize: '1.6rem', margin: 0, fontWeight: 900, color: '#ffffff' }}>
            {mode === 'login' ? t('auth_login_title') : t('auth_reg_title')}
          </h2>
          <button className="modal-close-btn" onClick={onClose} title="Tutup / Close">
            ✕
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

        {mode === 'login' ? (
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
        ) : (
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
                  {otpLoading ? '...' : 'Kirim OTP'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '6px' }}>
                Kode Verifikasi OTP
              </label>
              <input
                type="text"
                className="auth-input"
                placeholder="Kode OTP (Demo: 123456)"
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

        {/* Guest Mode Option with Warning */}
        {onGuestLogin && (
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
            minWidth: 'unset'
          }}
          onClick={onClose}
        >
          {t('btn_cancel')}
        </button>
      </div>
    </div>
  );
}
