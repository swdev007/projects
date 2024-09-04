import { Navigate } from "react-router-dom";

interface UnGuardedRoutesProps {
  isAuthenticated: boolean;
  children: JSX.Element;
}
export default function UnGuardedRoutes({
  isAuthenticated,
  children,
}: UnGuardedRoutesProps) {
  if (isAuthenticated) {
    return <Navigate to="/user/list" replace />;
  }
  return children;
}
