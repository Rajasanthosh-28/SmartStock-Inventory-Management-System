import { Navigate, Outlet } from "react-router-dom";
import adminAuthService from "../services/adminAuthService";

function ProtectedAdminRoute() {
  const user = adminAuthService.getUser();

  const isAuthorized =
    adminAuthService.isAuthenticated() &&
    user?.role === "ADMIN";

  return isAuthorized
    ? <Outlet />
    : <Navigate to="/admin/login" replace />;
}

export default ProtectedAdminRoute;