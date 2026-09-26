import { getDb, isDbConnected } from '../config/db.js';

// In-memory brute force & abuse tracking maps
const failedLoginAttempts = new Map(); // key: identifier, value: { count, lastAttempt, blockedUntil }
const otpRequestAttempts = new Map(); // key: email, value: { count, windowStart }
const ipTracker = new Map(); // key: ip, value: { count, windowStart }

const MAX_LOGIN_ATTEMPTS = 5;
const MAX_IP_LOGIN_ATTEMPTS = 15; // Batas maksimal kegagalan dari 1 alamat IP lintas akun
const LOGIN_BLOCK_DURATION_MS = 15 * 60 * 1000; // 15 menit
const MAX_OTP_PER_10_MIN = 3;
const MAX_OTP_PER_IP_10_MIN = 5; // Batas maksimal pengiriman OTP per IP
const OTP_WINDOW_MS = 10 * 60 * 1000; // 10 menit

/**
 * Catat audit keamanan ke konsol dan database
 */
// Simpan audit keamanan ke database dan gunakan log server bila gagal.
export async function logSecurityEvent({ eventType, severity = 'INFO', identifier = null, ip = null, details = null, userId = null }) {
    const timestamp = new Date().toISOString();
    const icon = severity === 'ALERT' ? '🚨' : severity === 'WARN' ? '⚠️' : '🛡️';
    
    console.log(`${icon} [SECURITY ${severity}] [${timestamp}] Event: ${eventType} | Target: ${identifier || 'N/A'} | IP: ${ip || 'Unknown'} | Detail: ${details || '-'}`);

    if (isDbConnected()) {
        try {
            const db = getDb();
            const actionText = `[SEC_${severity}] ${eventType}`;
            const detailText = JSON.stringify({ identifier, ip, details, timestamp });
            await db.execute(
                'INSERT INTO user_activity_logs (user_id, action, details) VALUES (?, ?, ?)',
                [userId ? parseInt(userId, 10) : null, actionText, detailText]
            );
        } catch (err) {
            console.warn('⚠️ [SecurityLogger DB Error]:', err.message);
        }
    }
}

/**
 * Cek apakah akun atau IP sedang diblokir karena brute-force login
 */
// Periksa apakah identitas akun ATAU alamat IP masih berada dalam masa blokir.
export function checkLoginBruteForce(identifier, ip = 'unknown') {
    // 1. Cek pemblokiran di tingkat Alamat IP
    if (ip && ip !== 'unknown') {
        const ipKey = `ip:${ip}`;
        const ipRecord = failedLoginAttempts.get(ipKey);
        if (ipRecord?.blockedUntil && Date.now() < ipRecord.blockedUntil) {
            const remainingMinutes = Math.ceil((ipRecord.blockedUntil - Date.now()) / (60 * 1000));
            return {
                isBlocked: true,
                remainingMinutes,
                message: `Alamat IP Anda diblokir sementara karena ${ipRecord.count}x gagal login. Coba lagi dalam ${remainingMinutes} menit demi keamanan.`
            };
        }
        if (ipRecord?.blockedUntil && Date.now() >= ipRecord.blockedUntil) {
            failedLoginAttempts.delete(ipKey);
        }
    }

    // 2. Cek pemblokiran di tingkat Akun (Email/Username)
    const key = (identifier || '').toLowerCase().trim();
    if (!key) return { isBlocked: false };

    const record = failedLoginAttempts.get(key);
    if (!record) return { isBlocked: false };

    // Cek apakah masa blokir masih aktif
    if (record.blockedUntil && Date.now() < record.blockedUntil) {
        const remainingMinutes = Math.ceil((record.blockedUntil - Date.now()) / (60 * 1000));
        return {
            isBlocked: true,
            remainingMinutes,
            message: `Akun ini terkunci sementara karena ${record.count}x gagal login berturut-turut. Coba lagi dalam ${remainingMinutes} menit demi keamanan Anda.`
        };
    }

    // Jika masa blokir sudah lewat, reset counter
    if (record.blockedUntil && Date.now() >= record.blockedUntil) {
        failedLoginAttempts.delete(key);
    }

    return { isBlocked: false, currentAttempts: record.count };
}

/**
 * Catat kegagalan login dan picu blokir jika melebihi batas
 */
