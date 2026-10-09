import React, { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SERVER_STATUS, GET_USER_LOGS, GET_ADMIN_USERS } from '../graphql/queries';

export default function AdminDashboardView({ user, onBackHome, onSwitchToAdmin }) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'logs'
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
  const usersQuery = useQuery(GET_ADMIN_USERS, {
    skip: !isAdmin,
    variables: { limit: 200 },
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

  const allUsers = usersQuery.data?.adminUsers || [];
  const adminCount = useMemo(() => allUsers.filter(u => u.role === 'ADMIN').length, [allUsers]);
  const regularUserCount = allUsers.length - adminCount;

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return allUsers;
    return allUsers.filter((row) => [row.id, row.email, row.username, row.name, row.role]
      .some((value) => String(value || '').toLowerCase().includes(term)));
  }, [allUsers, search]);

  const refreshDashboard = async () => {
    const results = await Promise.allSettled([
      serverQuery.refetch(),
      logsQuery.refetch(),
      usersQuery.refetch()
    ]);
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
          <p>Halaman ini dikhususkan untuk administrator. Masuk dengan akun admin untuk membuka data ini.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="admin-dashboard-button" onClick={onBackHome}>Kembali ke Beranda</button>
            {onSwitchToAdmin && (
              <button
                className="admin-dashboard-button"
                style={{ background: 'var(--btn-cyan, #00b4d8)', borderColor: 'var(--btn-cyan, #00b4d8)' }}
                onClick={onSwitchToAdmin}
              >
                Masuk sebagai Admin
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }

  const status = serverQuery.data?.serverStatus;
  const queryError = serverQuery.error || logsQuery.error || usersQuery.error;
  const isRefreshing = serverQuery.loading || logsQuery.loading || usersQuery.loading;

  return (
    <section className="admin-dashboard-page">
      <header className="admin-dashboard-heading">
        <div>
          <span className="admin-dashboard-eyebrow">PahamTeks · Area privat</span>
          <h1>Dashboard Administrator</h1>
          <p>Ringkasan layanan, monitoring pengguna, dan log aktivitas yang hanya dapat dibaca oleh sesi admin terverifikasi.</p>
        </div>
        <div className="admin-dashboard-actions">
          <button className="admin-dashboard-button secondary" onClick={onBackHome}>Beranda</button>
          <button
            className="admin-dashboard-button"
            onClick={refreshDashboard}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Memuat…' : 'Muat ulang'}
          </button>
        </div>
      </header>

      {queryError && (
        <div className="admin-dashboard-notice" role="status">
          Sesi admin tidak dapat membaca data. Silakan masuk kembali atau periksa koneksi server.
        </div>
      )}

      {/* Kartu Statistik Utama */}
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
          <span className="admin-stat-label">Total Pengguna</span>
          <strong>{usersQuery.loading ? '…' : allUsers.length}</strong>
          <small>{adminCount} Admin · {regularUserCount} User</small>
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
          <small>Sinkron otomatis tiap 15 detik</small>
        </article>
      </div>

      {/* Bagian Konten dengan Navigasi Tab */}
      <section className="admin-dashboard-card admin-logs-card">
        {/* Tombol Tab Navigasi */}
        <nav className="admin-tabs-nav" aria-label="Navigasi data admin">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => { setActiveTab('users'); setSearch(''); }}
          >
            👥 Daftar Pengguna ({allUsers.length})
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('logs'); setSearch(''); }}
          >
            Log Aktivitas & Login ({logsQuery.data?.userLogs?.length || 0})
          </button>
        </nav>

        {/* Header Tab & Pencarian */}
        <div className="admin-logs-heading">
          <div>
            <span className="admin-dashboard-eyebrow">
              {activeTab === 'users' ? 'Database Pengguna' : 'Audit Keamanan & Aktivitas'}
            </span>
            <h2>
              {activeTab === 'users' ? 'Daftar Pengguna Terdaftar' : 'Log Aktivitas & Login Terbaru'}
            </h2>
          </div>
          <input
            className="admin-logs-search"
            type="search"
            aria-label={activeTab === 'users' ? 'Cari pengguna' : 'Cari log aktivitas'}
            placeholder={activeTab === 'users' ? 'Cari username, email, nama, role…' : 'Cari aksi, pengguna, detail…'}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        {/* TAB 1: DAFTAR PENGGUNA */}
        {activeTab === 'users' && (
          <>
            {usersQuery.loading && !usersQuery.data ? (
              <p className="admin-dashboard-empty">Memuat daftar pengguna…</p>
            ) : filteredUsers.length ? (
              <div className="admin-logs-table-wrap">
                <table className="admin-logs-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45px' }}>No</th>
                      <th>Akun Pengguna</th>
                      <th>Alamat Email</th>
                      <th>Peran (Role)</th>
                      <th>Tanggal Terdaftar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((row, idx) => (
                      <tr key={row.id}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>@{row.username || '—'}</strong>
                          {row.name && row.name !== row.username && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{row.name}</div>
                          )}
                        </td>
                        <td>{row.email}</td>
                        <td>
                          {row.role === 'ADMIN' ? (
                            <span className="admin-badge-admin">ADMIN</span>
                          ) : (
                            <span className="admin-badge-user">USER</span>
                          )}
                        </td>
                        <td>
                          {row.createdAt
                            ? new Date(row.createdAt).toLocaleString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="admin-dashboard-empty">Belum ada akun pengguna yang cocok.</p>
            )}
            <p className="admin-logs-footnote">
              Menampilkan {filteredUsers.length} dari total {allUsers.length} akun terdaftar. Kata sandi tidak pernah dikirim ke browser demi keamanan 100%.
            </p>
          </>
        )}

        {/* TAB 2: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <>
            {logsQuery.loading && !logsQuery.data ? (
              <p className="admin-dashboard-empty">Memuat log aktivitas…</p>
            ) : logs.length ? (
              <div className="admin-logs-table-wrap">
                <table className="admin-logs-table">
                  <thead>
                    <tr>
                      <th>Waktu</th>
                      <th>Pengguna</th>
                      <th>Aksi</th>
                      <th>Detail Aktivitas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((row) => (
                      <tr key={row.id}>
                        <td>{row.createdAt ? new Date(row.createdAt).toLocaleString('id-ID') : '—'}</td>
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
            <p className="admin-logs-footnote">Maksimal 100 aktivitas terbaru. Akses log diperiksa secara ketat di backend.</p>
          </>
        )}
      </section>
    </section>
  );
}
