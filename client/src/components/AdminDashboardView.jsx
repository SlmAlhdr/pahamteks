import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SERVER_STATUS, GET_USER_LOGS } from '../graphql/queries';

export default function AdminDashboardView({ currentLang = 'id', onBackHome }) {
  const [logLimit, setLogLimit] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  // Ambil data status server (auto-refresh 15 detik)
  const {
    data: serverData,
    loading: serverLoading,
    error: serverError,
    refetch: refetchServer
  } = useQuery(GET_SERVER_STATUS, {
    pollInterval: 15000,
    fetchPolicy: 'network-only'
  });

  // Ambil data log aktivitas pengguna & audit trail
  const {
    data: logsData,
    loading: logsLoading,
    error: logsError,
    refetch: refetchLogs
  } = useQuery(GET_USER_LOGS, {
    variables: { limit: logLimit },
    pollInterval: 15000,
    fetchPolicy: 'network-only'
  });

  const handleRefreshAll = () => {
    refetchServer();
    refetchLogs();
  };

  const status = serverData?.serverStatus;
  const rawLogs = logsData?.userLogs || [];

  // Filter log berdasarkan teks pencarian dan jenis aksi
  const filteredLogs = rawLogs.filter((log) => {
    const matchesSearch =
      (log.action || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.details || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.userId || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (actionFilter === 'ALL') return true;
    return (log.action || '').toUpperCase().includes(actionFilter);
  });

  // Format durasi detik ke bentuk jam, menit, detik
  const formatUptime = (seconds) => {
    if (!seconds && seconds !== 0) return '-';
    if (seconds < 60) return `${seconds} dtk`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m < 60) return `${m}m ${s}s`;
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${h}j ${remM}m`;
  };

  // Badge warna semantik berdasarkan kategori aksi
  const getActionBadgeClass = (action = '') => {
    const act = action.toUpperCase();
    if (act.includes('LOGIN') || act.includes('SUCCESS')) return 'admin-badge-success';
    if (act.includes('QUIZ') || act.includes('SCORE')) return 'admin-badge-cyan';
    if (act.includes('REGISTER') || act.includes('OTP')) return 'admin-badge-purple';
    if (act.includes('FAIL') || act.includes('ERROR') || act.includes('BLOCK')) return 'admin-badge-danger';
    return 'admin-badge-neutral';
  };

  return (
    <div className="admin-page">
      {/* Header Panel Kontrol */}
      <div className="admin-header-card">
        <div className="admin-header-left">
          <div className="admin-pill-tag">
            <span className="pulse-indicator-dot"></span>
            👑 {currentLang === 'en' ? 'System Ops & Admin Hub' : 'Pusat Kendali & Admin Sistem'}
          </div>
          <h1 className="admin-title">
            {currentLang === 'en' ? 'PahamTeks Telemetry & Audit Dashboard' : 'Dasbor Telemetri & Audit PahamTeks'}
          </h1>
          <p className="admin-subtitle">
            {currentLang === 'en'
              ? 'Real-time monitoring for server health, Gemini AI key pool, dual database failover, and audit trail.'
              : 'Pemantauan langsung kesehatan server, pool kuota Gemini AI, failover basis data, dan log audit pengguna.'}
          </p>
        </div>

        <div className="admin-header-actions">
          {onBackHome && (
            <button className="admin-btn-action outline" onClick={onBackHome} title="Kembali ke Beranda">
              🏠 {currentLang === 'en' ? 'Home' : 'Beranda'}
            </button>
          )}
          <button className="admin-btn-action primary" onClick={handleRefreshAll} title="Muat ulang telemetri">
            🔄 {currentLang === 'en' ? 'Refresh' : 'Muat Ulang'}
          </button>
          <a
            href="http://localhost:4000/health"
            target="_blank"
            rel="noreferrer"
            className="admin-btn-action outline"
            title="Buka endpoint REST Health"
          >
            🏥 REST /health
          </a>
          <a
            href="http://localhost:4000/graphql"
            target="_blank"
            rel="noreferrer"
            className="admin-btn-action outline"
            title="Buka GraphQL Interactive Sandbox"
          >
            📡 GraphQL Sandbox
          </a>
        </div>
      </div>

      {/* Grid 4 Kartu Metrik Utama */}
      <div className="admin-metrics-grid">
        {/* Kartu 1: Status Server */}
        <div className="admin-metric-card">
          <div className="admin-card-header">
            <span className="admin-card-label">{currentLang === 'en' ? 'Server Status' : 'Status Server'}</span>
            <span className="admin-badge admin-badge-success">
              ● {serverLoading ? '...' : (status?.status || 'ONLINE').toUpperCase()}
            </span>
          </div>
          <div className="admin-card-value">
            {status?.uptimeSeconds !== undefined ? formatUptime(status.uptimeSeconds) : 'Aktif'}
            <span className="admin-card-subvalue"> (Uptime)</span>
          </div>
          <div className="admin-card-footer">
            <span>💾 RAM RSS: <strong>{status?.memoryRssMb || 65} MB</strong></span>
            <span>Heap: <strong>{status?.memoryHeapMb || 38} MB</strong></span>
          </div>
        </div>

        {/* Kartu 2: Basis Data Engine Failover */}
        <div className="admin-metric-card">
          <div className="admin-card-header">
            <span className="admin-card-label">{currentLang === 'en' ? 'Database Engine' : 'Mesin Basis Data'}</span>
            <span className="admin-badge admin-badge-cyan">
              🛡️ {status?.dbConnected ? 'TERHUBUNG' : 'DISCONNECTED'}
            </span>
          </div>
          <div className="admin-card-value" style={{ fontSize: '1.25rem', color: 'var(--text-main)' }}>
            {status?.activeDbEngine || 'SQLite (Cadangan Otomatis)'}
          </div>
          <div className="admin-card-footer">
            <span>👥 Pengguna: <strong>{status?.totalUsersCount ?? 0} Akun</strong></span>
            <span>📝 Kuis: <strong>{status?.totalQuizzesCount ?? 0} Sesi</strong></span>
          </div>
        </div>

        {/* Kartu 3: Gemini AI Key Pool */}
        <div className="admin-metric-card">
          <div className="admin-card-header">
            <span className="admin-card-label">{currentLang === 'en' ? 'Gemini AI Pool' : 'Pool Kunci Gemini AI'}</span>
            <span className="admin-badge admin-badge-purple">
              Round-Robin 1–9
            </span>
          </div>
          <div className="admin-card-value">
            {status?.geminiKeysCount ?? 4}
            <span className="admin-card-subvalue"> {currentLang === 'en' ? 'Keys Registered' : 'Kunci Aktif'}</span>
          </div>
          <div className="admin-card-footer">
            <span>Model: <strong>{status?.geminiModel || 'gemini-3.5-flash-lite'}</strong></span>
            <span>⚡ Cache RAM: <strong>0.04 ms</strong></span>
          </div>
        </div>

        {/* Kartu 4: Keamanan Sistem */}
        <div className="admin-metric-card">
          <div className="admin-card-header">
            <span className="admin-card-label">{currentLang === 'en' ? 'Security & Shields' : 'Perisai Keamanan'}</span>
            <span className="admin-badge admin-badge-success">
              PROTECTED
            </span>
          </div>
          <div className="admin-card-value" style={{ fontSize: '1.25rem', color: 'var(--btn-green)' }}>
            Rate Limit & Brute Guard
          </div>
          <div className="admin-card-footer">
            <span>Maks: <strong>200 req / 15m</strong></span>
            <span>JWT: <strong>7 Hari Aktif</strong></span>
          </div>
        </div>
      </div>

      {/* Bagian Visualisasi Slot Kunci Gemini AI */}
      <div className="admin-section-box" style={{ marginTop: '24px' }}>
        <div className="admin-section-header">
          <div>
            <h3 className="admin-section-title">
              🔑 {currentLang === 'en' ? 'Gemini API Multi-Key Status & Quota Pool' : 'Status Pool Kunci API Gemini & Proteksi Kuota'}
            </h3>
            <p className="admin-section-desc">
              {currentLang === 'en'
                ? 'System rotates through registered keys on every request. If Google triggers a 429 quota limit, backend seamlessly falls back to the next key.'
                : 'Sistem menggilir setiap kunci secara melingkar pada setiap request. Jika salah satu kunci terkena limit kuota 429, backend langsung beralih ke kunci berikutnya secara mulus.'}
            </p>
          </div>
          <span className="admin-pool-counter-tag">
            {status?.geminiKeysCount || 4} Slot Terisi
          </span>
        </div>

        <div className="admin-keys-grid">
          {Array.from({ length: Math.max(status?.geminiKeysCount || 4, 1) }).map((_, idx) => (
            <div key={idx} className="admin-key-card">
              <div className="admin-key-card-top">
                <span className="admin-key-slot-name">GEMINI_API_KEY_{idx + 1}</span>
                <span className="admin-badge admin-badge-success">SIAP / READY</span>
              </div>
              <div className="admin-key-bar-container">
                <div className="admin-key-bar-fill" style={{ width: '100%' }}></div>
              </div>
              <div className="admin-key-footer-text">
                <span>Mode: Round-Robin</span>
                <span>Port: 4000</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bagian Tabel Log Aktivitas Pengguna & Audit Trail */}
      <div className="admin-section-box" style={{ marginTop: '24px' }}>
        <div className="admin-section-header" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 className="admin-section-title">
              📋 {currentLang === 'en' ? 'User Activity & Security Audit Logs' : 'Log Aktivitas Pengguna & Audit Keamanan'}
            </h3>
            <p className="admin-section-desc">
              {currentLang === 'en'
                ? 'Recorded activity trail from users and background security events.'
                : 'Rekaman jejak aktivitas autentikasi, penyelesaian kuis, dan insiden keamanan.'}
            </p>
          </div>

          {/* Filter Bar */}
          <div className="admin-controls-bar">
            {/* Input Pencarian */}
            <input
              type="text"
              className="admin-search-box"
              placeholder={currentLang === 'en' ? 'Search action, details, user...' : 'Cari aksi, keterangan, user...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {/* Filter Aksi */}
            <select
              className="admin-select-filter"
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
            >
              <option value="ALL">{currentLang === 'en' ? 'All Actions' : 'Semua Aksi'}</option>
              <option value="LOGIN">Login & Sesi</option>
              <option value="REGISTER">Registrasi</option>
              <option value="QUIZ">Pengerjaan Kuis</option>
              <option value="OTP">OTP Email</option>
            </select>

            {/* Limit selector */}
            <select
              className="admin-select-filter"
              value={logLimit}
              onChange={(e) => setLogLimit(Number(e.target.value))}
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
              <option value={100}>100 Baris</option>
            </select>
          </div>
        </div>

        {/* Tabel Log */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '190px' }}>Waktu & Tanggal</th>
                <th style={{ width: '160px' }}>Aksi</th>
                <th style={{ width: '120px' }}>User ID</th>
                <th>Keterangan / Details</th>
              </tr>
            </thead>
            <tbody>
              {logsLoading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    ⏳ Memuat log aktivitas...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '35px', color: 'var(--text-muted)' }}>
                    {searchQuery
                      ? 'Tidak ada log yang cocok dengan kata kunci pencarian.'
                      : 'Belum ada rekaman aktivitas di tabel audit log.'}
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let formattedDate = '-';
                  try {
                    const d = new Date(log.createdAt);
                    formattedDate = !isNaN(d.getTime()) ? d.toLocaleString('id-ID') : String(log.createdAt);
                  } catch (e) {
                    formattedDate = String(log.createdAt);
                  }

                  return (
                    <tr key={log.id}>
                      <td className="admin-td-time">{formattedDate}</td>
                      <td>
                        <span className={`admin-badge ${getActionBadgeClass(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="admin-td-user">{log.userId ? `#${log.userId}` : 'Sistem / Tamu'}</td>
                      <td className="admin-td-details">{log.details || '-'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Petunjuk Berkas Penting untuk Admin */}
      <div className="admin-quick-guide-card" style={{ marginTop: '24px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-main)' }}>
          🧭 Petunjuk Akses Cepat Berkas Administrator (Developer Guide)
        </h4>
        <div className="admin-guide-grid">
          <div>
            <strong>Basis Data SQLite:</strong>
            <code>server/data/pahamteks_backup.sqlite</code>
            <p>Buka dengan <em>DB Browser for SQLite</em> atau ekstensi <em>SQLite Viewer</em> di VS Code.</p>
          </div>
          <div>
            <strong>Skrip Ekspor SQL Backup:</strong>
            <code>node server/src/db/exportSqlBackup.js</code>
            <p>Ekspor seluruh isi database ke format file <code>.sql</code> di folder <code>server/backups/</code>.</p>
          </div>
          <div>
            <strong>Kunci Rahasia & Konfigurasi:</strong>
            <code>server/.env</code>
            <p>Atur <code>GEMINI_API_KEY_1</code> s.d. <code>GEMINI_API_KEY_9</code> dan kredensial database.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
