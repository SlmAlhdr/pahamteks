import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { initFallbackSqlDb, executeFallbackSql, getFallbackDbFilePath } from '../db/fallbackDb.js';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'pahamteks_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 5000
};

let pool = null;
let isConnected = false;

// 1. Inisialisasi Database Cadangan SQL (SQLite) sejak awal
initFallbackSqlDb();

// 2. Inisialisasi Pool MySQL Utama
try {
    pool = mysql.createPool(dbConfig);
} catch (err) {
    console.warn('⚠️ [MySQL] Inisialisasi pool MySQL gagal:', err.message);
}

// 3. Helper test koneksi MySQL utama
export async function testDbConnection() {
    if (!pool) return false;
    try {
        const connection = await pool.getConnection();
        isConnected = true;
        console.log('✅ [MySQL] Terhubung ke database MySQL utama:', dbConfig.database);

        // Auto-migrate kolom username jika belum ada di tabel users
        try {
            const [columns] = await connection.query("SHOW COLUMNS FROM `users` LIKE 'username'");
            if (columns.length === 0) {
                console.log('🔄 [MySQL] Menambahkan kolom `username` ke tabel users...');
                await connection.query("ALTER TABLE `users` ADD COLUMN `username` VARCHAR(100) UNIQUE NULL AFTER `email`");
                console.log('✅ [MySQL] Kolom `username` berhasil ditambahkan ke tabel users.');
            }
        } catch (mErr) {
            if (mErr.code !== 'ER_NO_SUCH_TABLE') {
                console.warn('⚠️ [MySQL Migration] Cek skema kolom username:', mErr.message);
            }
        }

        connection.release();
        return true;
    } catch (err) {
        isConnected = false;
        console.warn('⚠️ [MySQL] Belum dapat terhubung ke MySQL utama:', err.message);
        console.log('🛡️ [SQL FAILOVER] Sistem aktif menggunakan Database Cadangan SQL (SQLite) agar aplikasi tetap berjalan normal.');
        return false;
    }
}

/**
 * Mendapatkan Database Adapter dengan Otomatisasi Failover:
 * - Menjalankan ke MySQL jika online.
 * - Jika MySQL down/error koneksi, otomatis beralih ke Database Cadangan SQL (SQLite).
 * - Menjaga replikasi data ke cadangan saat ada penulisan data baru.
 */
export function getDb() {
    return {
        execute: async (sql, params = []) => {
            // Jika MySQL terhubung, coba eksekusi di MySQL
            if (isConnected && pool) {
                try {
                    const [rows, fields] = await pool.execute(sql, params);

                    // Replikasi data ke Database Cadangan SQL di background untuk INSERT/UPDATE/DELETE
                    if (!/^\s*SELECT/i.test(sql)) {
                        executeFallbackSql(sql, params).catch(() => {});
                    }

                    return [rows, fields];
                } catch (mySqlErr) {
                    console.warn('🚨 [DB FAILOVER TRIGGERED] MySQL mengalami kendala, mengalihkan otomatis ke Database Cadangan SQL:', mySqlErr.message);
                    return executeFallbackSql(sql, params);
                }
            }

            // Jika MySQL offline/down, langsung eksekusi di Database Cadangan SQL
            return executeFallbackSql(sql, params);
        }
    };
}

/**
 * Status koneksi database: bernilai true karena selalu ada database SQL aktif (MySQL atau SQLite Cadangan)
 */
export function isDbConnected() {
    return true;
}

/**
 * Cek apakah MySQL utama yang sedang aktif
 */
export function isMySqlPrimaryConnected() {
    return isConnected;
}

/**
 * Informasi status telemetri database untuk endpoint /health
 */
export function getDbStatus() {
    return {
        primary: isConnected ? 'MYSQL_ONLINE' : 'MYSQL_OFFLINE',
        backup: 'SQLITE_ACTIVE_READY',
        activeEngine: isConnected ? 'MySQL (Utama)' : 'SQLite (Cadangan Otomatis)',
        backupFilePath: getFallbackDbFilePath()
    };
}

export default pool;
