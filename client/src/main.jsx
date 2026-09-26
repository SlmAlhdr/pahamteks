import React from 'react';
import ReactDOM from 'react-dom/client';
import { ApolloProvider } from '@apollo/client';
import { Analytics } from '@vercel/analytics/react';
import { apolloClient } from './apolloClient';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={apolloClient}>
      <App />
      <Analytics />
    </ApolloProvider>
  </React.StrictMode>
);
