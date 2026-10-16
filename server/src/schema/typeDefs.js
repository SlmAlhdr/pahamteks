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
        role: String! # Nilai respons dari backend; bukan input untuk menetapkan hak akses.
        token: String
        createdAt: String
    }

    type AuthResponse {
        success: Boolean!
        message: String!
        user: User
        token: String
        otpSignature: String
    }

    type UserActivityLog {
        id: ID!
        userId: ID
        action: String!
        details: String
        createdAt: String!
    }

    type QuizHistoryEntry {
        id: ID!
        topic: String!
        unit: Int!
        unitTitle: String
        score: Int!
        total: Int!
        date: String!
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
        dictionary(keyword: String!, lang: String): DictionaryResult!
        generateQuiz(
            categories: [String!]!
            level: String!
            lang: String
            unit: Int
            topicDetail: String
            refresh: Boolean
            count: Int
        ): [QuizItem!]!
        generateChallenge(category: String!, lang: String, count: Int): [QuizItem!]!
        me: User
        userLogs(limit: Int): [UserActivityLog!]!
        adminUsers(limit: Int): [User!]!
        myQuizHistory(limit: Int): [QuizHistoryEntry!]!
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
            otpSignature: String
        ): AuthResponse!
        login(
            email: String!
            password: String!
        ): AuthResponse!
        adminLogin(
            email: String!
            password: String!
            adminPassword: String
        ): AuthResponse!
        requestPasswordReset(email: String!): AuthResponse!
        resetPassword(
            email: String!
            otp: String!
            newPassword: String!
            otpSignature: String
        ): AuthResponse!
        logActivity(
            action: String!
            details: String
        ): Boolean!
        saveQuizScore(
            topic: String!
            unit: Int!
            unitTitle: String
            answersJson: String!
            level: String!
            score: Int!
            total: Int!
        ): Boolean!
    }
`;
