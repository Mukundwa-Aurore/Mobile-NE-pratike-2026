import type { Href } from 'expo-router';

export const ROUTES = {
  bootstrap: '/' as Href,
  welcome: '/welcome' as Href,
  createAccount: '/create-account' as Href,
  search: '/(drawer)/(tabs)/search' as Href,
  wordDetails: '/(drawer)/(tabs)/search/word-details' as Href,
  notFound: '/(drawer)/(tabs)/search/not-found' as Href,
  saved: '/(drawer)/(tabs)/saved' as Href,
  settings: '/(drawer)/(tabs)/settings' as Href,
} as const;
