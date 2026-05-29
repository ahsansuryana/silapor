import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../../lib/jwt";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const role = getRoleFromToken();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
