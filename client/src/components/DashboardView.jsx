import React from 'react';

export default function DashboardView({ t, history = [] }) {
  const totalSessions = history.length;
  const avgScore = totalSessions > 0
    ? Math.round(history.reduce((acc, curr) => acc + (curr.score / curr.total) * 100, 0) / totalSessions)
    : 0;

  return (
    <div className="page" style={{ width: '100%', maxWidth: '850px' }}>
      <div className="hero" style={{ marginBottom: '20px' }}>
        <h1>{t('dash_title')}</h1>
        <p>{t('dash_subtitle')}</p>
      </div>

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

      <div className="dashboard-box" style={{ width: '100%' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>
          {t('dash_history')}
        </h3>

        {history.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>{t('dash_empty')}</p>
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

