import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import Loader from "../components/common/Loader";

function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading..." />;
  }

  if (user) {
    if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "instructor") return <Navigate to="/instructor/dashboard" replace />;
    return <Navigate to="/student/dashboard" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
