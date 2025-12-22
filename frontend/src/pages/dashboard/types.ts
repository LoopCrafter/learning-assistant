type Overview = {
  totalDocuments: number;
  totalFlashcardSets: number;
  totalFlashcards: number;
  reviewedFlashcards: number;
  starredFlashcards: number;
  totalQuizzes: number;
  completedQuizzes: number;
  averageScore: number;
  studyStrick: number;
};

type DocumentActivity = {
  _id: string;
  title: string;
  fileName: string;
  status: string;
  lastAccessedAt: string;
};

type QuizDocumentRef = {
  _id: string;
  title: string;
};

type QuizActivity = {
  _id: string;
  documentId: QuizDocumentRef;
  title: string;
  score: number;
  totalQuestions: number;
  completedAt: string | null;
};

type RecentActivities = {
  documents: DocumentActivity[];
  quizzes: QuizActivity[];
};

type DashboardData = {
  overview: Overview;
  recentActivities: RecentActivities;
};

export type { DashboardData };
