import React from 'react';

export default function DashboardView({ t, user, history = [], onOpenAuth, onBackHome }) {
  const totalSessions = history.length;
  const avgScore = totalSessions > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / totalSessions)
    : 0;

  return (
    <div className="page" style={{ width: '100%', maxWidth: '900px' }}>
      <div className="hero" style={{ marginBottom: '22px' }}>
        <h1>{t('account_title')}</h1>
        <p>{t('account_subtitle')}</p>
      </div>

      {/* Kartu Informasi Akun Pengguna */}
      <div className="account-info-card" style={{ marginBottom: '25px' }}>
        <div className="account-avatar-col">
          <div className="account-avatar-icon">
            {user?.isGuest ? '👤' : '⭐'}
          </div>
        </div>
        <div className="account-details-col">
          <div className="account-name-row">
            <h2 className="account-user-name">{user?.name || 'Pengguna'}</h2>
            <span className={`account-status-pill ${user?.isGuest ? 'guest' : 'official'}`}>
              {user?.isGuest ? t('guest_badge') : 'Akun Resmi Terverifikasi'}
            </span>
          </div>

          <p className="account-email-text">
            {user?.email ? user.email : (user?.isGuest ? 'Sesi tamu browser sementara (data hilang saat tab ditutup)' : '-')}
          </p>

          {user?.isGuest && onOpenAuth && (
            <div style={{ marginTop: '10px' }}>
              <button
                className="btn-auth primary"
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                onClick={() => onOpenAuth('register')}
              >
                🚀 {t('guest_upgrade_btn')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistik Pelacakan Belajar */}
      <div className="stats-grid">
        <div className="stat-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
            {t('stat_sessions')}
          </div>
          <div className="stat-num">{totalSessions}</div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
            {t('stat_avg')}
          </div>
          <div className="stat-num" style={{ color: 'var(--btn-cyan)' }}>
            {avgScore}%
          </div>
        </div>

        <div className="stat-card">
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 700 }}>
            {t('stat_accuracy')}
          </div>
          <div className="stat-num" style={{ color: avgScore >= 70 ? 'var(--btn-green)' : 'var(--warning-orange)' }}>
            {avgScore >= 80 ? 'Sangat Baik' : avgScore >= 60 ? 'Baik' : 'Perlu Latihan'}
          </div>
        </div>
      </div>

      {/* Riwayat Pengerjaan Kuis */}
      <div className="dashboard-box" style={{ width: '100%', marginTop: '20px' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem', color: 'var(--text-main)' }}>
          {t('dash_history')}
        </h3>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
            <p style={{ fontSize: '1rem', marginBottom: '8px' }}>{t('dash_empty')}</p>
            <span style={{ fontSize: '0.85rem' }}>Mulai latihan di menu <strong>Pembelajaran Bahasa</strong> untuk mencatat perkembangan Anda.</span>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(0,0,0,0.5)',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <strong style={{ color: 'var(--btn-cyan)' }}>{h.topic}</strong>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{h.date}</div>
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--btn-green)' }}>
                  {h.score} / {h.total} ({Math.round((h.score / h.total) * 100)}%)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
