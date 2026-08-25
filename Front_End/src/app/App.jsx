import AppProviders from './providers/AppProviders';
import AppRoutes from './AppRoutes';

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
    </AppProviders>
  );
}
