// Dynamic import DatabaseSync agar kompatibel di semua versi Node
let DatabaseSyncClass = null;
try {
    const sqliteMod = await import('node:sqlite');
    DatabaseSyncClass = sqliteMod.DatabaseSync || null;
} catch (_err) {
    console.warn('⚠️ [SQL FALLBACK] node:sqlite tidak tersedia di runtime ini. Mode memory store aktif.');
}
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

const JSON_BACKUP_PATH = path.join(DATA_DIR, 'pahamteks_mem_backup.json');

const memStore = {
    users: new Map(),
    otp: new Map(),
    logs: [],
    quizHistory: []
};

function saveMemoryStoreToDisk() {
    try {
        const payload = {
            users: Array.from(memStore.users.entries()),
            otp: Array.from(memStore.otp.entries()),
            logs: memStore.logs.slice(-200),
            quizHistory: memStore.quizHistory.slice(-500)
        };
        fs.writeFileSync(JSON_BACKUP_PATH, JSON.stringify(payload), 'utf8');
    } catch (err) {
        // Filesystem serverless bisa read-only; catat error penyimpanan lainnya.
        if (err.code !== 'EROFS' && err.code !== 'EACCES') {
            console.warn('[SQL FALLBACK] Gagal menyimpan memory store ke disk:', err.message);
        }
    }
}

function loadMemoryStoreFromDisk() {
    try {
        if (fs.existsSync(JSON_BACKUP_PATH)) {
            const raw = fs.readFileSync(JSON_BACKUP_PATH, 'utf8');
            const data = JSON.parse(raw);
            if (Array.isArray(data.users)) {
                memStore.users = new Map(data.users);
            }
            if (Array.isArray(data.otp)) {
                memStore.otp = new Map(data.otp);
            }
            if (Array.isArray(data.logs)) {
                memStore.logs = data.logs;
            }
            if (Array.isArray(data.quizHistory)) {
                memStore.quizHistory = data.quizHistory;
            }
        }
    } catch (err) {
        console.warn('[SQL FALLBACK] Gagal memuat memory store dari disk (mungkin file korup):', err.message);
    }
}

