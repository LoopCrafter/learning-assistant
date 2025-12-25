export type FlashCard = {
  _id: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  lastReviewdAt: string;
  reviewCount: number;
  isStarred: boolean;
  isCompleted: boolean;
};
