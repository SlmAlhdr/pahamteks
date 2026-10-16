import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const JWT_ISSUER = 'pahamteks-api';
const JWT_AUDIENCE = 'pahamteks-client';

const LOCAL_DEVELOPMENT_SECRET = 'pahamteks-local-development-secret-only-32-chars';
const BCRYPT_SALT_ROUNDS = 10;

/**
 * Mengenkripsi kata sandi pengguna secara kuat menggunakan algoritma Bcrypt (Salt 10 rounds).
 * Mencegah kebocoran plaintext password dan tahan terhadap serangan rainbow table.
 */
export async function hashPassword(plainPassword) {
    if (!plainPassword || typeof plainPassword !== 'string') {
        throw new Error('Kata sandi tidak valid untuk dienkripsi.');
    }
    const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
    return bcrypt.hash(plainPassword, salt);
}

/**
 * Memverifikasi kecocokan kata sandi dengan hash Bcrypt ($2a$, $2b$, $2y$).
 * Jika hash berupa plaintext lama, verifikasi tetap didukung untuk migrasi otomatis.
 */
export async function verifyPassword(plainPassword, storedHash) {
    if (!plainPassword || !storedHash) return false;
    try {
        if (typeof storedHash === 'string' && (storedHash.startsWith('$2a$') || storedHash.startsWith('$2b$') || storedHash.startsWith('$2y$'))) {
            return await bcrypt.compare(plainPassword, storedHash);
        }
        return plainPassword === storedHash;
    } catch (err) {
        console.warn('⚠️ [Password Verify Error]', err.message);
        return false;
    }
}

/**
 * Menghasilkan cryptographic signature stateless untuk verifikasi OTP pada lingkungan serverless.
 * Format token: `${expiresAt}.${hmac}`
 * Memungkinkan verifikasi kode verifikasi pada container Vercel berbeda tanpa shared in-memory state.
 */
export function createOtpSignature(email, otpCode, expiresAt) {
    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanOtp = String(otpCode || '').trim();
    const expiryMs = typeof expiresAt === 'number' ? expiresAt : new Date(expiresAt).getTime();
    const dataToSign = `${cleanEmail}:${cleanOtp}:${expiryMs}`;
    const hmac = createHmac('sha256', getJwtSecret()).update(dataToSign).digest('hex');
    return `${expiryMs}.${hmac}`;
}

/**
 * Memvalidasi cryptographic signature stateless OTP.
 * Memeriksa tanda tangan server dan masa aktif kode (10 menit).
 */
export function verifyOtpSignature(email, otpCode, signature) {
    if (!signature || typeof signature !== 'string') return false;
    const parts = signature.split('.');
    if (parts.length !== 2) return false;

    const [expiryStr, expectedHmac] = parts;
    const expiryMs = parseInt(expiryStr, 10);
    if (isNaN(expiryMs) || Date.now() > expiryMs) {
        return false; // Kadaluarsa
    }

    const cleanEmail = String(email || '').trim().toLowerCase();
    const cleanOtp = String(otpCode || '').trim();
    const dataToSign = `${cleanEmail}:${cleanOtp}:${expiryMs}`;
    const actualHmac = createHmac('sha256', getJwtSecret()).update(dataToSign).digest('hex');

    try {
        const actualBuf = Buffer.from(actualHmac, 'utf8');
        const expectedBuf = Buffer.from(expectedHmac, 'utf8');
        return actualBuf.length === expectedBuf.length && timingSafeEqual(actualBuf, expectedBuf);
    } catch {
        return false;
    }
}

function getJwtSecret() {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret || secret.length < 32) {
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            throw new Error('JWT_SECRET must be configured with at least 32 characters in production.');
        }
        console.warn('⚠️ [JWT WARN] JWT_SECRET belum disetel. Secret lokal development sementara digunakan.');
        return LOCAL_DEVELOPMENT_SECRET;
    }
    return secret;
}

export function assertJwtSecretConfigured() {
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret || secret.length < 32) {
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
            throw new Error('JWT_SECRET must be configured with at least 32 characters in production.');
        }
        console.warn('⚠️ [AUTH CONFIG] JWT_SECRET belum disetel untuk development lokal.');
    }
}

export function isAdminEmail(email) {
    // Allowlist menetapkan siapa yang boleh mencoba admin; sesi harus membuktikan password tambahan.
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(value => value.trim().toLowerCase())
        .filter(Boolean);

    return adminEmails.includes(normalizedEmail);
}

export function verifyAdminPassword(candidate) {
    const expected = process.env.ADMIN_PASSWORD || '';
    if (typeof candidate !== 'string' || expected.trim().length < 16) return false;

    const candidateBytes = Buffer.from(candidate, 'utf8');
    const expectedBytes = Buffer.from(expected, 'utf8');
    return candidateBytes.length === expectedBytes.length && timingSafeEqual(candidateBytes, expectedBytes);
}

function getAdminPasswordFingerprint() {
    // Perubahan password admin otomatis menonaktifkan token admin yang diterbitkan sebelumnya.
    const password = process.env.ADMIN_PASSWORD || '';
    if (password.trim().length < 16) return '';
    return createHash('sha256').update(password, 'utf8').digest('hex');
}

export function createAccessToken(user, { adminSession = false } = {}) {
    const email = String(user.email || '').trim().toLowerCase();
    const id = String(user.id || '');
    if (!email || !id) throw new Error('Cannot issue a session token without a user ID and email.');

    // Klaim adminSession dibuat untuk user admin terdaftar.
    return jwt.sign(
        {
            email,
            username: user.username || null,
            adminSession: Boolean(adminSession)
        },
        getJwtSecret(),
        {
            algorithm: 'HS256',
            subject: id,
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
            expiresIn: '7d'
        }
    );
}

export function authenticateRequest(authorizationHeader) {
    // Request tanpa Bearer token valid diperlakukan sebagai pengunjung anonim.
    if (typeof authorizationHeader !== 'string') return null;

    const match = authorizationHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) return null;

    try {
        const payload = jwt.verify(match[1], getJwtSecret(), {
            algorithms: ['HS256'],
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE
        });

        if (typeof payload !== 'object' || !payload.sub || !payload.email) return null;

        const email = String(payload.email).trim().toLowerCase();
        // Opsi B: Role admin valid jika memiliki klaim adminSession dan email-nya terdaftar di allowlist ADMIN_EMAILS.
        // Menghapus email dari ADMIN_EMAILS mencabut hak akses admin seketika.
        const isAdminSession = Boolean(
            payload.adminSession === true &&
            isAdminEmail(email)
        );
        return {
            id: String(payload.sub),
            email,
            username: typeof payload.username === 'string' ? payload.username : null,
            role: isAdminSession ? 'ADMIN' : 'USER'
        };
    } catch {
        // Token kedaluwarsa, rusak, atau ditandatangani secret lain tidak membuat request dipercaya.
        return null;
    }
}

export function requireAuthenticatedUser(context) {
    // Pakai pemeriksaan yang sama pada semua resolver privat.
    if (!context?.user) {
        throw new GraphQLError('Silakan masuk untuk mengakses data ini.', {
            extensions: { code: 'UNAUTHENTICATED' }
        });
    }
    return context.user;
}

export function requireAdmin(context) {
    const user = requireAuthenticatedUser(context);
    if (user.role !== 'ADMIN') {
        throw new GraphQLError('Akses khusus administrator.', {
            extensions: { code: 'FORBIDDEN' }
        });
    }
    return user;
}
