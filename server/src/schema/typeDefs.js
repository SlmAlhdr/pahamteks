export const typeDefs = `#graphql
    type Language {
        code: String!
        name: String!
    }

    type TranslationResult {
        translatedText: String!
        error: String
    }

    type QuizItem {
        instruction: String
        question: String!
        options: [String!]!
        answer: String!
    }

    type DictionaryResult {
        result: String!
        error: String
    }

    type ExplanationResult {
        explanation: String!
        error: String
    }

    type TranscribeResult {
        text: String!
        error: String
    }

    type User {
        id: ID!
        email: String!
        name: String!
        createdAt: String
    }

    type AuthResponse {
        success: Boolean!
        message: String!
        user: User
        token: String
    }

    type UserActivityLog {
        id: ID!
        userId: ID
        action: String!
        details: String
        createdAt: String!
    }

    type ServerStatus {
        status: String!
        geminiKeysCount: Int!
        dbConnected: Boolean!
        timestamp: String!
    }

    type Query {
        serverStatus: ServerStatus!
        languages: [Language!]!
        dictionary(keyword: String!): DictionaryResult!
        generateQuiz(categories: [String!]!, level: String!): [QuizItem!]!
        generateChallenge(category: String!): [QuizItem!]!
        me(email: String): User
        userLogs(limit: Int): [UserActivityLog!]!
    }

    type Mutation {
        translate(text: String!, source: String!, target: String!): TranslationResult!
        explainAnswer(
            question: String!
            userAnswer: String!
            correctAnswer: String!
            category: String
            lang: String
        ): ExplanationResult!
        transcribeAudio(
            audioBase64: String!
            mimeType: String
            lang: String
        ): TranscribeResult!
        sendOtp(email: String!): AuthResponse!
        register(
            email: String!
            password: String!
            fname: String!
            lname: String!
            otp: String!
        ): AuthResponse!
        login(
            email: String!
            password: String!
        ): AuthResponse!
        logActivity(
            action: String!
            details: String
            userId: ID
        ): Boolean!
    }
`;

