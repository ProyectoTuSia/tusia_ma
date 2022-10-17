import { ApolloClient, InMemoryCache } from '@apollo/client';

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  // Provide required constructor fields
  cache: cache,
  uri: 'http://localhost:3001/',

  // Provide some optional constructor fields
  name: 'tusia_ma_client',
  version: '1.3',
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

