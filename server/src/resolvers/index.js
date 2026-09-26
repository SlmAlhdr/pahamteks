import { geminiResolvers } from './geminiResolvers.js';
import { authResolvers } from './authResolvers.js';
import { historyResolvers } from './historyResolvers.js';
import { getApiKeyPoolStatus } from '../config/gemini.js';
import { isDbConnected } from '../config/db.js';
import { requireAdmin, requireAuthenticatedUser } from '../utils/auth.js';

// Setiap Query dan Mutation root wajib memiliki kebijakan akses di backend.
// Fitur belajar dan bootstrap akun tetap publik agar tamu tetap bisa menggunakannya.
const accessPolicies = {
    Query: {
        serverStatus: 'admin',
        languages: 'public',
        dictionary: 'public',
        generateQuiz: 'public',
        generateChallenge: 'public',
        me: 'authenticated',
        userLogs: 'admin'
    },
    Mutation: {
        translate: 'public',
        explainAnswer: 'public',
        transcribeAudio: 'public',
        sendOtp: 'public',
        register: 'public',
        login: 'public',
        adminLogin: 'public',
        requestPasswordReset: 'public',
        resetPassword: 'public',
        logActivity: 'authenticated'
    }
};

function applyAccessPolicies(typeName, resolverMap) {
    return Object.fromEntries(Object.entries(resolverMap).map(([fieldName, resolver]) => {
        const policy = accessPolicies[typeName]?.[fieldName];
        // Gagal saat server dimuat jika resolver baru belum diklasifikasikan aksesnya.
        if (!policy) {
            throw new Error(`Missing access policy for ${typeName}.${fieldName}`);
        }

        return [fieldName, (...args) => {
            // Otorisasi diperiksa sebelum resolver menjalankan logika atau membaca data.
            const context = args[2];
            if (policy === 'authenticated') requireAuthenticatedUser(context);
            if (policy === 'admin') requireAdmin(context);
            return resolver(...args);
        }];
    }));
}

const queryResolvers = {
        // Gabungkan status layanan dengan resolver fitur lainnya.
        serverStatus: (_, __, context) => {
            requireAdmin(context);
            const status = getApiKeyPoolStatus();
            return {
                status: 'online',
                geminiKeysCount: status.totalKeys,
                dbConnected: isDbConnected(),
                timestamp: new Date().toISOString()
            };
        },
        ...geminiResolvers.Query,
        ...authResolvers.Query,
        ...historyResolvers.Query
};

const mutationResolvers = {
        ...geminiResolvers.Mutation,
        ...authResolvers.Mutation,
        ...historyResolvers.Mutation
};

export const resolvers = {
    Query: applyAccessPolicies('Query', queryResolvers),
    Mutation: applyAccessPolicies('Mutation', mutationResolvers)
};
