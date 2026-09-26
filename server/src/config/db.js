import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { initFallbackSqlDb, executeFallbackSql, getFallbackDbFilePath } from '../db/fallbackDb.js';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) });
dotenv.config();

const isVercel = Boolean(process.env.VERCEL);
const persistentDatabaseRequired = isVercel || process.env.NODE_ENV === 'production';
const mysqlConfigured = Boolean(process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME);

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number.parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pahamteks_db',
    waitForConnections: true,
    connectionLimit: isVercel ? 5 : 10,
    queueLimit: 0,
    connectTimeout: 5000,
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: true } } : {})
};

let pool = null;
let isConnected = false;
let connectionPromise = null;

// SQLite hanya menjadi fallback pengembangan lokal; filesystem function Vercel bersifat sementara.
if (!persistentDatabaseRequired) {
    initFallbackSqlDb();
}

// Jangan mencoba localhost atau kredensial kosong pada deployment produksi.
if (mysqlConfigured || !persistentDatabaseRequired) {
    try {
        pool = mysql.createPool(dbConfig);
    } catch (err) {
        console.warn('[MySQL] Inisialisasi pool gagal:', err.message);
    }
}

async function ensureMySqlSchema(connection) {
    const statements = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            username VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(100) NULL,
            last_name VARCHAR(100) NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS otp_verifications (
            email VARCHAR(255) PRIMARY KEY,
            otp_code VARCHAR(10) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS user_activity_logs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            action VARCHAR(100) NOT NULL,
            details TEXT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS quiz_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            level VARCHAR(50) NOT NULL,
            categories VARCHAR(255) NOT NULL,
            score INT NOT NULL,
            total_questions INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS quiz_explanations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            question TEXT NOT NULL,
            user_answer TEXT NOT NULL,
            correct_answer TEXT NOT NULL,
            explanation TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS search_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            keyword VARCHAR(255) NOT NULL,
            result TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
        `CREATE TABLE IF NOT EXISTS translations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NULL,
            source_text TEXT NOT NULL,
            translated_text TEXT NOT NULL,
            source_lang VARCHAR(30) NOT NULL,
            target_lang VARCHAR(30) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ];

    for (const statement of statements) {
        await connection.query(statement);
    }

    const [columns] = await connection.query("SHOW COLUMNS FROM `users` LIKE 'username'");
    if (columns.length === 0) {
        await connection.query("ALTER TABLE `users` ADD COLUMN `username` VARCHAR(100) UNIQUE NULL AFTER `email`");
    }
}

async function connectPersistentDatabase() {
    if (isConnected) return true;
    if (!pool) return false;

    if (!connectionPromise) {
        connectionPromise = (async () => {
            const connection = await pool.getConnection();
            try {
                await ensureMySqlSchema(connection);
                isConnected = true;
                console.log('✅ [MySQL] Terhubung dan skema siap:', dbConfig.database);
            } finally {
                connection.release();
            }
            return true;
        })().catch(err => {
            isConnected = false;
            console.warn('[MySQL] Database utama belum dapat dihubungi:', err.message);
            return false;
        }).finally(() => {
            connectionPromise = null;
        });
    }

    return connectionPromise;
}

// Dipanggil saat server lokal mulai dan secara lazy pada request serverless pertama.
export async function testDbConnection() {
    const connected = await connectPersistentDatabase();
    if (!connected && !persistentDatabaseRequired) {
        console.log('🛡️ [SQL FAILOVER] Database lokal menggunakan SQLite fallback.');
    }
    return connected;
}

/** Memberikan adapter query MySQL dan fallback lokal untuk resolver GraphQL. */
export function getDb() {
    return {
        execute: async (sql, params = []) => {
            const connected = await connectPersistentDatabase();
            if (!connected) {
                if (persistentDatabaseRequired) {
                    throw new Error('Database persisten belum dikonfigurasi atau tidak dapat dihubungi. Atur DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, dan DB_NAME pada environment hosting.');
                }
                return executeFallbackSql(sql, params);
            }

            try {
                return await pool.execute(sql, params);
            } catch (err) {
                console.warn('[MySQL Query Error]', err.message);
                if (persistentDatabaseRequired) throw err;
                console.warn('[SQL FAILOVER] Query lokal diteruskan ke SQLite fallback.');
                return executeFallbackSql(sql, params);
            }
        }
    };
}

// Produksi hanya dianggap siap jika tersedia konfigurasi untuk database eksternal persisten.
export function isDbConnected() {
    return persistentDatabaseRequired ? mysqlConfigured : true;
}

export function isPersistentDatabaseRequired() {
    return persistentDatabaseRequired;
}

export function isMySqlPrimaryConnected() {
    return isConnected;
}

export function getDbStatus() {
    const activeEngine = isConnected
        ? 'MySQL (Database persisten)'
        : persistentDatabaseRequired
            ? mysqlConfigured ? 'MySQL belum terhubung' : 'Database persisten belum dikonfigurasi'
            : 'SQLite (Fallback lokal)';

    return {
        primary: isConnected ? 'MYSQL_ONLINE' : mysqlConfigured ? 'MYSQL_OFFLINE' : 'DATABASE_NOT_CONFIGURED',
        backup: persistentDatabaseRequired ? 'DISABLED_IN_SERVERLESS' : 'SQLITE_LOCAL_FALLBACK',
        activeEngine,
        backupFilePath: persistentDatabaseRequired ? null : getFallbackDbFilePath()
    };
}

export default pool;
