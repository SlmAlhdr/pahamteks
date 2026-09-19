import { gql } from '@apollo/client';

export const GET_SERVER_STATUS = gql`
  query GetServerStatus {
    serverStatus {
      status
      geminiKeysCount
      dbConnected
      timestamp
    }
  }
`;

export const GET_LANGUAGES = gql`
  query GetLanguages {
    languages {
      code
      name
    }
  }
`;

export const GET_DICTIONARY = gql`
  query GetDictionary($keyword: String!) {
    dictionary(keyword: $keyword) {
  query GetDictionary($keyword: String!, $lang: String) {
    dictionary(keyword: $keyword, lang: $lang) {
      result
      error
    }
  }
`;

export const GENERATE_QUIZ = gql`
  query GenerateQuiz($categories: [String!]!, $level: String!) {
    generateQuiz(categories: $categories, level: $level) {
  query GenerateQuiz($categories: [String!]!, $level: String!, $lang: String) {
    generateQuiz(categories: $categories, level: $level, lang: $lang) {
      instruction
      question
      options
      answer
    }
  }
`;

export const GENERATE_CHALLENGE = gql`
  query GenerateChallenge($category: String!) {
    generateChallenge(category: $category) {
  query GenerateChallenge($category: String!, $lang: String) {
    generateChallenge(category: $category, lang: $lang) {
      instruction
      question
      options
      answer
    }
  }
`;

export const GET_USER_LOGS = gql`
  query GetUserLogs($limit: Int) {
    userLogs(limit: $limit) {
      id
      action
      details
      createdAt
    }
  }
`;

