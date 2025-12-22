import { useEffect, useState } from "react";
import Api from "../../utils/axiosInstance";
import { API_Paths } from "../../utils/apiPath";
import type { DashboardData } from "./types";
import Spinner from "@src/components/shared/spinner";
import { BookOpen, BrainCircuit, FileText, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getOverview = async () => {
      try {
        setLoading(true);
        const res = await Api(API_Paths.PROGRESS.GET_DASHBOARD);
        console.log("dashboard", res);
        setDashboardData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    getOverview();
  }, []);
  if (loading) {
    return <Spinner />;
  }

  if (!dashboardData || !dashboardData.overview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-100 mb-4">
            <TrendingUp className="size-8 text-slate-400" />
          </div>
          <p className="text-slate-600 text-sm"> No dashboard data available</p>
        </div>
      </div>
    );
  }

  const status = [
    {
      label: "Total Documents",
      value: dashboardData.overview.totalDocuments,
      icon: FileText,
      gradient: "from-blue-400 to-cyan-500",
      shadowColor: "shadow-blue-500/25",
    },
    {
      label: "Total Flashcards",
      value: dashboardData.overview.totalFlashcardSets,
      icon: BookOpen,
      gradient: "from-purple-400 to-pink-500",
      shadowColor: "shadow-purple-500/25",
    },
    {
      label: "Total Quizzes",
      value: dashboardData.overview.totalQuizzes,
      icon: BrainCircuit,
      gradient: "from-emerald-400 to-teal-500",
      shadowColor: "shadow-emerald-500/25",
    },
  ];
  return <div>DashboardPage</div>;
};

export default DashboardPage;
