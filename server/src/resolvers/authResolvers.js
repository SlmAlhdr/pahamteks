import { getDb, isDbConnected } from '../config/db.js';
import { sendOtpEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import {
    createAccessToken,
    isAdminEmail,
    requireAuthenticatedUser,
    requireAdmin,
    verifyAdminPassword,
    hashPassword,
    verifyPassword,
    createOtpSignature,
    verifyOtpSignature
} from '../utils/auth.js';
import {
    checkLoginBruteForce,
    recordLoginFailure,
    recordLoginSuccess,
    checkOtpRateLimit,
    logSecurityEvent
} from '../utils/securityLogger.js';

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
        // Profil selalu ditentukan dari identitas token, bukan argumen klien.
        me: async (_, __, context) => {
            const currentUser = requireAuthenticatedUser(context);
            // Email berasal dari token yang ditandatangani server, bukan variabel query dari browser.
            const cleanIdentifier = currentUser.email;

            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT id, email, username, first_name, last_name, created_at FROM users WHERE email = ?',
                        [cleanIdentifier]
                    );
                    if (rows.length > 0) {
                        const u = rows[0];
                        const displayName = u.username || `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.email.split('@')[0];
                        return {
                            id: String(u.id),
                            email: u.email,
                            username: u.username || u.email.split('@')[0],
                            name: displayName,
                            role: currentUser.role,
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
                        role: currentUser.role,
                        createdAt: new Date().toISOString()
                    };
                }
            }

            return null;
        },

        // Ambil daftar seluruh pengguna terdaftar (khusus admin terverifikasi)
        adminUsers: async (_, { limit = 100 }, context) => {
            // Perlindungan ganda di tingkat resolver
            requireAdmin(context);
            const safeLimit = Math.min(500, Math.max(1, Number.isInteger(limit) ? limit : 100));

            const userList = [];
            const seenEmails = new Set();

            if (isDbConnected()) {
                const db = getDb();
                try {
                    // Password SAMA SEKALI TIDAK DIAMBIL untuk menjaga keamanan 100%
                    const [rows] = await db.execute(
                        'SELECT id, email, username, first_name, last_name, created_at FROM users ORDER BY created_at DESC LIMIT ?',
                        [safeLimit]
                    );
                    for (const u of rows) {
                        const cleanEmail = (u.email || '').toLowerCase().trim();
                        seenEmails.add(cleanEmail);
                        const displayName = u.username || `${u.first_name || ''} ${u.last_name || ''}`.trim() || cleanEmail.split('@')[0];
                        userList.push({
                            id: String(u.id),
                            email: cleanEmail,
                            username: u.username || cleanEmail.split('@')[0],
                            name: displayName,
                            role: isAdminEmail(cleanEmail) ? 'ADMIN' : 'USER',
                            createdAt: u.created_at ? new Date(u.created_at).toISOString() : null
                        });
                    }
                } catch (err) {
                    console.warn('[AdminUsers Query DB Error]', err.message);
                }
            }

            // Gabungkan pengguna di memori jika ada akun lokal yang belum tersimpan di DB
            for (const [, u] of memUsers.entries()) {
                const cleanEmail = (u.email || '').toLowerCase().trim();
                if (!seenEmails.has(cleanEmail) && userList.length < safeLimit) {
                    seenEmails.add(cleanEmail);
                    userList.push({
                        id: 'mem-' + cleanEmail,
                        email: cleanEmail,
                        username: u.username || cleanEmail.split('@')[0],
                        name: u.username || u.name || cleanEmail.split('@')[0],
                        role: isAdminEmail(cleanEmail) ? 'ADMIN' : 'USER',
                        createdAt: new Date().toISOString()
                    });
                }
            }

            return userList;
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

            try {
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
                        if (existing && existing.length > 0) {
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
                const otpSignature = createOtpSignature(cleanEmail, otpCode, expiresAt);

                // 3. Simpan OTP di database dan memori sebagai cadangan
                memOtp.set(cleanEmail, { code: otpCode, expiresAt: expiresAt.getTime(), signature: otpSignature });

                if (isDbConnected()) {
                    const db = getDb();
                    try {
                        await db.execute(
                            'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at)',
                            [cleanEmail, otpCode, expiresAt]
                        );
                    } catch (err) {
                        console.warn('[DB Save OTP]', err.message);
                    }
                }

                // 4. Kirim email nyata ke alamat email tujuan
                const emailResult = await sendOtpEmail(cleanEmail, otpCode);

                return {
                    success: emailResult.success,
                    message: emailResult.message,
                    otpSignature: emailResult.success ? otpSignature : null
                };
            } catch (unhandledErr) {
                console.error('[sendOtp Resolver Error]:', unhandledErr);
                return {
                    success: false,
                    message: `Gagal memproses permohonan OTP: ${unhandledErr.message}`
                };
            }
        },

        // Verifikasi OTP (DB/Memory/HMAC), enkripsi password dengan Bcrypt, simpan akun, buat sesi.
        register: async (_, { email, password, username, fname, lname, otp, otpSignature }, context) => {
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

            // 1. Validasi Kode OTP: Cek Database, Memory, atau Stateless HMAC Signature
            let isOtpValid = false;
            let otpErrorMsg = '';

            // Cek di Database
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT otp_code, expires_at FROM otp_verifications WHERE email = ?',
                        [cleanEmail]
                    );
                    if (rows && rows.length > 0) {
                        const rec = rows[0];
                        if (new Date(rec.expires_at) < new Date()) {
                            otpErrorMsg = 'Kode verifikasi sudah kadaluarsa. Silakan kirim ulang kode baru.';
                        } else if (rec.otp_code === cleanOtp) {
                            isOtpValid = true;
                        } else {
                            otpErrorMsg = 'Kode verifikasi salah! Periksa kembali email Anda.';
                        }
                    }
                } catch (err) {
                    console.warn('[DB Fetch Register OTP]', err.message);
                }
            }

            // Cek di Memory lokal jika belum valid
            if (!isOtpValid && memOtp.has(cleanEmail)) {
                const memRecord = memOtp.get(cleanEmail);
                const storedCode = typeof memRecord === 'object' ? memRecord.code : memRecord;
                const expiresAtTime = typeof memRecord === 'object' ? memRecord.expiresAt : Infinity;

                if (Date.now() > expiresAtTime) {
                    otpErrorMsg = 'Kode verifikasi sudah kadaluarsa. Silakan kirim ulang.';
                } else if (storedCode === cleanOtp) {
                    isOtpValid = true;
                } else {
                    otpErrorMsg = 'Kode verifikasi salah! Periksa kembali email Anda.';
                }
            }

            // Cek Stateless HMAC signature (solusi ampuh untuk multi-instance serverless Vercel)
            if (!isOtpValid && otpSignature) {
                if (verifyOtpSignature(cleanEmail, cleanOtp, otpSignature)) {
                    isOtpValid = true;
                } else {
                    otpErrorMsg = 'Kode verifikasi salah atau sudah kadaluarsa. Silakan kirim ulang.';
                }
            }

            if (!isOtpValid) {
                return {
                    success: false,
                    message: otpErrorMsg || 'Kode verifikasi belum dikirim atau sudah kadaluarsa. Silakan kirim ulang.'
                };
            }

            // 2. Enkripsi kata sandi kuat menggunakan sistem Bcrypt (Salt 10)
            const hash = await hashPassword(password);

            // 3. Simpan akun ke Database (MySQL / fallback)
            let userId = null;
            if (isDbConnected()) {
                const db = getDb();
                try {
                    // Validasi apakah username sudah digunakan
                    const [existingUser] = await db.execute('SELECT id FROM users WHERE username = ?', [finalUsername]);
                    if (existingUser && existingUser.length > 0) {
                        return { success: false, message: `Username "${finalUsername}" sudah digunakan. Silakan pilih username lain!` };
                    }

                    // Validasi apakah email sudah terdaftar
                    const [existingEmail] = await db.execute('SELECT id FROM users WHERE email = ?', [cleanEmail]);
                    if (existingEmail && existingEmail.length > 0) {
                        return { success: false, message: 'Email ini sudah terdaftar! Silakan langsung masuk.' };
                    }

                    const [res] = await db.execute(
                        'INSERT INTO users (email, username, password, first_name, last_name) VALUES (?, ?, ?, ?, ?)',
                        [cleanEmail, finalUsername, hash, finalUsername, (lname || '').trim()]
                    );
                    userId = res.insertId;

                    // Hapus OTP setelah berhasil digunakan
                    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [cleanEmail]).catch(() => {});
                } catch (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return { success: false, message: 'Email atau username ini sudah terdaftar!' };
                    }
                    console.warn('[DB Register Error]', err.message);
                }
            }

            // Simpan juga di fallback memori agar sesi lokal instan
            memUsers.set(cleanEmail, {
                id: userId || 'mem-' + cleanEmail,
                email: cleanEmail,
                username: finalUsername,
                password: hash,
                name: finalUsername,
                created_at: new Date().toISOString()
            });
            memOtp.delete(cleanEmail);

            const finalId = userId ? String(userId) : 'mem-' + cleanEmail;
            const token = createAccessToken({ id: finalId, email: cleanEmail, username: finalUsername });

            logSecurityEvent({
                eventType: 'USER_REGISTERED',
                severity: 'INFO',
                identifier: cleanEmail,
                ip: context?.clientIp,
                details: `Pengguna baru @${finalUsername} berhasil didaftarkan dengan kata sandi terenkripsi.`,
                userId: finalId
            });

            return {
                success: true,
                message: `Pendaftaran akun @${finalUsername} berhasil! Selamat datang di PahamTeks.`,
                token,
                user: {
                    id: finalId,
                    email: cleanEmail,
                    username: finalUsername,
                    name: finalUsername,
                    role: 'USER',
                    token,
                    createdAt: new Date().toISOString()
                }
            };
        },

        // Opsi B: Admin login cukup menggunakan email allowlist dan kata sandi akun pribadi.
        adminLogin: async (_, { email, password }, context) => {
            if (!email || !password) {
                return { success: false, message: 'Email admin dan kata sandi akun wajib diisi!' };
            }

            const cleanEmail = email.trim().toLowerCase();
            const clientIp = context?.clientIp || 'unknown';
            const bruteCheck = checkLoginBruteForce(cleanEmail, clientIp);
            if (bruteCheck.isBlocked) {
                return { success: false, message: bruteCheck.message };
            }

            // Validasi apakah email terdaftar dalam allowlist ADMIN_EMAILS
            if (!isAdminEmail(cleanEmail)) {
                recordLoginFailure(cleanEmail, clientIp);
                return { success: false, message: 'Email Anda belum terdaftar sebagai administrator di sistem.' };
            }

            let account = null;
            try {
                // Adapter getDb memilih MySQL atau SQLite fallback tanpa mempercayai input klien.
                const db = getDb();
                const [rows] = await db.execute(
                    'SELECT id, email, username, password, first_name, last_name FROM users WHERE email = ?',
                    [cleanEmail]
                );
                account = rows[0] || null;
            } catch (err) {
                console.warn('[Admin Login DB Error]', err.message);
            }
            account ||= memUsers.get(cleanEmail) || null;

            if (!account) {
                recordLoginFailure(cleanEmail, clientIp);
                return { success: false, message: 'Akun dengan email ini belum terdaftar. Silakan lakukan registrasi terlebih dahulu.' };
            }

            let accountPasswordValid = await verifyPassword(password, account.password);

            if (!accountPasswordValid) {
                recordLoginFailure(cleanEmail, clientIp);
                logSecurityEvent({
                    eventType: 'ADMIN_LOGIN_FAILED',
                    severity: 'WARNING',
                    identifier: cleanEmail,
                    ip: clientIp,
                    details: 'Percobaan login admin gagal: kata sandi salah.'
                });
                return { success: false, message: 'Kata sandi akun salah!' };
            }

            // Migrasi otomatis password plaintext ke Bcrypt hash jika ditemukan
            if (account.password === password) {
                hashPassword(password).then(h => {
                    const db = getDb();
                    db.execute('UPDATE users SET password = ? WHERE email = ?', [h, cleanEmail]).catch(() => {});
                }).catch(() => {});
            }

            const displayName = account.username || `${account.first_name || ''} ${account.last_name || ''}`.trim() || cleanEmail.split('@')[0];
            const token = createAccessToken(
                { id: account.id || `mem-${cleanEmail}`, email: cleanEmail, username: account.username },
                { adminSession: true }
            );
            recordLoginSuccess(cleanEmail, clientIp, account.id);

            logSecurityEvent({
                eventType: 'ADMIN_LOGIN_SUCCESS',
                severity: 'INFO',
                identifier: cleanEmail,
                ip: clientIp,
                details: `Administrator @${displayName} (${cleanEmail}) berhasil login.`
            });

            return {
                success: true,
                message: 'Login administrator berhasil.',
                token,
                user: {
                    id: String(account.id || `mem-${cleanEmail}`),
                    email: cleanEmail,
                    username: account.username || cleanEmail.split('@')[0],
                    name: displayName,
                    role: 'ADMIN',
                    token
                }
            };
        },

        // Validasi kredensial dan proteksi brute-force sebelum membuat sesi pengguna.
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
                    const isMatch = await verifyPassword(password, user.password);

                    if (!isMatch) {
                        recordLoginFailure(cleanIdentifier, clientIp);
                        return { success: false, message: 'Kata sandi salah!' };
                    }

                    // Migrasi otomatis plaintext ke Bcrypt hash jika terdeteksi
                    if (user.password === password) {
                        hashPassword(password).then(h => {
                            db.execute('UPDATE users SET password = ? WHERE id = ?', [h, user.id]).catch(() => {});
                        }).catch(() => {});
                    }

                    const isAdmin = isAdminEmail(user.email);
                    const displayName = user.username || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email.split('@')[0];
                    const token = createAccessToken(
                        { id: user.id, email: user.email, username: user.username },
                        { adminSession: isAdmin }
                    );
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
                            role: isAdmin ? 'ADMIN' : 'USER',
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

            const isMatch = await verifyPassword(password, foundUser.password);

            if (!isMatch) {
                recordLoginFailure(cleanIdentifier, clientIp);
                return { success: false, message: 'Kata sandi salah!' };
            }

            if (foundUser.password === password) {
                hashPassword(password).then(h => {
                    foundUser.password = h;
                }).catch(() => {});
            }

            const isAdmin = isAdminEmail(foundUser.email);
            const token = createAccessToken(
                { id: 'mem-' + foundUser.email, email: foundUser.email, username: foundUser.username },
                { adminSession: isAdmin }
            );
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
                    role: isAdmin ? 'ADMIN' : 'USER',
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
            const otpSignature = createOtpSignature(targetEmail, otpCode, expiresAt);

            // Simpan ke memori dan database sebagai cadangan
            memOtp.set(targetEmail, { code: otpCode, expiresAt: expiresAt.getTime(), signature: otpSignature });

            if (isDbConnected()) {
                const db = getDb();
                try {
                    await db.execute(
                        'INSERT INTO otp_verifications (email, otp_code, expires_at) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE otp_code = VALUES(otp_code), expires_at = VALUES(expires_at)',
                        [targetEmail, otpCode, expiresAt]
                    );
                } catch (err) {
                    console.warn('[DB Save Reset OTP]', err.message);
                }
            }

            // Kirim email khusus reset password
            const emailRes = await sendPasswordResetEmail(targetEmail, otpCode);

            return {
                success: emailRes.success,
                message: emailRes.success
                    ? `Kode reset kata sandi telah dikirim ke ${targetEmail}. Silakan cek kotak masuk atau folder spam.`
                    : emailRes.message,
                otpSignature: emailRes.success ? otpSignature : null
            };
        },

        // Ganti kata sandi dengan verifikasi kode reset (DB/Memory/HMAC) dan enkripsi Bcrypt.
        resetPassword: async (_, { email, otp, newPassword, otpSignature }) => {
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
                    if (rows && rows.length > 0) {
                        targetEmail = rows[0].email;
                    }
                } catch (err) {
                    console.warn('[DB Find Reset User Error]', err.message);
                }
            }

            if (!targetEmail) {
                for (const [, u] of memUsers.entries()) {
                    if (u.email.toLowerCase() === cleanIdentifier.toLowerCase() || (u.username && u.username.toLowerCase() === cleanIdentifier.toLowerCase())) {
                        targetEmail = u.email;
                        break;
                    }
                }
            }

            if (!targetEmail) {
                // Jika identifier berformat email, gunakan langsung
                if (cleanIdentifier.includes('@')) {
                    targetEmail = cleanIdentifier.toLowerCase();
                } else {
                    return { success: false, message: 'Akun dengan email atau username ini tidak ditemukan!' };
                }
            }

            // 2. Verifikasi OTP dari database, memori, atau stateless HMAC
            let isOtpValid = false;
            let otpErrorMsg = '';

            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [dbOtp] = await db.execute(
                        'SELECT otp_code, expires_at FROM otp_verifications WHERE email = ?',
                        [targetEmail]
                    );
                    if (dbOtp && dbOtp.length > 0) {
                        const rec = dbOtp[0];
                        if (new Date(rec.expires_at) < new Date()) {
                            otpErrorMsg = 'Kode reset sudah kadaluarsa. Silakan minta kode baru.';
                        } else if (rec.otp_code === cleanOtp) {
                            isOtpValid = true;
                        } else {
                            otpErrorMsg = 'Kode verifikasi reset salah!';
                        }
                    }
                } catch (err) {
                    console.warn('[DB Fetch Reset OTP]', err.message);
                }
            }

            if (!isOtpValid && memOtp.has(targetEmail)) {
                const memRecord = memOtp.get(targetEmail);
                const storedCode = typeof memRecord === 'object' ? memRecord.code : memRecord;
                const expiresAtTime = typeof memRecord === 'object' ? memRecord.expiresAt : Infinity;

                if (Date.now() > expiresAtTime) {
                    otpErrorMsg = 'Kode reset sudah kadaluarsa. Silakan minta kode baru.';
                } else if (storedCode === cleanOtp) {
                    isOtpValid = true;
                } else {
                    otpErrorMsg = 'Kode verifikasi reset salah!';
                }
            }

            // Stateless HMAC verification (Vercel Serverless multi-instance)
            if (!isOtpValid && otpSignature) {
                if (verifyOtpSignature(targetEmail, cleanOtp, otpSignature)) {
                    isOtpValid = true;
                } else {
                    otpErrorMsg = 'Kode reset salah atau sudah kadaluarsa!';
                }
            }

            if (!isOtpValid) {
                return {
                    success: false,
                    message: otpErrorMsg || 'Kode reset belum diminta atau sudah tidak berlaku. Silakan kirim ulang.'
                };
            }

            // 3. Hash password baru dengan enkripsi Bcrypt
            const hash = await hashPassword(newPassword);

            // 4. Update password di database & memori
            if (isDbConnected()) {
                const db = getDb();
                try {
                    await db.execute('UPDATE users SET password = ? WHERE email = ?', [hash, targetEmail]);
                    await db.execute('DELETE FROM otp_verifications WHERE email = ?', [targetEmail]).catch(() => {});
                } catch (err) {
                    console.warn('[DB Reset Password Error]', err.message);
                }
            }

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
