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
        username: String
        name: String!
        token: String
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
        activeDbEngine: String
        uptimeSeconds: Float
        memoryRssMb: Float
        memoryHeapMb: Float
        totalUsersCount: Int
        totalQuizzesCount: Int
        geminiModel: String
    }

    type Query {
        serverStatus: ServerStatus!
        languages: [Language!]!
        dictionary(keyword: String!, lang: String): DictionaryResult!
        generateQuiz(
            categories: [String!]!
            level: String!
            lang: String
            unit: Int
            topicDetail: String
            refresh: Boolean
        ): [QuizItem!]!
        generateChallenge(category: String!, lang: String): [QuizItem!]!
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
            username: String
            fname: String
            lname: String
            otp: String!
        ): AuthResponse!
        login(
            email: String!
            password: String!
        ): AuthResponse!
        requestPasswordReset(email: String!): AuthResponse!
        resetPassword(
            email: String!
            otp: String!
            newPassword: String!
        ): AuthResponse!
        logActivity(
            action: String!
            details: String
            userId: ID
        ): Boolean!
    }
`;

