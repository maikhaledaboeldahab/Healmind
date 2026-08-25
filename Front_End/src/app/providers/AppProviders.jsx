import { AuthProvider as AdminAuthProvider } from '../../features/admin/context/AuthContext';
import { ToastProvider as AdminToastProvider } from '../../features/admin/context/ToastContext';
import { AuthProvider as UserAuthProvider } from '../../shared/context/AuthContext';
import { NotificationProvider as UserNotificationProvider } from '../../shared/context/NotificationContext';

export default function AppProviders({ children }) {
  return (
    <AdminAuthProvider>
      <AdminToastProvider>
        <UserAuthProvider>
          <UserNotificationProvider>
            {children}
          </UserNotificationProvider>
        </UserAuthProvider>
      </AdminToastProvider>
    </AdminAuthProvider>
  );
}
