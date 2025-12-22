import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SignupPage from "./pages/auth/SignupPage";
import NotFoundPage from "./pages/NotFoundPage";
import ProtcteedRoute from "./components/auth/ProtcteedRoute";
import DocumentListPage from "./pages/document/DocumentListPage";
import DocumentDetailPage from "./pages/document/DocumentDetailPage";
import FlashCardListPage from "./pages/flashCards/FlashCardListPage";
import FlashCardPage from "./pages/flashCards/FlashCardPage";
import QuizzTakePage from "./pages/quizzes/QuizzTakePage";
import QuizzResultPage from "./pages/quizzes/QuizzResultPage";
import ProfilePage from "./pages/profile/ProfilePage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const isAuthorized = false;

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isAuthorized ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route element={<ProtcteedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/documents" element={<DocumentListPage />} />
            <Route path="/documents/:id" element={<DocumentDetailPage />} />
            <Route path="/flashcards" element={<FlashCardListPage />} />
            <Route
              path="/documents/:id/flashcards"
              element={<FlashCardPage />}
            />
            <Route path="/quizzes/:quizzId" element={<QuizzTakePage />} />
            <Route
              path="/quizzes/:quizzId/results"
              element={<QuizzResultPage />}
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
