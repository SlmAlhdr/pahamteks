import jwt from 'jsonwebtoken';
import { GraphQLError } from 'graphql';
import { createHash, timingSafeEqual } from 'node:crypto';

const JWT_ISSUER = 'pahamteks-api';
const JWT_AUDIENCE = 'pahamteks-client';

function getJwtSecret() {
    // Tolak konfigurasi lemah sejak awal agar token tidak ditandatangani dengan secret bawaan.
    const secret = process.env.JWT_SECRET?.trim();
    if (!secret || secret.length < 32) {
        throw new Error('JWT_SECRET must be configured with at least 32 characters.');
    }
    return secret;
}

export function assertJwtSecretConfigured() {
    getJwtSecret();
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
