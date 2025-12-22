import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import { useAuthStore } from "../../store/useAuthStore";

const ProtcteedRoute = () => {
  const isAuthorized = useAuthStore((state) => state.isAuthorized);
  const isLoading = false;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return isAuthorized ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtcteedRoute;
