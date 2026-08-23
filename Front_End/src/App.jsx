import { AuthProvider as AdminAuthProvider } from './admin/context/AuthContext';
import { ToastProvider as AdminToastProvider } from './admin/context/ToastContext';
import { AuthProvider as UserAuthProvider } from './context/AuthContext';
import { NotificationProvider as UserNotificationProvider } from './context/NotificationContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <UserAuthProvider>
          <UserNotificationProvider>
            <AppRoutes />
          </UserNotificationProvider>
        </UserAuthProvider>
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
