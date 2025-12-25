import { useAiStore } from "@src/store/useAiStore";
import type { FlashCard, FlashcardsSet } from "@src/types/flashcard";
import { useEffect, useState } from "react";
import Spinner from "../common/spinner";
import { Brain, Plus, Sparkles, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@src/utils";
import FlashcardList from "./FlashcardList";
import NoFlashcardSets from "./NoFlashcardSets";
import Modal from "../common/Modal";
import { toast } from "react-toastify";

type FlashcardsManagerProps = {
  documentId?: string;
};

const FlashcardsManager: React.FC<FlashcardsManagerProps> = ({
  documentId = "",
}) => {
  const fetchFlashcards = useAiStore((state) => state.fetchFlashcardsForDoc);
  const generateFlashcard = useAiStore((state) => state.generateFlashcard);
  const deleteFlashcardSet = useAiStore((state) => state.deleteFlashcardSet);
  const [flashcardsSets, setFlashcardsSets] = useState<FlashcardsSet[]>([]);
  const [seelctedSet, setSeelctedSet] = useState<FlashcardsSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashcardsSet | null>(null);
  const [numOfFlashcardToGenerate, setNumOfFlashcardToGenerate] = useState(2);

  const handleFetchFlashcards = async () => {
    setLoading(true);
    try {
      const response = await fetchFlashcards(documentId);
      console.log(response);
      setFlashcardsSets(response);
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
      await generateFlashcard(documentId, numOfFlashcardToGenerate);
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

  const handleDeleteRequest = async (e: any, set: FlashcardsSet) => {
    e.preventDefault();
    setSetToDelete(set);
    setIsDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!setToDelete) return;
    setDeleting(true);
    try {
      await deleteFlashcardSet(setToDelete._id);
      toast.success("flashcard set has been removed successfully!");

      setIsDeleteModalOpen(false);
      handleFetchFlashcards();
    } catch (error: any) {
      toast.success(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set: FlashcardsSet) => {
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

    if (flashcardsSets.length === 0) {
      return (
        <NoFlashcardSets
          generating={generating}
          handleGenerateFlashcards={handleGenerateFlashcards}
        />
      );
    }
    return (
      <FlashcardList
        flashcardsSets={flashcardsSets}
        handleDeleteRequest={handleDeleteRequest}
        handleSelectSet={handleSelectSet}
        handleGenerateFlashcards={handleGenerateFlashcards}
        generating={generating}
      />
    );
  };

  return (
    <>
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-200/50 p-8">
        {seelctedSet ? renderFlashcardViewer() : renderSetList()}
      </div>
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Flashcard Set?"
      >
        <div className="space-y-6">
          <p className="text-sm text-slate-600">
            Are you sure you want to delete this Flashcard set? <br />
            this action can not be undone and all card will be permanently
            removed.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2 ">
            <button
              className="px-5 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-5 h-11 bg-linear-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-rose-500/25 active:scale-95 disabled:active:scale-100"
              onClick={handleConfirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <span className="flex items-center gap-2">
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </span>
              ) : (
                "Delete Set"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FlashcardsManager;
