import { getDb, isDbConnected } from '../config/db.js';

const memLogs = [];

export const historyResolvers = {
    Query: {
        userLogs: async (_, { limit = 20 }) => {
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT id, user_id, action, details, created_at FROM user_activity_logs ORDER BY created_at DESC LIMIT ?',
                        [limit]
                    );
                    return rows.map(r => ({
                        id: String(r.id),
                        userId: r.user_id ? String(r.user_id) : null,
                        action: r.action,
                        details: r.details,
                        createdAt: r.created_at ? r.created_at.toISOString() : new Date().toISOString()
                    }));
                } catch (err) {
                    console.warn('[History Query Error]', err.message);
                }
            }
            return memLogs.slice(0, limit);
        }
    },

    Mutation: {
        logActivity: async (_, { action, details, userId }) => {
            if (!action) return false;

            if (isDbConnected()) {
                const db = getDb();
                try {
                    await db.execute(
                        'INSERT INTO user_activity_logs (user_id, action, details) VALUES (?, ?, ?)',
                        [userId ? parseInt(userId, 10) : null, action, details || null]
                    );
                    return true;
                } catch (err) {
                    console.warn('[Log Activity Error]', err.message);
                }
            }

            memLogs.unshift({
                id: 'log-' + Date.now(),
                userId: userId || null,
                action,
                details: details || null,
                createdAt: new Date().toISOString()
            });
            if (memLogs.length > 100) memLogs.pop();
            return true;
        }
    }
};

