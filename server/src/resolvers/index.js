import { geminiResolvers } from './geminiResolvers.js';
import { authResolvers } from './authResolvers.js';
import { historyResolvers } from './historyResolvers.js';
import { getApiKeyPoolStatus } from '../config/gemini.js';
import { isDbConnected, getDbStatus, getDb } from '../config/db.js';

export const resolvers = {
    Query: {
        // Gabungkan status layanan dengan resolver fitur lainnya.
        serverStatus: async () => {
            const status = getApiKeyPoolStatus();
            const dbStatus = getDbStatus();
            const db = getDb();

            let totalUsers = 0;
            let totalQuizzes = 0;
            try {
                const [uRows] = await db.execute('SELECT COUNT(*) AS total FROM users');
                totalUsers = uRows?.[0]?.total || 0;
            } catch (err) {
                console.warn('[serverStatus] Gagal menghitung user count:', err.message);
            }

            try {
                const [qRows] = await db.execute('SELECT COUNT(*) AS total FROM quiz_history');
                totalQuizzes = qRows?.[0]?.total || 0;
            } catch (err) {
                console.warn('[serverStatus] Gagal menghitung quiz count:', err.message);
            }

            const mem = process.memoryUsage();
            const uptime = process.uptime();

            return {
                status: 'online',
                geminiKeysCount: status.totalKeys,
                dbConnected: isDbConnected(),
                timestamp: new Date().toISOString(),
                activeDbEngine: dbStatus.activeEngine,
                uptimeSeconds: Math.round(uptime),
                memoryRssMb: Math.round(mem.rss / 1024 / 1024),
                memoryHeapMb: Math.round(mem.heapUsed / 1024 / 1024),
                totalUsersCount: totalUsers,
                totalQuizzesCount: totalQuizzes,
                geminiModel: 'gemini-3.5-flash-lite'
            };
        },
        ...geminiResolvers.Query,
        ...authResolvers.Query,
        ...historyResolvers.Query
    },

    Mutation: {
        ...geminiResolvers.Mutation,
        ...authResolvers.Mutation,
        ...historyResolvers.Mutation
    }
};
