import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SERVER_STATUS, GET_USER_LOGS } from '../graphql/queries';

export default function AdminDashboardView({ user, onBackHome }) {
  const [search, setSearch] = useState('');

  // Backend tetap menjadi penjaga utama; jangan jalankan query admin dari UI untuk akun biasa.
  const isAdmin = user?.role === 'ADMIN';
  const serverQuery = useQuery(GET_SERVER_STATUS, {
    skip: !isAdmin,
    fetchPolicy: 'network-only',
    pollInterval: 15000
  });
  const logsQuery = useQuery(GET_USER_LOGS, {
    skip: !isAdmin,
    variables: { limit: 100 },
    fetchPolicy: 'network-only',
    pollInterval: 15000
  });

  const logs = useMemo(() => {
    const term = search.trim().toLowerCase();
    const rows = logsQuery.data?.userLogs || [];
    if (!term) return rows;
    return rows.filter((row) => [row.userId, row.action, row.details]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [logsQuery.data, search]);

  const refreshDashboard = async () => {
    const results = await Promise.allSettled([serverQuery.refetch(), logsQuery.refetch()]);
    results.filter((result) => result.status === 'rejected').forEach((result) => {
      console.warn('[AdminDashboard] Gagal menyegarkan data:', result.reason?.message || result.reason);
    });
  };

  if (!isAdmin) {
    return (
      <section className="admin-dashboard-page">
        <div className="admin-dashboard-card admin-access-denied">
          <span className="admin-dashboard-eyebrow">Akses terbatas</span>
          <h1>Dashboard administrator</h1>
          <p>Masuk melalui alur login administrator untuk membuka data ini.</p>
          <button className="admin-dashboard-button" onClick={onBackHome}>Kembali</button>
        </div>
      </section>
    );
  }

  const status = serverQuery.data?.serverStatus;
  const queryError = serverQuery.error || logsQuery.error;

  return (
    <section className="admin-dashboard-page">
      <header className="admin-dashboard-heading">
        <div>
          <span className="admin-dashboard-eyebrow">PahamTeks · Area privat</span>
          <h1>Dashboard Administrator</h1>
          <p>Ringkasan layanan dan log aktivitas yang hanya dapat dibaca oleh sesi admin terverifikasi.</p>
        </div>
        <div className="admin-dashboard-actions">
          <button className="admin-dashboard-button secondary" onClick={onBackHome}>Beranda</button>
          <button
            className="admin-dashboard-button"
            onClick={refreshDashboard}
            disabled={serverQuery.loading || logsQuery.loading}
          >
            {serverQuery.loading || logsQuery.loading ? 'Memuat…' : 'Muat ulang'}
          </button>
        </div>
      </header>

      {queryError && (
        <div className="admin-dashboard-notice" role="status">
          Sesi admin tidak dapat membaca data. Silakan masuk kembali atau periksa koneksi server.
        </div>
      )}

      <div className="admin-dashboard-stats">
        <article className="admin-dashboard-card">
          <span className="admin-stat-label">Status API</span>
          <strong className={status?.status === 'online' ? 'admin-stat-good' : ''}>
            {serverQuery.loading ? 'Memuat…' : (status?.status || 'Tidak tersedia').toUpperCase()}
          </strong>
          <small>GraphQL backend</small>
        </article>
        <article className="admin-dashboard-card">
          <span className="admin-stat-label">Database utama</span>
          <strong>{serverQuery.loading ? 'Memuat…' : status?.dbConnected ? 'Terhubung' : 'SQLite cadangan'}</strong>
          <small>{status?.dbConnected ? 'MySQL aktif' : 'Failover aktif'}</small>
        </article>
        <article className="admin-dashboard-card">
          <span className="admin-stat-label">Kunci Gemini</span>
          <strong>{serverQuery.loading ? '…' : (status?.geminiKeysCount ?? '—')}</strong>
          <small>Kunci terdaftar di backend</small>
        </article>
        <article className="admin-dashboard-card">
          <span className="admin-stat-label">Pembaruan status</span>
          <strong className="admin-stat-time">
            {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : '—'}
          </strong>
          <small>Memperbarui otomatis tiap 15 detik</small>
        </article>
      </div>

      <section className="admin-dashboard-card admin-logs-card">
        <div className="admin-logs-heading">
          <div>
            <span className="admin-dashboard-eyebrow">Audit aktivitas</span>
            <h2>Log pengguna terbaru</h2>
          </div>
          <input
            className="admin-logs-search"
            type="search"
            aria-label="Cari log pengguna"
            placeholder="Cari aksi, pengguna, atau detail…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {logsQuery.loading && !logsQuery.data ? (
          <p className="admin-dashboard-empty">Memuat log…</p>
        ) : logs.length ? (
          <div className="admin-logs-table-wrap">
            <table className="admin-logs-table">
              <thead>
                <tr><th>Waktu</th><th>Pengguna</th><th>Aksi</th><th>Detail</th></tr>
              </thead>
              <tbody>
                {logs.map((row) => (
                  <tr key={row.id}>
                    <td>{row.createdAt ? new Date(row.createdAt).toLocaleString() : '—'}</td>
                    <td>{row.userId || '—'}</td>
                    <td><span className="admin-log-action">{row.action}</span></td>
                    <td>{row.details || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="admin-dashboard-empty">Belum ada log yang cocok.</p>
        )}
        <p className="admin-logs-footnote">Maksimal 100 aktivitas terbaru. Akses log juga diperiksa di backend.</p>
      </section>
    </section>
  );
}
