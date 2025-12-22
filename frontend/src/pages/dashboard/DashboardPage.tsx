import { useEffect } from "react";
import Api from "../../utils/axiosInstance";
import { API_Paths } from "../../utils/apiPath";

const DashboardPage = () => {
  useEffect(() => {
    const getOverview = async () => {
      try {
        const res = await Api(API_Paths.PROGRESS.GET_DASHBOARD);
        console.log("dashboard", res);
      } catch (err) {
        console.log(err);
      }
    };
    getOverview();
  }, []);
  return <div>DashboardPage</div>;
};

export default DashboardPage;
