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
import { isDbConnected } from './config/db.js';

dotenv.config();

const app = express();

// 1. Keamanan HTTP Headers dengan Helmet
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// 2. Pembatasan Domain CORS (Whitelist)
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    'https://pahamteks.vercel.app'
];

app.use(cors({
    origin: (origin, callback) => {
        // Izinkan request tanpa origin (seperti UptimeRobot, server-to-server health probe, mobile/curl)
        if (!origin) return callback(null, true);

        // Izinkan jika ada di daftar, berakhiran .vercel.app, atau dalam mode development
        const isVercelSubdomain = /\.vercel\.app$/.test(origin);
        if (allowedOrigins.includes(origin) || isVercelSubdomain || process.env.NODE_ENV !== 'production') {
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

// Mount GraphQL endpoint dengan context IP dan Authorization
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
        return { token, clientIp };
    }
}));

// 6. REST Health Check & System Monitoring Endpoint
app.get('/health', (req, res) => {
    const keyStatus = getApiKeyPoolStatus();
    const memory = process.memoryUsage();
    
    res.json({
        status: 'OK',
        service: 'PahamTeks GraphQL & Gemini Server',
        uptimeSeconds: Math.floor(process.uptime()),
        databaseConnected: isDbConnected(),
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