// Catat kegagalan login pada akun dan IP, lalu blokir sementara setelah batas terlampaui.
export function recordLoginFailure(identifier, ip = 'unknown') {
    const key = (identifier || '').toLowerCase().trim();
    if (key) {
        const record = failedLoginAttempts.get(key) || { count: 0, lastAttempt: Date.now(), blockedUntil: null };
        record.count += 1;
        record.lastAttempt = Date.now();

        if (record.count >= MAX_LOGIN_ATTEMPTS) {
            record.blockedUntil = Date.now() + LOGIN_BLOCK_DURATION_MS;
            logSecurityEvent({
                eventType: 'BRUTE_FORCE_TRIGGERED',
                severity: 'ALERT',
                identifier: key,
                ip,
                details: `Akun diblokir sementara selama 15 menit setelah ${record.count} kali kegagalan login berturut-turut.`
            });
        } else {
            logSecurityEvent({
                eventType: 'LOGIN_FAILURE',
                severity: 'WARN',
                identifier: key,
                ip,
                details: `Percobaan login akun gagal (${record.count}/${MAX_LOGIN_ATTEMPTS}).`
            });
        }

        failedLoginAttempts.set(key, record);
    }

    // Catat juga pada tingkat Alamat IP untuk menangkal dictionary attack lintas akun
    if (ip && ip !== 'unknown') {
        const ipKey = `ip:${ip}`;
        const ipRecord = failedLoginAttempts.get(ipKey) || { count: 0, lastAttempt: Date.now(), blockedUntil: null };
        ipRecord.count += 1;
        ipRecord.lastAttempt = Date.now();

        if (ipRecord.count >= MAX_IP_LOGIN_ATTEMPTS) {
            ipRecord.blockedUntil = Date.now() + LOGIN_BLOCK_DURATION_MS;
            logSecurityEvent({
                eventType: 'IP_BRUTE_FORCE_TRIGGERED',
                severity: 'ALERT',
                identifier: ipKey,
                ip,
                details: `Alamat IP diblokir sementara selama 15 menit setelah ${ipRecord.count} kali kegagalan login lintas akun.`
            });
        } else {
            logSecurityEvent({
                eventType: 'IP_LOGIN_FAILURE',
                severity: 'WARN',
                identifier: ipKey,
                ip,
                details: `Kegagalan login dari IP ini (${ipRecord.count}/${MAX_IP_LOGIN_ATTEMPTS}).`
            });
        }
        failedLoginAttempts.set(ipKey, ipRecord);
    }
}

/**
 * Reset catatan kegagalan saat login berhasil
 */
// Hapus hitungan gagal setelah login sukses dan catat peristiwanya.
export function recordLoginSuccess(identifier, ip = 'unknown', userId = null) {
    const key = (identifier || '').toLowerCase().trim();
    if (key) {
        failedLoginAttempts.delete(key);
    }
    if (ip && ip !== 'unknown') {
        failedLoginAttempts.delete(`ip:${ip}`);
    }
    logSecurityEvent({
        eventType: 'LOGIN_SUCCESS',
        severity: 'INFO',
        identifier: key,
        ip,
        details: 'Login pengguna terverifikasi berhasil.',
        userId
    });
}

/**
 * Batasi frekuensi permohonan OTP untuk mencegah email bombing / resource exhaustion
 */
// Batasi pengiriman OTP per email dan per IP dalam satu jendela waktu.
export function checkOtpRateLimit(email, ip = 'unknown') {
    const key = (email || '').toLowerCase().trim();
    const now = Date.now();

    // 1. Cek pembatasan per alamat IP (mencegah penyerang memakai banyak email dari IP yang sama)
    if (ip && ip !== 'unknown') {
        const ipKey = `ip:${ip}`;
        const ipRec = ipTracker.get(ipKey);
        if (!ipRec || (now - ipRec.windowStart) > OTP_WINDOW_MS) {
            ipTracker.set(ipKey, { count: 1, windowStart: now });
        } else if (ipRec.count >= MAX_OTP_PER_IP_10_MIN) {
            logSecurityEvent({
                eventType: 'IP_OTP_LIMIT_EXCEEDED',
                severity: 'WARN',
                identifier: ipKey,
                ip,
                details: `Pengiriman OTP ditolak. Kuota ${MAX_OTP_PER_IP_10_MIN}x per 10 menit dari IP ini terlampaui.`
            });
            return {
                allowed: false,
                message: 'Terlalu banyak permintaan OTP dari jaringan Anda. Silakan coba lagi setelah beberapa menit.'
            };
        } else {
            ipRec.count += 1;
            ipTracker.set(ipKey, ipRec);
        }
    }

    // 2. Cek pembatasan per email
    const record = otpRequestAttempts.get(key);
    if (!record || (now - record.windowStart) > OTP_WINDOW_MS) {
        otpRequestAttempts.set(key, { count: 1, windowStart: now });
        return { allowed: true };
    }

    if (record.count >= MAX_OTP_PER_10_MIN) {
        const remainingMinutes = Math.ceil((OTP_WINDOW_MS - (now - record.windowStart)) / (60 * 1000));
        logSecurityEvent({
            eventType: 'OTP_RATE_LIMIT_EXCEEDED',
            severity: 'WARN',
            identifier: key,
            ip,
            details: `Pengiriman OTP ditolak. Kuota 3x per 10 menit terlampaui.`
        });
        return {
            allowed: false,
            message: `Permintaan OTP terlalu sering. Silakan tunggu ${remainingMinutes} menit lagi sebelum meminta kode baru.`
        };
    }

    record.count += 1;
    otpRequestAttempts.set(key, record);
    return { allowed: true };
}
