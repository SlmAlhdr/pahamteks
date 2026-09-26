import { getDb, isDbConnected } from '../config/db.js';
import { requireAdmin, requireAuthenticatedUser } from '../utils/auth.js';

const memLogs = [];

export const historyResolvers = {
    Query: {
        // Ambil log aktivitas terbaru dari database atau fallback memori.
        userLogs: async (_, { limit = 20 }, context) => {
            // Log audit dapat berisi aktivitas akun, jadi hanya admin yang boleh membacanya.
            requireAdmin(context);
            // Batasi ukuran respons agar parameter klien tidak memicu pembacaan log tanpa batas.
            const safeLimit = Math.min(100, Math.max(1, Number.isInteger(limit) ? limit : 20));
            if (isDbConnected()) {
                const db = getDb();
                try {
                    const [rows] = await db.execute(
                        'SELECT id, user_id, action, details, created_at FROM user_activity_logs ORDER BY created_at DESC LIMIT ?',
                        [safeLimit]
                    );
                    return rows.map(r => ({
                        id: String(r.id),
                        userId: r.user_id ? String(r.user_id) : null,
                        action: r.action,
                        details: r.details,
                        createdAt: r.created_at
                            ? new Date(r.created_at).toISOString()
                            : new Date().toISOString()
                    }));
                } catch (err) {
                    console.warn('[History Query Error]', err.message);
                }
            }
            return memLogs.slice(0, safeLimit);
        },

        myQuizHistory: async (_, { limit = 100 }, context) => {
            const user = requireAuthenticatedUser(context);
            const numericUserId = Number(user.id);
            if (!Number.isSafeInteger(numericUserId) || numericUserId < 1) return [];

            const safeLimit = Math.min(100, Math.max(1, Number.isInteger(limit) ? limit : 100));
            try {
                const [rows] = await getDb().execute(
                    'SELECT id, categories, unit, unit_title, score, total_questions, created_at FROM quiz_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
                    [numericUserId, safeLimit]
                );
                return rows.map(row => ({
                    id: String(row.id),
                    topic: row.categories,
                    unit: Number(row.unit) || 1,
                    unitTitle: row.unit_title || null,
                    score: Number(row.score),
                    total: Number(row.total_questions),
                    date: row.created_at ? new Date(row.created_at).toISOString() : new Date().toISOString()
                }));
            } catch (err) {
                console.warn('[Quiz History Query Error]', err.message);
                return [];
            }
        }
    },

    Mutation: {
        // Simpan aktivitas pengguna tanpa menggagalkan alur utama bila DB gagal.
        saveQuizScore: async (_, { topic, unit, unitTitle, answersJson, level, score, total }, context) => {
            const user = requireAuthenticatedUser(context);
            const numericUserId = Number(user.id);
            if (!Number.isSafeInteger(numericUserId) || numericUserId < 1) return false;
            if (typeof topic !== 'string' || !topic.trim() || topic.length > 255) return false;
            if (typeof level !== 'string' || !level.trim() || level.length > 50) return false;
            if (!Number.isInteger(unit) || unit < 1 || unit > 5) return false;
            if (!Number.isInteger(score) || !Number.isInteger(total) || total < 1 || total > 100 || score < 0 || score > total) return false;
            if (unitTitle != null && (typeof unitTitle !== 'string' || unitTitle.length > 255)) return false;
            if (typeof answersJson !== 'string' || answersJson.length > 50000) return false;
            let answers;
            try {
                answers = JSON.parse(answersJson);
            } catch (err) {
                console.warn('[Save Quiz Score Error] Jawaban kuis bukan JSON valid:', err.message);
                return false;
            }
            if (!Array.isArray(answers) || answers.length !== total) return false;

            try {
                await getDb().execute(
                    'INSERT INTO quiz_history (user_id, level, categories, unit, unit_title, answers_json, score, total_questions) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [numericUserId, level.trim(), topic.trim(), unit, unitTitle || null, answersJson, score, total]
                );
                return true;
            } catch (err) {
                console.warn('[Save Quiz Score Error]', err.message);
                return false;
            }
        },

        logActivity: async (_, { action, details }, context) => {
            const user = requireAuthenticatedUser(context);
            // Validasi input dan ambil userId dari token terverifikasi, bukan dari argumen klien.
            if (typeof action !== 'string' || !/^[A-Z][A-Z0-9_]{0,49}$/.test(action)) return false;
            if (details != null && (typeof details !== 'string' || details.length > 1000)) return false;

            const numericUserId = /^\d+$/.test(user.id) ? Number(user.id) : null;

            if (isDbConnected()) {
                const db = getDb();
                try {
                    await db.execute(
                        'INSERT INTO user_activity_logs (user_id, action, details) VALUES (?, ?, ?)',
                        [numericUserId, action, details || null]
                    );
                    return true;
                } catch (err) {
                    console.warn('[Log Activity Error]', err.message);
                }
            }

            memLogs.unshift({
                id: 'log-' + Date.now(),
                userId: user.id,
                action,
                details: details || null,
                createdAt: new Date().toISOString()
            });
            if (memLogs.length > 100) memLogs.pop();
            return true;
        }
    }
};
