import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
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

try {
    pool = mysql.createPool(dbConfig);
} catch (err) {
    console.warn('⚠️ [MySQL] Inisialisasi pool gagal:', err.message);
}

// Helper untuk test koneksi
export async function testDbConnection() {
    if (!pool) return false;
    try {
        const connection = await pool.getConnection();
        isConnected = true;
        connection.release();
        console.log('✅ [MySQL] Terhubung ke database MySQL:', dbConfig.database);
        return true;
    } catch (err) {
        isConnected = false;
        console.warn('⚠️ [MySQL] Belum dapat terhubung ke MySQL:', err.message);
        console.warn('💡 [MySQL] Pastikan username/password di server/.env sesuai dengan server MySQL lokal Anda.');
        return false;
    }
}

export function getDb() {
    return pool;
}

export function isDbConnected() {
    return isConnected;
}

export default pool;

