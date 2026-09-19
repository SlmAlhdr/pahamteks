import { geminiResolvers } from './geminiResolvers.js';
import { authResolvers } from './authResolvers.js';
import { historyResolvers } from './historyResolvers.js';
import { getApiKeyPoolStatus } from '../config/gemini.js';
import { isDbConnected } from '../config/db.js';

export const resolvers = {
    Query: {
        serverStatus: () => {
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
    },

    Mutation: {
        ...geminiResolvers.Mutation,
        ...authResolvers.Mutation,
        ...historyResolvers.Mutation
    }
};

