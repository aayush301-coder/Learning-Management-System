import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import Loader from "../components/common/Loader";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
