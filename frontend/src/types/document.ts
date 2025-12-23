export type Document = {
  _id: string;
  userId: string;
  title: string;
  extractedText: string;
  summary: string;
  status: "ready" | "processing" | "error";
  fileName: string;
  filePath: string;
  fileSize: number;
  flashcardCount: number;
  quizCount: number;
  createdAt: string;
  updatedAt: string;
  uploadDate: string;
  lastAccessedAt: string;
  __v: number;
};
