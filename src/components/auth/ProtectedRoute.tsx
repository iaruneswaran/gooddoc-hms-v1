import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getCurrentUser, UserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  if (!authenticated) {
    // Redirect to auth page, preserving the intended destination
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // If user doesn't have the required role, redirect to their default home
    const defaultPath = user.role === 'DENTAL' ? '/dental' : '/';
    return <Navigate to={defaultPath} replace />;
  }

  return <>{children}</>;
}
