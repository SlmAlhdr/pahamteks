import { gql } from '@apollo/client';

export const TRANSLATE_MUTATION = gql`
  mutation Translate($text: String!, $source: String!, $target: String!) {
    translate(text: $text, source: $source, target: $target) {
      translatedText
      error
    }
  }
`;

export const EXPLAIN_ANSWER_MUTATION = gql`
  mutation ExplainAnswer(
    $question: String!
    $userAnswer: String!
    $correctAnswer: String!
    $category: String
    $lang: String
  ) {
    explainAnswer(
      question: $question
      userAnswer: $userAnswer
      correctAnswer: $correctAnswer
      category: $category
      lang: $lang
    ) {
      explanation
      error
    }
  }
`;

export const TRANSCRIBE_AUDIO_MUTATION = gql`
  mutation TranscribeAudio(
    $audioBase64: String!
    $mimeType: String
    $lang: String
  ) {
    transcribeAudio(
      audioBase64: $audioBase64
      mimeType: $mimeType
      lang: $lang
    ) {
      text
      error
    }
  }
`;

export const SEND_OTP_MUTATION = gql`
  mutation SendOtp($email: String!) {
    sendOtp(email: $email) {
      success
      message
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register(
    $email: String!
    $password: String!
    $username: String
    $fname: String
    $lname: String
    $otp: String!
  ) {
    register(
      email: $email
      password: $password
      username: $username
      fname: $fname
      lname: $lname
      otp: $otp
    ) {
      success
      message
      user {
        id
        email
        username
        name
        role
        token
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      success
      message
      user {
        id
        email
        username
        name
        role
        token
      }
    }
  }
`;

// Login admin menggabungkan password akun masing-masing dan password admin server.
export const ADMIN_LOGIN_MUTATION = gql`
  mutation AdminLogin($email: String!, $password: String!, $adminPassword: String!) {
    adminLogin(email: $email, password: $password, adminPassword: $adminPassword) {
      success
      message
      user {
        id
        email
        username
        name
        role
        token
      }
    }
  }
`;

export const REQUEST_PASSWORD_RESET_MUTATION = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($email: String!, $otp: String!, $newPassword: String!) {
    resetPassword(email: $email, otp: $otp, newPassword: $newPassword) {
      success
      message
    }
  }
`;

export const LOG_ACTIVITY_MUTATION = gql`
  mutation LogActivity($action: String!, $details: String) {
    logActivity(action: $action, details: $details)
  }
`;
