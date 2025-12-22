import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "../layout/AppLayout";

const ProtcteedRoute = () => {
  const isAuthorized = false;
  const isLoading = false;

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default ProtcteedRoute;
