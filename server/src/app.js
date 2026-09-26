import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { getApiKeyPoolStatus } from './config/gemini.js';
import { isDbConnected, getDbStatus } from './config/db.js';
import { assertJwtSecretConfigured, authenticateRequest } from './utils/auth.js';

dotenv.config();
// Gagalkan startup jika secret JWT belum disiapkan; jangan pernah memakai nilai default.
assertJwtSecretConfigured();

const app = express();

// 1. Keamanan HTTP Headers dengan Helmet
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// 2. Pembatasan Domain CORS (Whitelist)
const envAllowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()).filter(Boolean)
    : [];

const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    ...envAllowedOrigins
];

app.use(cors({
    origin: (origin, callback) => {
        // Izinkan request tanpa origin (seperti UptimeRobot, server-to-server health probe, mobile/curl)
        if (!origin) return callback(null, true);

        // Izinkan origin lokal, daftar env, Cloudflare tunnel, Vercel, atau mode dev
        const isCloudflareTunnel = /\.trycloudflare\.com$/.test(origin);
        const isVercel = /\.vercel\.app$/.test(origin);
        if (allowedOrigins.includes(origin) || isCloudflareTunnel || isVercel || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        return callback(new Error('Akses diblokir oleh kebijakan keamanan CORS PahamTeks.'));
    },
    credentials: true
}));

// 3. Rate Limiter Global untuk perlindungan DoS & Brute Force
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 200, // Maksimal 200 request per 15 menit per IP
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: 'Terlalu banyak permintaan dari IP ini. Silakan coba lagi setelah beberapa saat demi stabilitas sistem.'
    }
});

// Pasang Rate Limiter pada endpoint GraphQL
app.use('/graphql', apiLimiter);

// 4. Parser Body Request
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 5. Inisialisasi Apollo GraphQL Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError) => {
        console.error('⚠️ [GraphQL Error]:', formattedError.message);
        return formattedError;
    }
});

await server.start();

// Sediakan token dan IP client bagi resolver yang memerlukan konteks keamanan.
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        // Identitas hanya berasal dari Bearer token yang lolos verifikasi.
        const user = authenticateRequest(req.headers.authorization);
        const clientIp = req.ip || req.socket?.remoteAddress || 'unknown';
        return { user, clientIp };
    }
}));

// Probe publik hanya mengungkap bahwa proses hidup; detail operasional hanya untuk admin.
app.get('/healthz', (_req, res) => {
    res.json({ status: 'OK' });
});

app.get('/health', (req, res) => {
    const user = authenticateRequest(req.headers.authorization);
    if (!user) {
        return res.status(401).json({ error: 'Autentikasi diperlukan.' });
    }
    if (user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Akses khusus administrator.' });
    }

    const keyStatus = getApiKeyPoolStatus();
    const memory = process.memoryUsage();
    
    const dbInfo = getDbStatus();
    
    res.json({
        status: 'OK',
        service: 'PahamTeks GraphQL & Gemini Server',
        uptimeSeconds: Math.floor(process.uptime()),
        database: {
            connected: isDbConnected(),
            primary: dbInfo.primary,
            backup: dbInfo.backup,
            activeEngine: dbInfo.activeEngine
        },
        geminiKeysRegistered: keyStatus.totalKeys,
        security: {
            rateLimiter: 'ACTIVE',
            helmetHeaders: 'ACTIVE',
            corsProtection: 'ACTIVE'
        },
        memoryUsageMB: {
            rss: Math.round(memory.rss / 1024 / 1024),
            heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
            heapTotal: Math.round(memory.heapTotal / 1024 / 1024)
        },
        timestamp: new Date().toISOString()
    });
});

export default app;
