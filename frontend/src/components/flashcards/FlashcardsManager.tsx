import { useAiStore } from "@src/store/useAiStore";
import type { FlashCard } from "@src/types/flashcard";
import { useEffect, useState } from "react";
import Spinner from "../common/spinner";
import { Brain, Sparkles } from "lucide-react";

type FlashcardsManagerProps = {
  documentId?: string;
};

const FlashcardsManager: React.FC<FlashcardsManagerProps> = ({
  documentId = "",
}) => {
  const fetchFlashcards = useAiStore((state) => state.fetchFlashcardsForDoc);
  const generateFlashcard = useAiStore((state) => state.generateFlashcard);
  const [flascardsSets, setFlascardsSets] = useState<FlashCard[]>([]);
  const [seelctedSet, setSeelctedSet] = useState<FlashCard[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashCard[] | null>(null);
  const [numOfFlashcardToGenerate, setNumOfFlashcardToGenerate] = useState(2);

  const handleFetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await fetchFlashcards(documentId);
      setFlascardsSets(response);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (documentId) {
      handleFetchFlashcards();
    }
  }, [documentId, fetchFlashcards]);

  const handleGenerateFlashcards = async () => {
    setGenerating(true);
    try {
      const response = await generateFlashcard(
        documentId,
        numOfFlashcardToGenerate
      );
      handleFetchFlashcards();
    } catch (e) {
      console.log(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleReview = async (index: number) => {
    //TODO
  };

  const handleToggleStar = async (CardId: string) => {
    //TODO
  };

  const handleDeleteRequest = async (e: any, set: FlashCard[]) => {
    e.preventDefault();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    //TODO
  };

  const handleSelectSet = (set: FlashCard[]) => {
    setSeelctedSet(set);
  };

  const renderFlashcardViewer = () => {
    return "Flashcard Viewer";
  };

  const renderSetList = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-20">
          <Spinner />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-16 px-6">
        <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-linear-to-br from-emerald-100 to-teal-100 mb-2">
          <Brain className="size-8 text-emerald-600" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 mb-2">
          No Flashcard Yet
        </h3>
        <p className="text-sm text-slate-500 mb-8 text-center max-w-sm">
          Generate flashcard from your document to start learning and reinforce
          your knowledge.
        </p>
        <button
          onClick={handleGenerateFlashcards}
          className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500  hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          disabled={generating}
        >
          {generating ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="size-4" strokeWidth={2} />
              Generate Flashcards
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
      {seelctedSet ? renderFlashcardViewer() : renderSetList()}
    </div>
  );
};

export default FlashcardsManager;
