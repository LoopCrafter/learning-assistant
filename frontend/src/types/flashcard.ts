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

export type FlashcardsSet = {
  _id: string;
  userId: string;
  documentId: string | null;
  cards: FlashCard[];
  createdAt: string;
  updatedAt: string;
};
