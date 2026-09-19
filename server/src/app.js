import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import { typeDefs } from './schema/typeDefs.js';
import { resolvers } from './resolvers/index.js';
import { getApiKeyPoolStatus } from './config/gemini.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Inisialisasi Apollo GraphQL Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
    formatError: (formattedError) => {
        console.error('⚠️ [GraphQL Error]:', formattedError.message);
        return formattedError;
    }
});

await server.start();

// Mount GraphQL endpoint
app.use('/graphql', expressMiddleware(server, {
    context: async ({ req }) => {
        const token = req.headers.authorization || '';
        return { token };
    }
}));

// REST Health Check
app.get('/health', (req, res) => {
    const keyStatus = getApiKeyPoolStatus();
    res.json({
        status: 'OK',
        service: 'PahamTeks GraphQL & Gemini Server',
        geminiKeysRegistered: keyStatus.totalKeys,
        timestamp: new Date().toISOString()
    });
});

export default app;

