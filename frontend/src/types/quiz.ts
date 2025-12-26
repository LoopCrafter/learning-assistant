type Difficulty = "easy" | "medium" | "hard";

type QuizQuestion = {
  _id: string;
  question: string;
  options: string[];
  difficulty: Difficulty;
  correctAnswer: string;
  explanation: string;
};

export type Quiz = {
  questions: QuizQuestion[];
  score: number;
  totalQuestions: number;
  completedAt: string | null;
  userAnswers: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};
