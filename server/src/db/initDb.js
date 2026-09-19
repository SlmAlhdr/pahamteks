import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    console.log('🚀 [DB INIT] Memulai inisialisasi database MySQL untuk PahamTeks...');

    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const dbName = process.env.DB_NAME || 'pahamteks_db';

    let connection;
    try {
        // Hubungkan ke MySQL server tanpa database terlebih dahulu
        connection = await mysql.createConnection({ host, port, user, password, connectTimeout: 5000 });
        console.log(`✅ [DB INIT] Terhubung ke MySQL server pada ${host}:${port} sebagai ${user}`);

        // Buat database jika belum ada
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
        console.log(`✅ [DB INIT] Database \`${dbName}\` siap.`);

        // Pilih database
        await connection.changeUser({ database: dbName });

        // Baca file schema.sql
        const schemaPath = path.resolve(__dirname, '../../schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Pisahkan per pernyataan query
        const statements = schemaSql
            .split(/;\s*$/m)
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.toUpperCase().startsWith('CREATE DATABASE') && !s.toUpperCase().startsWith('USE'));

        for (const stmt of statements) {
            try {
                await connection.query(stmt);
            } catch (queryErr) {
                console.warn('⚠️ [DB INIT] Pernyataan dilewati atau peringatan:', queryErr.message);
            }
        }

        console.log('🎉 [DB INIT] Seluruh tabel skema MySQL (users, otp, logs, quiz, dll.) berhasil disiapkan!');
    } catch (err) {
        console.error('❌ [DB INIT] Gagal menginisialisasi database MySQL:');
        console.error('   Detail error:', err.message);
        console.error('   👉 Silakan pastikan kata sandi (DB_PASSWORD) di server/.env sudah tepat.');
    } finally {
        if (connection) await connection.end();
    }
}

initDatabase();

