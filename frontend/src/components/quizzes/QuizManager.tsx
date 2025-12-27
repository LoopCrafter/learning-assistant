import { useAiStore } from "@src/store/useAiStore";
import type { Quiz } from "@src/types/quiz";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../common/Button";
import Spinner from "../common/spinner";
import EmptyState from "../common/EmptyState";
import QuizCard from "./QuizCard";
import Modal from "../common/Modal";

type QuizManagerProps = {
  documentId?: string;
};

const QuizManager: React.FC<QuizManagerProps> = ({ documentId = "" }) => {
  const getQuizzes = useAiStore((state) => state.getQuizzes);
  const generateQuiz = useAiStore((state) => state.generateQuiz);
  const deleteQuiz = useAiStore((state) => state.deleteQuiz);

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

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGenerating(true);
      const result = await generateQuiz(documentId, numQuestiones);
      setIsGenerateModalOpen(false);

      setQuizzes([result, ...quizzes]);
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
    if (!selectedQuiz) return;

    setDeleing(true);
    try {
      await deleteQuiz(selectedQuiz._id);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== selectedQuiz?._id));
      setIsDeleteModalOpen(false);
      toast.success(`"${selectedQuiz.title}" has been deleted.`);
      setSelectedQuiz(null);
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

    if (quizzes.length === 0) {
      return (
        <EmptyState
          title="No Quizzes yet"
          description="Generate a quiz your document to test your knowledge."
        />
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {quizzes.map((quiz) => (
          <QuizCard key={quiz._id} quiz={quiz} onDelete={handleDeleteRequest} />
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <div className="flex justify-end gap-2 mb-4">
          <Button onClick={() => setIsGenerateModalOpen(true)}>
            <Plus size={16} />
            Generate Quiz
          </Button>
        </div>
        {renderQuizContent()}
      </div>
      {/* Generate Quiz Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Create New Quiz"
      >
        <form onSubmit={handleGenerateQuiz} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Number of Questions:
            </label>
            <input
              type="number"
              value={numQuestiones}
              onChange={(e) => setNumQuestiones(Math.max(1, +e.target.value))}
              className="w-full h-9 px-3 border border-neutral-200 rounded-lg bg-white text-sm text-neutral-900 placeholder-neutral-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#00d492] focus:border-transparent"
              min={1}
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsGenerateModalOpen(false)}
              disabled={generating}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={generating}>
              {generating ? "Genrating ..." : "Generate"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Quiz"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Are you sure you want to delete quiz:{" "}
            <span className="font-semibold text-neutral-900">
              {selectedQuiz?.title ? `the ${selectedQuiz?.title}` : "this quiz"}
            </span>{" "}
            ?
            <br /> This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleing}
              className=""
            >
              {deleing ? "Deleting ..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default QuizManager;
