import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// Arahkan semua operasi GraphQL frontend ke endpoint backend.
const httpLink = createHttpLink({
  uri: '/graphql',
});

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
