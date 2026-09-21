import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getDb, getDbStatus } from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BACKUP_DIR = path.resolve(__dirname, '../../backups');
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

const TABLES = [
    'users',
    'otp_verifications',
    'user_activity_logs',
    'quiz_history',
    'quiz_explanations',
    'search_history',
    'translations'
];

async function exportSqlBackup() {
    console.log('📦 [SQL BACKUP EXPORTER] Memulai pencadangan data ke berkas SQL snapshot...');
    const db = getDb();
    const dbStatus = getDbStatus();
    console.log(`ℹ️ [SQL BACKUP EXPORTER] Sumber data aktif: ${dbStatus.activeEngine}`);

    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const timestampStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const filename = `pahamteks_backup_${timestampStr}.sql`;
    const targetFile = path.join(BACKUP_DIR, filename);

    let sqlOutput = `-- ========================================================\n`;
    sqlOutput += `-- PahamTeks SQL Snapshot Backup\n`;
    sqlOutput += `-- Dibuat pada: ${now.toISOString()}\n`;
    sqlOutput += `-- Sumber: ${dbStatus.activeEngine}\n`;
    sqlOutput += `-- ========================================================\n\n`;

    let totalRowsExported = 0;

    for (const table of TABLES) {
        try {
            const [rows] = await db.execute(`SELECT * FROM ${table}`);
            sqlOutput += `-- --------------------------------------------------------\n`;
            sqlOutput += `-- Data untuk tabel: \`${table}\` (${rows.length} baris)\n`;
            sqlOutput += `-- --------------------------------------------------------\n`;

            if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                const colNames = columns.map(c => `\`${c}\``).join(', ');

                for (const row of rows) {
                    const values = columns.map(col => {
                        const val = row[col];
                        if (val === null || val === undefined) return 'NULL';
                        if (typeof val === 'number') return val;
                        // Escape string quotes
                        const escaped = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
                        return `'${escaped}'`;
                    }).join(', ');

                    sqlOutput += `INSERT INTO \`${table}\` (${colNames}) VALUES (${values});\n`;
                    totalRowsExported++;
                }
            } else {
                sqlOutput += `-- (Tabel kosong)\n`;
            }
            sqlOutput += `\n`;
        } catch (err) {
            sqlOutput += `-- Gagal mengekstrak tabel \`${table}\`: ${err.message}\n\n`;
        }
    }

    fs.writeFileSync(targetFile, sqlOutput, 'utf8');
    const fileSizeKB = (fs.statSync(targetFile).size / 1024).toFixed(2);

    console.log(`✅ [SQL BACKUP EXPORTER] Cadangan SQL berhasil dibuat!`);
    console.log(`   📄 Berkas: ${targetFile}`);
    console.log(`   📊 Total baris data: ${totalRowsExported}`);
    console.log(`   💾 Ukuran berkas: ${fileSizeKB} KB`);
}

exportSqlBackup().catch(err => {
    console.error('❌ [SQL BACKUP EXPORTER] Terjadi kesalahan:', err);
    process.exit(1);
});