function executeMemorySql(cleanSql, cleanParams) {
    const isSelect = /^\s*SELECT/i.test(cleanSql);
    if (/quiz_history/i.test(cleanSql)) {
        if (/INSERT/i.test(cleanSql)) {
            const [user_id, level, categories, unit, unit_title, answers_json, score, total_questions] = cleanParams;
            const record = {
                id: memStore.quizHistory.length + 1,
                user_id,
                level,
                categories,
                unit,
                unit_title,
                answers_json,
                score,
                total_questions,
                created_at: new Date().toISOString()
            };
            memStore.quizHistory.unshift(record);
            saveMemoryStoreToDisk();
            return [{ insertId: record.id, affectedRows: 1 }, []];
        }
        if (/SELECT/i.test(cleanSql)) {
            const [userId, limit] = cleanParams;
            const rows = memStore.quizHistory
                .filter(record => Number(record.user_id) === Number(userId))
                .slice(0, Number(limit) || 100);
            return [rows, []];
        }
    }
    if (/otp_verifications/i.test(cleanSql)) {
        if (/INSERT/i.test(cleanSql)) {
            const email = String(cleanParams[0] || '').toLowerCase().trim();
            const otp_code = String(cleanParams[1] || '');
            const expires_at = String(cleanParams[2] || '');
            memStore.otp.set(email, { otp_code, expires_at });
            saveMemoryStoreToDisk();
            return [{ insertId: 1, affectedRows: 1 }, []];
        }
        if (/SELECT/i.test(cleanSql)) {
            const email = String(cleanParams[0] || '').toLowerCase().trim();
            const record = memStore.otp.get(email);
            return [record ? [{ otp_code: record.otp_code, expires_at: record.expires_at }] : [], []];
        }
        if (/DELETE/i.test(cleanSql)) {
            const email = String(cleanParams[0] || '').toLowerCase().trim();
            memStore.otp.delete(email);
            saveMemoryStoreToDisk();
            return [{ affectedRows: 1 }, []];
        }
    }
    if (/users/i.test(cleanSql)) {
        if (/SELECT/i.test(cleanSql)) {
            if (/WHERE/i.test(cleanSql)) {
                const param1 = String(cleanParams[0] || '').toLowerCase().trim();
                const param2 = String(cleanParams[1] || cleanParams[0] || '').toLowerCase().trim();
                let found = null;
                for (const u of memStore.users.values()) {
                    const uEmail = (u.email || '').toLowerCase();
                    const uName = (u.username || '').toLowerCase();
                    if (uEmail === param1 || uName === param1 || uEmail === param2 || uName === param2) {
                        found = u;
                        break;
                    }
                }
                return [found ? [{ ...found }] : [], []];
            }
            const allUsers = Array.from(memStore.users.values()).map(u => ({ ...u }));
            return [allUsers, []];
        }
        if (/INSERT/i.test(cleanSql)) {
            const email = String(cleanParams[0] || '').toLowerCase().trim();
            if (memStore.users.has(email)) {
                const dupErr = new Error('UNIQUE constraint failed: users.email');
                dupErr.code = 'ER_DUP_ENTRY';
                throw dupErr;
            }
            const newUser = {
                id: memStore.users.size + 1,
                email,
                username: cleanParams[1] || email.split('@')[0],
                password: cleanParams[2] || '',
                first_name: cleanParams[3] || '',
                last_name: cleanParams[4] || '',
                created_at: new Date().toISOString()
            };
            memStore.users.set(email, newUser);
            saveMemoryStoreToDisk();
            return [{ insertId: newUser.id, affectedRows: 1 }, []];
        }
        if (/UPDATE/i.test(cleanSql)) {
            const newPassword = String(cleanParams[0] || '');
            const target = String(cleanParams[1] || '').toLowerCase().trim();
            for (const [key, u] of memStore.users.entries()) {
                if (String(u.id) === target || (u.email && u.email.toLowerCase() === target)) {
                    u.password = newPassword;
                    memStore.users.set(key, u);
                    saveMemoryStoreToDisk();
                    return [{ affectedRows: 1 }, []];
                }
            }
            return [{ affectedRows: 0 }, []];
        }
    }
    if (/user_activity_logs/i.test(cleanSql)) {
        if (/INSERT/i.test(cleanSql)) {
            memStore.logs.push({
                id: memStore.logs.length + 1,
                user_id: cleanParams[0] || null,
                action: cleanParams[1] || '',
                details: cleanParams[2] || '',
                created_at: new Date().toISOString()
            });
            saveMemoryStoreToDisk();
            return [{ insertId: memStore.logs.length, affectedRows: 1 }, []];
        }
        if (/SELECT/i.test(cleanSql)) {
            return [[...memStore.logs], []];
        }
    }
    return isSelect ? [[], []] : [{ insertId: 0, affectedRows: 0 }, []];
}


/**
 * Inisialisasi Database Cadangan SQL (SQLite)
 */
export function initFallbackSqlDb() {
    loadMemoryStoreFromDisk();
    try {
        if (!sqliteDb && DatabaseSyncClass) {
            sqliteDb = new DatabaseSyncClass(DB_FILE_PATH);
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
                    unit INTEGER NOT NULL DEFAULT 1,
                    unit_title TEXT NULL,
                    answers_json TEXT NULL,
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

            const quizColumns = new Set(sqliteDb.prepare('PRAGMA table_info(quiz_history)').all().map(column => column.name));
            if (!quizColumns.has('unit')) {
                sqliteDb.exec('ALTER TABLE quiz_history ADD COLUMN unit INTEGER NOT NULL DEFAULT 1');
            }
            if (!quizColumns.has('unit_title')) {
                sqliteDb.exec('ALTER TABLE quiz_history ADD COLUMN unit_title TEXT NULL');
            }
            if (!quizColumns.has('answers_json')) {
                sqliteDb.exec('ALTER TABLE quiz_history ADD COLUMN answers_json TEXT NULL');
            }
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

    if (!sqliteDb) {
        initFallbackSqlDb();
    }
    if (!sqliteDb) {
        return executeMemorySql(cleanSql, cleanParams);
    }

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

