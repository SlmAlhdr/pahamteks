import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Arahkan semua operasi GraphQL frontend ke endpoint backend.
const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  // Baca token sesi tersimpan untuk mengirim identitas terverifikasi ke backend.
  let token = '';
  try {
    const savedUser = JSON.parse(localStorage.getItem('pahamteks_user') || 'null');
    token = typeof savedUser?.token === 'string' ? savedUser.token : '';
  } catch (error) {
    console.warn('[ApolloAuth] Could not read saved session:', error.message);
  }

  return {
    headers: {
      ...headers,
      // Request tamu tetap berjalan tanpa header Authorization.
      ...(token ? { authorization: `Bearer ${token}` } : {})
    }
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
