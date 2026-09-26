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

import path from 'path';
import fs from 'fs';

dotenv.config();
const localServerEnv = path.resolve(process.cwd(), 'server', '.env');
if (fs.existsSync(localServerEnv)) {
    dotenv.config({ path: localServerEnv });
}

assertJwtSecretConfigured();

const app = express();

// Percayakan reverse proxy (Vercel, Cloudflare) untuk deteksi IP asli client
app.set('trust proxy', 1);

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

        // Izinkan origin lokal, daftar env, Cloudflare tunnel, atau domain Vercel
        const isCloudflareTunnel = /\.trycloudflare\.com$/.test(origin);
        const isVercelHost = Boolean(
            (process.env.VERCEL_URL && origin === `https://${process.env.VERCEL_URL}`) ||
            /\.vercel\.app$/.test(origin)
        );
        if (allowedOrigins.includes(origin) || isCloudflareTunnel || isVercelHost || process.env.NODE_ENV !== 'production') {
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
        // Cegah kebocoran rincian internal database atau koneksi di mode produksi
        if (process.env.NODE_ENV === 'production') {
            const msg = formattedError.message || '';
            if (msg.includes('SQL') || msg.includes('sqlite') || msg.includes('ECONNREFUSED') || msg.includes('ER_')) {
                return {
                    message: 'Terjadi kendala pada layanan server. Silakan coba kembali nanti.',
                    extensions: { code: 'INTERNAL_SERVER_ERROR' }
                };
            }
        }
        return formattedError;
    }
});

await server.start();

// Sediakan token dan IP client terverifikasi bagi resolver yang memerlukan konteks keamanan.
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        // Identitas hanya berasal dari Bearer token yang lolos verifikasi.
        const user = authenticateRequest(req.headers.authorization);
        const clientIp = req.headers['cf-connecting-ip']
            || (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null)
            || req.ip
            || req.socket?.remoteAddress
            || 'unknown';
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

app.use((err, _req, res, _next) => {
    console.error('💥 [Express Global Error]:', err.message);
    if (!res.headersSent) {
        res.status(err.status || 500).json({
            error: err.message || 'Internal Server Error',
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
        });
    }
});

export default app;
