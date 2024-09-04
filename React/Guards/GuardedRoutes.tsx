import { Navigate } from "react-router-dom";

interface GuardedRoutesProps {
  isAuthenticated: boolean;
  children: JSX.Element;
}
export default function GuardedRoutes({
  isAuthenticated,
  children,
}: GuardedRoutesProps) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
}
