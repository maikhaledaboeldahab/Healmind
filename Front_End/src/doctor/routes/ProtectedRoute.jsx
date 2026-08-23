import { Outlet } from 'react-router-dom';

/**
 * Doctor route protector.
 * Passes through to render the doctor interface.
 */
export default function DoctorProtectedRoute() {
  return <Outlet />;
}
