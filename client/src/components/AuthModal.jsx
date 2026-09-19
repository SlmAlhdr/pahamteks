import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, REGISTER_MUTATION, SEND_OTP_MUTATION } from '../graphql/mutations';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login', t }) {
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
        setStatusMsg({ text: res.data?.sendOtp?.message || 'Gagal', isError: true });
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
        setStatusMsg({ text: res.data?.login?.message || 'Login gagal', isError: true });
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
    <div className="modal-overlay" style={{ display: 'flex' }}>
      <div className="modal-box">
        <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', fontWeight: 900 }}>
          {mode === 'login' ? t('auth_login_title') : t('auth_reg_title')}
        </h2>

        {statusMsg.text && (
          <div style={{
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '15px',
            fontSize: '0.9rem',
            background: statusMsg.isError ? 'rgba(255, 71, 87, 0.2)' : 'rgba(88, 204, 2, 0.2)',
            color: statusMsg.isError ? 'var(--wrong)' : 'var(--correct)',
            border: `1px solid ${statusMsg.isError ? 'var(--wrong)' : 'var(--correct)'}`
          }} dangerouslySetInnerHTML={{ __html: statusMsg.text }} />
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <input
              type="email"
              className="auth-input"
              placeholder={t('auth_ph_email')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="auth-input"
              placeholder={t('auth_ph_pass')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="action-row" style={{ marginTop: '20px' }}>
              <button
                type="submit"
                className="btn-huge btn-green"
                style={{ width: '100%' }}
                disabled={loginLoading}
              >
                {loginLoading ? 'Memproses...' : t('auth_btn_login')}
              </button>
            </div>
            <p
              style={{ marginTop: '20px', color: 'var(--btn-cyan)', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => { setMode('register'); setStatusMsg({ text: '', isError: false }); }}
            >
              {t('auth_toggle_reg')}
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="auth-input"
                placeholder={t('auth_ph_fname')}
                required
                value={fname}
                onChange={(e) => setFname(e.target.value)}
              />
              <input
                type="text"
                className="auth-input"
                placeholder={t('auth_ph_lname')}
                required
                value={lname}
                onChange={(e) => setLname(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="email"
                className="auth-input"
                placeholder={t('auth_ph_email')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="button"
                className="btn-huge btn-cyan"
                style={{ minWidth: '110px', padding: '10px 14px', fontSize: '0.85rem' }}
                onClick={handleSendOtp}
                disabled={otpLoading || !email.trim()}
              >
                {otpLoading ? '...' : 'Kirim OTP'}
              </button>
            </div>
            <input
              type="text"
              className="auth-input"
              placeholder="Kode OTP (Demo: 123456)"
              required
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <input
              type="password"
              className="auth-input"
              placeholder={t('auth_ph_pass')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="action-row" style={{ marginTop: '20px' }}>
              <button
                type="submit"
                className="btn-huge btn-green"
                style={{ width: '100%' }}
                disabled={regLoading}
              >
                {regLoading ? 'Memproses...' : t('auth_btn_verify')}
              </button>
            </div>
            <p
              style={{ marginTop: '20px', color: 'var(--btn-cyan)', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => { setMode('login'); setStatusMsg({ text: '', isError: false }); }}
            >
              {t('auth_toggle_login')}
            </p>
          </form>
        )}

        <button
          className="btn-huge btn-grey"
          style={{ width: '100%', marginTop: '10px', background: 'rgba(255,255,255,0.1)', color: 'white' }}
          onClick={onClose}
        >
          {t('btn_cancel')}
        </button>
      </div>
    </div>
  );
}
