import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb, isDbConnected } from '../config/db.js';
import { sendOtpEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import {
    checkLoginBruteForce,
    recordLoginFailure,
    recordLoginSuccess,
    checkOtpRateLimit,
    logSecurityEvent
} from '../utils/securityLogger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'pahamteks_jwt_super_secure_key_2026';

// Buat token sesi yang dipakai client setelah autentikasi berhasil.
function createJwtToken(user) {
    return jwt.sign(
        {
            id: String(user.id),
            email: user.email,
            username: user.username
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// Fallback in-memory database jika MySQL belum dikonfigurasi password-nya
const memUsers = new Map();
const memOtp = new Map();

// Helper validasi format username
function isValidUsername(username) {
    if (!username || typeof username !== 'string') return false;
    const clean = username.trim();
    return /^[a-zA-Z0-9_]{3,30}$/.test(clean);
}

export const authResolvers = {
    Query: {
        // Cari profil melalui email atau username, termasuk fallback memori.
        me: async (_, { email }) => {
            if (!email) return null;
            const cleanIdentifier = email.trim().toLowerCase();

            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT id, email, username, first_name, last_name, created_at FROM users WHERE email = ? OR username = ?',
                        [cleanIdentifier, cleanIdentifier]
                    );
                    if (rows.length > 0) {
                        const u = rows[0];
                        const displayName = u.username || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0];
                        return {
                            id: String(u.id),
                            email: u.email,
                            username: u.username || u.email.split('@')[0],
                            name: displayName,
                            createdAt: u.created_at ? new Date(u.created_at).toISOString() : null
                        };
                    }
                } catch (err) {
                    console.warn('[Auth Query Me Error]', err.message);
                }
            }

            // Fallback memori
            for (const [, u] of memUsers.entries()) {
                if (u.email.toLowerCase() === cleanIdentifier || (u.username && u.username.toLowerCase() === cleanIdentifier)) {
                    return {
                        id: 'mem-' + u.email,
                        email: u.email,
                        username: u.username || u.email.split('@')[0],
                        name: u.username || u.name,
                        createdAt: new Date().toISOString()
                    };
                }
            }

            return null;
        }
    },

    Mutation: {
        // Kirim OTP pendaftaran setelah cek batas permintaan dan duplikasi email.
        sendOtp: async (_, { email }, context) => {
            if (!email || !email.trim()) {
                return { success: false, message: 'Alamat email wajib diisi!' };
            }
            const cleanEmail = email.trim().toLowerCase();
            const clientIp = context?.clientIp || 'unknown';

            // 0. Cek pembatasan frekuensi (Rate Limiting) per email/IP
            const otpCheck = checkOtpRateLimit(cleanEmail, clientIp);
            if (!otpCheck.allowed) {
                return { success: false, message: otpCheck.message };
            }

            // 1. Cek apakah email sudah terdaftar
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
                    if (existing.length > 0) {
                        return { success: false, message: 'Email sudah terdaftar. Silakan Masuk.' };
                    }
                } catch (err) {
                    console.warn('[DB Check Existing Email]', err.message);
                }
            } else if (memUsers.has(cleanEmail)) {
                return { success: false, message: 'Email sudah terdaftar. Silakan Masuk.' };
            }

            // 2. Generate kode OTP 6-digit acak
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

            // 3. Simpan OTP di database atau memori
            if (isDbConnected()) {
                const db = getDb();
                try {
                    await db.execute(
                        'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at)',
                        [cleanEmail, otpCode, expiresAt]
                    );
                } catch (err) {
                    console.warn('[DB Save OTP]', err.message);
                    memOtp.set(cleanEmail, { code: otpCode, expiresAt: expiresAt.getTime() });
                }
            } else {
                memOtp.set(cleanEmail, { code: otpCode, expiresAt: expiresAt.getTime() });
            }

            // 4. Kirim email nyata ke alamat email tujuan
            const emailResult = await sendOtpEmail(cleanEmail, otpCode);

            return {
                success: emailResult.success,
                message: emailResult.message
            };
        },

        // Verifikasi OTP, simpan akun baru, lalu buat sesi pengguna.
        register: async (_, { email, password, username, fname, lname, otp }, context) => {
            const finalUsername = (username || fname || '').trim();

            if (!email || !password || !finalUsername || !otp) {
                return { success: false, message: 'Mohon lengkapi username, email, kata sandi, dan kode verifikasi!' };
            }

            if (!isValidUsername(finalUsername)) {
                return {
                    success: false,
                    message: 'Username harus terdiri dari 3–30 karakter (hanya huruf, angka, atau garis bawah).'
                };
            }

            if (password.length < 6) {
                return { success: false, message: 'Kata sandi minimal 6 karakter!' };
            }

            const cleanEmail = email.trim().toLowerCase();
            const cleanOtp = otp.trim();

            if (isDbConnected()) {
                const db = getDb();
                try {
                    // Validasi apakah username sudah digunakan
                    const [existingUser] = await db.execute('SELECT id FROM users WHERE username = ?', [finalUsername]);
                    if (existingUser.length > 0) {
                        return { success: false, message: `Username "${finalUsername}" sudah digunakan. Silakan pilih username lain!` };
                    }

                    // Validasi apakah email sudah terdaftar
                    const [existingEmail] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
                    if (existingEmail.length > 0) {
                        return { success: false, message: 'Email ini sudah terdaftar! Silakan langsung masuk.' };
                    }

                    // Validasi OTP dari Database
                    const [otpRows] = await db.execute(
                        'SELECT otp_code, expires_at FROM otp_verifications WHERE email = ?',
                        [cleanEmail]
                    );

                    if (otpRows.length === 0) {
                        return { success: false, message: 'Kode verifikasi belum dikirim atau sudah kadaluarsa. Silakan kirim ulang.' };
                    }

                    const record = otpRows[0];
                    if (new Date(record.expires_at) < new Date()) {
                        await db.execute('DELETE FROM otp_verifications WHERE email = ?', [cleanEmail]);
                        return { success: false, message: 'Kode verifikasi sudah kadaluarsa. Silakan kirim ulang kode baru.' };
                    }

                    if (record.otp_code !== cleanOtp) {
                        return { success: false, message: 'Kode verifikasi salah! Periksa kembali email Anda.' };
                    }

                    // Hashing password dengan bcrypt (Salt 10)
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(password, salt);

                    const [res] = await db.execute(
                        'INSERT INTO users (email, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
                        [cleanEmail, finalUsername, hash, finalUsername, (lname || '').trim()]
                    );

                    // Hapus OTP setelah berhasil digunakan
                    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [cleanEmail]);

                    const token = createJwtToken({ id: res.insertId, email: cleanEmail, username: finalUsername });
                    logSecurityEvent({
                        eventType: 'USER_REGISTERED',
                        severity: 'INFO',
                        identifier: cleanEmail,
                        ip: context?.clientIp,
                        details: `Pengguna baru @${finalUsername} berhasil didaftarkan.`,
                        userId: res.insertId
                    });

                    return {
                        success: true,
                        message: `Pendaftaran akun @${finalUsername} berhasil! Selamat datang di PahamTeks.`,
                        token,
                        user: {
                            id: String(res.insertId),
                            email: cleanEmail,
                            username: finalUsername,
                            name: finalUsername,
                            token,
                            createdAt: new Date().toISOString()
                        }
                    };
                } catch (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return { success: false, message: 'Email atau username ini sudah terdaftar!' };
                    }
                    console.warn('[DB Register Error]', err.message);
                }
            }

            // Fallback memori
            // Cek apakah username sudah dipakai di memori
            for (const [, u] of memUsers.entries()) {
                if (u.username && u.username.toLowerCase() === finalUsername.toLowerCase()) {
                    return { success: false, message: `Username "${finalUsername}" sudah digunakan di sistem!` };
                }
            }

            const memRecord = memOtp.get(cleanEmail);
            if (!memRecord) {
                return { success: false, message: 'Kode verifikasi belum diminta atau sudah kadaluarsa.' };
            }

            const storedCode = typeof memRecord === 'object' ? memRecord.code : memRecord;
            const expiresAtTime = typeof memRecord === 'object' ? memRecord.expiresAt : Infinity;

            if (Date.now() > expiresAtTime) {
                memOtp.delete(cleanEmail);
                return { success: false, message: 'Kode verifikasi sudah kadaluarsa. Silakan kirim ulang.' };
            }

            if (storedCode !== cleanOtp) {
                return { success: false, message: 'Kode verifikasi salah!' };
            }

            // Enkripsi password di memori juga dengan bcrypt
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            memUsers.set(cleanEmail, {
                email: cleanEmail,
                username: finalUsername,
                password: hash,
                name: finalUsername
            });
            memOtp.delete(cleanEmail);

            const token = createJwtToken({ id: 'mem-' + cleanEmail, email: cleanEmail, username: finalUsername });
            return {
                success: true,
                message: `Pendaftaran akun @${finalUsername} berhasil!`,
                token,
                user: {
                    id: 'mem-' + cleanEmail,
                    email: cleanEmail,
                    username: finalUsername,
                    name: finalUsername,
                    token,
                    createdAt: new Date().toISOString()
                }
            };
        },

        // Validasi kredensial dan proteksi brute-force sebelum membuat sesi.
        login: async (_, { email, password }, context) => {
            if (!email || !password) {
                return { success: false, message: 'Email/Username dan kata sandi wajib diisi!' };
            }
            const cleanIdentifier = email.trim();
            const clientIp = context?.clientIp || 'unknown';

            // 1. Cek proteksi Brute Force (Security Monitoring)
            const bruteCheck = checkLoginBruteForce(cleanIdentifier, clientIp);
            if (bruteCheck.isBlocked) {
                return { success: false, message: bruteCheck.message };
            }

            if (isDbConnected()) {
                const db = getDb();
                try {
                    // Cari pengguna berdasarkan email ATAU username
                    const [rows] = await db.execute(
                        'SELECT id, email, username, password, first_name, last_name FROM users WHERE email = ? OR username = ?',
                        [cleanIdentifier.toLowerCase(), cleanIdentifier]
                    );

                    if (rows.length === 0) {
                        recordLoginFailure(cleanIdentifier, clientIp);
                        return { success: false, message: 'Akun dengan email atau username ini belum terdaftar!' };
                    }

                    const user = rows[0];
                    let isMatch = false;
                    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                        isMatch = await bcrypt.compare(password, user.password);
                    } else {
                        isMatch = user.password === password;
                    }

                    if (!isMatch) {
                        recordLoginFailure(cleanIdentifier, clientIp);
                        return { success: false, message: 'Kata sandi salah!' };
                    }

                    const displayName = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0];
                    const token = createJwtToken({ id: user.id, email: user.email, username: user.username });
                    recordLoginSuccess(cleanIdentifier, clientIp, user.id);

                    return {
                        success: true,
                        message: 'Login berhasil!',
                        token,
                        user: {
                            id: String(user.id),
                            email: user.email,
                            username: user.username || user.email.split('@')[0],
                            name: displayName,
                            token
                        }
                    };
                } catch (err) {
                    return { success: false, message: `Database error: ${err.message}` };
                }
            }

            // Fallback memori
            let foundUser = null;
            for (const [, u] of memUsers.entries()) {
                if (u.email.toLowerCase() === cleanIdentifier.toLowerCase() || (u.username && u.username.toLowerCase() === cleanIdentifier.toLowerCase())) {
                    foundUser = u;
                    break;
                }
            }

            if (!foundUser) {
                recordLoginFailure(cleanIdentifier, clientIp);
                return { success: false, message: 'Akun tidak ditemukan!' };
            }

            let isMatch = false;
            if (foundUser.password.startsWith('$2a$') || foundUser.password.startsWith('$2b$')) {
                isMatch = await bcrypt.compare(password, foundUser.password);
            } else {
                isMatch = foundUser.password === password;
            }

            if (!isMatch) {
                recordLoginFailure(cleanIdentifier, clientIp);
                return { success: false, message: 'Kata sandi salah!' };
            }

            const token = createJwtToken({ id: 'mem-' + foundUser.email, email: foundUser.email, username: foundUser.username });
            recordLoginSuccess(cleanIdentifier, clientIp);

            return {
                success: true,
                message: 'Login berhasil!',
                token,
                user: {
                    id: 'mem-' + foundUser.email,
                    email: foundUser.email,
                    username: foundUser.username || foundUser.email.split('@')[0],
                    name: foundUser.username || foundUser.name,
                    token
                }
            };
        },

        // Kirim kode reset setelah memastikan akun dapat ditemukan.
        requestPasswordReset: async (_, { email }, context) => {
            if (!email || !email.trim()) {
                return { success: false, message: 'Alamat email atau username wajib diisi!' };
            }
            const cleanIdentifier = email.trim();
            const clientIp = context?.clientIp || 'unknown';

            // Cek pembatasan frekuensi pengiriman OTP reset
            const rateCheck = checkOtpRateLimit(cleanIdentifier, clientIp);
            if (!rateCheck.allowed) {
                return { success: false, message: rateCheck.message };
            }

            let targetEmail = '';

            // Cari target user
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT email FROM users WHERE email = ? OR username = ?',
                        [cleanIdentifier.toLowerCase(), cleanIdentifier]
                    );
                    if (rows.length === 0) {
                        return {
                            success: false,
                            message: 'Akun dengan email atau username tersebut tidak terdaftar di sistem!'
                        };
                    }
                    targetEmail = rows[0].email;
                } catch (err) {
                    console.warn('[DB Request Reset Error]', err.message);
                }
            } else {
                for (const [, u] of memUsers.entries()) {
                    if (u.email.toLowerCase() === cleanIdentifier.toLowerCase() || (u.username && u.username.toLowerCase() === cleanIdentifier.toLowerCase())) {
                        targetEmail = u.email;
                        break;
                    }
                }
                if (!targetEmail) {
                    return {
                        success: false,
                        message: 'Akun dengan email atau username tersebut tidak ditemukan!'
                    };
                }
            }

            // Generate kode OTP reset 6 digit
            const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 menit

            if (isDbConnected()) {
                const db = getDb();
                try {
                    await db.execute(
                        'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at)',
                        [targetEmail, otpCode, expiresAt]
                    );
                } catch (err) {
                    console.warn('[DB Save Reset OTP]', err.message);
                    memOtp.set(targetEmail, { code: otpCode, expiresAt: expiresAt.getTime() });
                }
            } else {
                memOtp.set(targetEmail, { code: otpCode, expiresAt: expiresAt.getTime() });
            }

            // Kirim email khusus reset password
            const emailRes = await sendPasswordResetEmail(targetEmail, otpCode);

            return {
                success: emailRes.success,
                message: emailRes.success
                    ? `Kode reset kata sandi telah dikirim ke ${targetEmail}. Silakan cek kotak masuk atau folder spam.`
                    : emailRes.message
            };
        },

        // Ganti kata sandi hanya jika kode reset masih valid.
        resetPassword: async (_, { email, otp, newPassword }) => {
            if (!email || !otp || !newPassword) {
                return { success: false, message: 'Semua kolom wajib diisi lengkap!' };
            }

            if (newPassword.length < 6) {
                return { success: false, message: 'Kata sandi baru minimal 6 karakter!' };
            }

            const cleanIdentifier = email.trim();
            const cleanOtp = otp.trim();
            let targetEmail = '';

            // 1. Temukan target user
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT email FROM users WHERE email = ? OR username = ?',
                        [cleanIdentifier.toLowerCase(), cleanIdentifier]
                    );
                    if (rows.length === 0) {
                        return { success: false, message: 'Akun tidak ditemukan!' };
                    }
                    targetEmail = rows[0].email;

                    // 2. Verifikasi OTP dari database
                    const [otpRows] = await db.execute(
                        'SELECT otp_code, expires_at FROM otp_verifications WHERE email = ?',
                        [targetEmail]
                    );

                    if (otpRows.length === 0) {
                        return { success: false, message: 'Kode reset belum diminta atau sudah tidak berlaku. Silakan kirim ulang.' };
                    }

                    const record = otpRows[0];
                    if (new Date(record.expires_at) < new Date()) {
                        await db.execute('DELETE FROM otp_verifications WHERE email = ?', [targetEmail]);
                        return { success: false, message: 'Kode reset sudah kadaluarsa. Silakan minta kode baru.' };
                    }

                    if (record.otp_code !== cleanOtp) {
                        return { success: false, message: 'Kode verifikasi reset salah!' };
                    }

                    // 3. Hash password baru dengan bcrypt
                    const salt = await bcrypt.genSalt(10);
                    const hash = await bcrypt.hash(newPassword, salt);

                    // 4. Update password di database
                    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hash, targetEmail]);

                    // 5. Hapus OTP yang sudah dipakai
                    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [targetEmail]);

                    return {
                        success: true,
                        message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.'
                    };
                } catch (err) {
                    console.warn('[DB Reset Password Error]', err.message);
                    return { success: false, message: 'Gagal mereset kata sandi: ' + err.message };
                }
            }

            // Fallback memori
            for (const [, u] of memUsers.entries()) {
                if (u.email.toLowerCase() === cleanIdentifier.toLowerCase() || (u.username && u.username.toLowerCase() === cleanIdentifier.toLowerCase())) {
                    targetEmail = u.email;
                    break;
                }
            }

            if (!targetEmail) {
                return { success: false, message: 'Akun tidak ditemukan!' };
            }

            const memRecord = memOtp.get(targetEmail);
            if (!memRecord) {
                return { success: false, message: 'Kode reset belum diminta atau sudah kadaluarsa.' };
            }

            const storedCode = typeof memRecord === 'object' ? memRecord.code : memRecord;
            const expiresAtTime = typeof memRecord === 'object' ? memRecord.expiresAt : Infinity;

            if (Date.now() > expiresAtTime) {
                memOtp.delete(targetEmail);
                return { success: false, message: 'Kode reset sudah kadaluarsa.' };
            }

            if (storedCode !== cleanOtp) {
                return { success: false, message: 'Kode verifikasi reset salah!' };
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newPassword, salt);

            const userToUpdate = memUsers.get(targetEmail);
            if (userToUpdate) {
                userToUpdate.password = hash;
            }
            memOtp.delete(targetEmail);

            return {
                success: true,
                message: 'Kata sandi berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.'
            };
        }
    }
};
