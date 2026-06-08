import { Redirect } from 'expo-router';

import { ROUTES } from '@/constants/routes';

export default function HistoryRedirect() {
  return <Redirect href={ROUTES.search} />;
}
