import bcrypt from 'bcryptjs';
import { getDb, isDbConnected } from '../config/db.js';

// Fallback in-memory database jika MySQL belum dikonfigurasi password-nya
const memUsers = new Map();
const memOtp = new Map();

export const authResolvers = {
    Query: {
        me: async (_, { email }) => {
            if (!email) return null;
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute('SELECT id, email, first_name, last_name, created_at FROM users WHERE email = ?', [email]);
                    if (rows.length > 0) {
                        const u = rows[0];
                        return {
                            id: String(u.id),
                            email: u.email,
                            name: `${u.first_name} ${u.last_name}`.trim(),
                            createdAt: u.created_at ? u.created_at.toISOString() : null
                        };
                    }
                } catch (err) {
                    console.warn('[Auth Query Me Error]', err.message);
                }
            }
            if (memUsers.has(email)) {
                const u = memUsers.get(email);
                return {
                    id: 'mem-' + email,
                    email: u.email,
                    name: u.name,
                    createdAt: new Date().toISOString()
                };
            }
            return null;
        }
    },

    Mutation: {
        sendOtp: async (_, { email }) => {
            if (!email || !email.trim()) {
                return { success: false, message: 'Email wajib diisi!' };
            }
            const cleanEmail = email.trim().toLowerCase();

            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
                    if (existing.length > 0) {
                        return { success: false, message: 'Email sudah terdaftar! Silakan Sign In.' };
                    }
                    const otpCode = '123456'; // Default OTP simulasi
                    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit
                    await db.execute(
                        'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at)',
                        [cleanEmail, otpCode, expiresAt]
                    );
                    return { success: true, message: 'Kode OTP verifikasi berhasil dikirim (Kode: 123456)!' };
                } catch (err) {
                    console.warn('[DB Send OTP]', err.message);
                }
            }

            if (memUsers.has(cleanEmail)) {
                return { success: false, message: 'Email sudah terdaftar! Silakan Sign In.' };
            }
            memOtp.set(cleanEmail, '123456');
            return { success: true, message: 'Kode OTP terkirim! (Kode simulasi: 123456)' };
        },

        register: async (_, { email, password, fname, lname, otp }) => {
            if (!email || !password || !fname || !lname || !otp) {
                return { success: false, message: 'Mohon lengkapi semua kolom formulir!' };
            }
            const cleanEmail = email.trim().toLowerCase();

            if (isDbConnected()) {
                const db = getDb();
                try {
                    // Validasi OTP
                    const [otpRows] = await db.execute('SELECT otp_code, expires_at FROM otp_verifications WHERE email = ?', [cleanEmail]);
                    if (otpRows.length === 0 || otpRows[0].otp_code !== otp.trim()) {
                        return { success: false, message: 'Kode OTP tidak cocok atau sudah kadaluarsa!' };
                    }

                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);

                    const [res] = await db.execute(
                        'INSERT INTO users (email, password, first_name, last_name) VALUES (?, ?, ?, ?)',
                        [cleanEmail, hash, fname.trim(), lname.trim()]
                    );

                    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [cleanEmail]);

                    return {
                        success: true,
                        message: 'Pendaftaran berhasil! Selamat datang di PahamTeks.',
                        user: {
                            id: String(res.insertId),
                            email: cleanEmail,
                            name: `${fname} ${lname}`.trim(),
                            createdAt: new Date().toISOString()
                        }
                    };
                } catch (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return { success: false, message: 'Email ini sudah terdaftar!' };
                    }
                    return { success: false, message: `Database error: ${err.message}` };
                }
            }

            // Fallback memori
            if (memOtp.get(cleanEmail) !== otp.trim()) {
                return { success: false, message: 'Kode OTP salah!' };
            }
            const fullName = `${fname} ${lname}`.trim();
            memUsers.set(cleanEmail, { email: cleanEmail, password, name: fullName });
            memOtp.delete(cleanEmail);

            return {
                success: true,
                message: 'Pendaftaran berhasil!',
                user: {
                    id: 'mem-' + cleanEmail,
                    email: cleanEmail,
                    name: fullName,
                    createdAt: new Date().toISOString()
                }
            };
        },

        login: async (_, { email, password }) => {
            if (!email || !password) {
                return { success: false, message: 'Email dan kata sandi wajib diisi!' };
            }
            const cleanEmail = email.trim().toLowerCase();

            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute('SELECT id, email, password, first_name, last_name FROM users WHERE email = ?', [cleanEmail]);
                    if (rows.length === 0) {
                        return { success: false, message: 'Akun dengan email ini belum terdaftar!' };
                    }
                    const user = rows[0];
                    let isMatch = false;
                    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                        isMatch = await bcrypt.compare(password, user.password);
                    } else {
                        isMatch = user.password === password;
                    }

                    if (!isMatch) {
                        return { success: false, message: 'Kata sandi salah!' };
                    }

                    return {
                        success: true,
                        message: 'Login berhasil!',
                        user: {
                            id: String(user.id),
                            email: user.email,
                            name: `${user.first_name} ${user.last_name}`.trim()
                        }
                    };
                } catch (err) {
                    return { success: false, message: `Database error: ${err.message}` };
                }
            }

            if (!memUsers.has(cleanEmail)) {
                return { success: false, message: 'Email tidak ditemukan!' };
            }
            const u = memUsers.get(cleanEmail);
            if (u.password !== password) {
                return { success: false, message: 'Kata sandi salah!' };
            }
            return {
                success: true,
                message: 'Login berhasil!',
                user: {
                    id: 'mem-' + cleanEmail,
                    email: u.email,
                    name: u.name
                }
            };
        }
    }
};

