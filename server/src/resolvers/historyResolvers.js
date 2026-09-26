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
        }
    },

    Mutation: {
        // Simpan aktivitas pengguna tanpa menggagalkan alur utama bila DB gagal.
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
