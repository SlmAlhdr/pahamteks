import { DatabaseSync } from 'node:sqlite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isVercel = Boolean(process.env.VERCEL);
const DATA_DIR = isVercel ? path.join('/tmp', 'pahamteks_data') : path.resolve(__dirname, '../../data');
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (err) {
        console.warn('[SQL FALLBACK] Gagal membuat direktori data:', err.message);
    }
}

const DB_FILE_PATH = path.join(DATA_DIR, 'pahamteks_backup.sqlite');

let sqliteDb = null;

/**
 * Inisialisasi Database Cadangan SQL (SQLite)
 */
export function initFallbackSqlDb() {
    try {
        if (!sqliteDb) {
            sqliteDb = new DatabaseSync(DB_FILE_PATH);
            console.log('🛡️ [SQL FALLBACK] Database Cadangan SQL (SQLite) siap pada:', DB_FILE_PATH);
            
            // Inisialisasi skema tabel SQL
            sqliteDb.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    first_name TEXT NULL,
                    last_name TEXT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS otp_verifications (
                    email TEXT PRIMARY KEY,
                    otp_code TEXT NOT NULL,
                    expires_at TEXT NOT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS user_activity_logs (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NULL,
                    action TEXT NOT NULL,
                    details TEXT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS quiz_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NULL,
                    level TEXT NOT NULL,
                    categories TEXT NOT NULL,
                    score INTEGER NOT NULL,
                    total_questions INTEGER NOT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS quiz_explanations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    question TEXT NOT NULL,
                    user_answer TEXT NOT NULL,
                    correct_answer TEXT NOT NULL,
                    explanation TEXT NOT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS search_history (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NULL,
                    keyword TEXT NOT NULL,
                    result TEXT NOT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );

                CREATE TABLE IF NOT EXISTS translations (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NULL,
                    source_text TEXT NOT NULL,
                    translated_text TEXT NOT NULL,
                    source_lang TEXT NOT NULL,
                    target_lang TEXT NOT NULL,
                    created_at TEXT DEFAULT (datetime('now'))
                );
            `);
        }
        return sqliteDb;
    } catch (err) {
        console.error('❌ [SQL FALLBACK] Gagal inisialisasi Database Cadangan SQL:', err.message);
        return null;
    }
}

/**
 * Normalisasi query MySQL agar kompatibel dengan SQLite
 */
function normalizeQueryForSqlite(sql) {
    let normalized = sql.trim();

    // Ubah ON DUPLICATE KEY UPDATE untuk otp_verifications
    if (/INSERT\s+INTO\s+otp_verifications/i.test(normalized) && /ON\s+DUPLICATE\s+KEY\s+UPDATE/i.test(normalized)) {
        normalized = normalized.replace(
            /ON\s+DUPLICATE\s+KEY\s+UPDATE.*$/is,
            'ON CONFLICT(email) DO UPDATE SET otp_code=excluded.otp_code, expires_at=excluded.expires_at'
        );
    }

    return normalized;
}

/**
 * Adapter eksekusi SQL kompatibel dengan interface mysql2 [rows, fields]
 */
export async function executeFallbackSql(sql, params = []) {
    if (!sqliteDb) {
        initFallbackSqlDb();
    }
    if (!sqliteDb) {
        throw new Error('Database cadangan SQL tidak tersedia.');
    }

    const cleanSql = normalizeQueryForSqlite(sql);
    const isSelect = /^\s*SELECT/i.test(cleanSql);

    // Normalisasi parameter agar selalu kompatibel dengan binding tipe data SQLite:
    // 1. JavaScript Date instance -> ISO 8601 string
    // 2. undefined -> null
    // 3. boolean -> 1 atau 0
    const cleanParams = params.map(p => {
        if (p instanceof Date) {
            return p.toISOString();
        }
        if (p === undefined) {
            return null;
        }
        if (typeof p === 'boolean') {
            return p ? 1 : 0;
        }
        return p;
    });

    try {
        const stmt = sqliteDb.prepare(cleanSql);

        if (isSelect) {
            const rawRows = stmt.all(...cleanParams);
            // Kembalikan objek row standar
            const rows = rawRows.map(r => ({ ...r }));
            return [rows, []];
        } else {
            const info = stmt.run(...cleanParams);
            const resultHeader = {
                insertId: info.lastInsertRowid ? Number(info.lastInsertRowid) : 0,
                affectedRows: info.changes || 0
            };
            return [resultHeader, []];
        }
    } catch (err) {
        // Konversi error kode agar sesuai dengan MySQL error code jika duplikat
        if (err.message && err.message.includes('UNIQUE constraint failed')) {
            const customErr = new Error(err.message);
            customErr.code = 'ER_DUP_ENTRY';
            throw customErr;
        }
        throw err;
    }
}

export function getFallbackSqlDb() {
    if (!sqliteDb) initFallbackSqlDb();
    return {
        execute: executeFallbackSql,
        isFallback: true
    };
}

export function getFallbackDbFilePath() {
    return DB_FILE_PATH;
}

