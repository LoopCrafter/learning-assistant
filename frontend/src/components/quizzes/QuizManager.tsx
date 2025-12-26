import { useAiStore } from "@src/store/useAiStore";
import type { Quiz } from "@src/types/quiz";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { set } from "zod";
import Button from "../common/Button";
import Spinner from "../common/spinner";
import EmptyState from "../common/EmptyState";

type QuizManagerProps = {
  documentId?: string;
};

const QuizManager: React.FC<QuizManagerProps> = ({ documentId = "" }) => {
  const getQuizzes = useAiStore((state) => state.getQuizzes);
  const generateQuiz = useAiStore((state) => state.generateQuiz);

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [numQuestiones, setNumQuestiones] = useState(5);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleing, setDeleing] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const result = await getQuizzes(documentId);
      setQuizzes(result);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
      toast.error("Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (documentId) {
      fetchQuizzes();
    }
  }, [documentId]);

  const handleGenerateQuiz = async () => {
    try {
      setGenerating(true);
      const result = await generateQuiz(documentId, numQuestiones);
      setIsGenerateModalOpen(false);

      setQuizzes([...quizzes, result]);
    } catch (error) {
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteRequest = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    //TODO
    try {
      setDeleing(true);
    } catch (error) {
    } finally {
      setDeleing(false);
    }
  };

  const renderQuizContent = () => {
    if (loading) {
      return (
        <div className="">
          <Spinner />
        </div>
      );
    }

    if (true) {
      return (
        <EmptyState
          title="No Quizzes yet"
          description="Generate a quiz your document to test your knowledge."
        />
      );
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex justify-end gap-2 mb-4">
        <Button onClick={() => setIsGenerateModalOpen(true)}>
          <Plus size={16} />
          Generate Quiz
        </Button>
      </div>
      {renderQuizContent()}
    </div>
  );
};

export default QuizManager;
