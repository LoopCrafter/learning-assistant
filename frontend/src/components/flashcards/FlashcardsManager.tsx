import { useAiStore } from "@src/store/useAiStore";
import type { FlashcardsSet } from "@src/types/flashcard";
import { useEffect, useState } from "react";
import Spinner from "../common/spinner";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import FlashcardList from "./FlashcardList";
import NoFlashcardSets from "./NoFlashcardSets";
import Modal from "../common/Modal";
import { toast } from "react-toastify";
import Flashcard from "./Flashcard";

type FlashcardsManagerProps = {
  documentId?: string;
};

const FlashcardsManager: React.FC<FlashcardsManagerProps> = ({
  documentId = "",
}) => {
  const fetchFlashcards = useAiStore((state) => state.fetchFlashcardsForDoc);
  const generateFlashcard = useAiStore((state) => state.generateFlashcard);
  const deleteFlashcardSet = useAiStore((state) => state.deleteFlashcardSet);
  const toggleFavorite = useAiStore((state) => state.toggleFavorite);
  const reviewFlashcard = useAiStore((state) => state.reviewFlashcard);

  const [flashcardsSets, setFlashcardsSets] = useState<FlashcardsSet[]>([]);
  const [selectedSet, setselectedSet] = useState<
    FlashcardsSet | null | undefined
  >(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [setToDelete, setSetToDelete] = useState<FlashcardsSet | null>(null);
  const [numOfFlashcardToGenerate, setNumOfFlashcardToGenerate] = useState(5);

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
    const currentCard = selectedSet?.cards[index];
    if (!currentCard) return;
    try {
      await reviewFlashcard(currentCard._id);
      toast.success("Flashcard Reviewed");
    } catch (error) {
      toast.error("failed to review flashcard");
    }
  };
  const handleNextCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) => (prevIndex + 1) % selectedSet.cards.length
      );
    }
  };

  const handlePrevCard = () => {
    if (selectedSet) {
      handleReview(currentCardIndex);
      setCurrentCardIndex(
        (prevIndex) =>
          (prevIndex - 1 + selectedSet.cards.length) % selectedSet.cards.length
      );
    }
  };

  const handleToggleStar = async (cardId: string) => {
    try {
      await toggleFavorite(cardId);
      const updatedSets = flashcardsSets.map((set) => {
        if (set._id === selectedSet?._id) {
          const updatedCard = set.cards.map((card) => {
            return card._id === cardId
              ? { ...card, isStarred: !card.isStarred }
              : card;
          });
          return { ...set, cards: updatedCard };
        }
        return set;
      });
      setFlashcardsSets(updatedSets);
      setselectedSet(updatedSets.find((set) => set._id === selectedSet?._id));
      toast.success("flashcard favorite status update successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
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
      toast.error(error.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleSelectSet = (set: FlashcardsSet) => {
    setselectedSet(set);
  };

  const renderFlashcardViewer = () => {
    const currentCard = selectedSet?.cards[currentCardIndex];
    return (
      <div className="space-y-8">
        <button
          className="group inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors duration-200"
          onClick={() => setselectedSet(null)}
        >
          <ArrowLeft
            className="size-4 group-hover:-translate-x-1 transition-transform duration-200"
            strokeWidth={2}
          />
          Back to sets
        </button>
        {/* Flashcard display */}
        <div className="flex flex-col items-center space-y-8">
          <div className="w-full max-w-2xl">
            <Flashcard
              flashcard={currentCard}
              onToggleStar={() => handleToggleStar(currentCard?._id ?? "")}
            />
          </div>
        </div>

        {/* Navigation Controlls */}
        <div className="flex items-center gap-6 justify-center">
          <button
            onClick={handlePrevCard}
            disabled={(selectedSet?.cards ?? []).length <= 1}
            className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200  text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:hover:bg-slate-100"
          >
            <ChevronLeft
              className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200"
              strokeWidth={2.5}
            />
            Previous
          </button>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-sm font-semibold text-slate-700">
              {currentCardIndex + 1}
              <span className="text-slate-400 font-normal">/</span>
              {(selectedSet?.cards ?? []).length}
            </span>
          </div>
          <button
            className="group flex items-center gap-2 px-5 h-11 bg-slate-100 hover:bg-slate-200  text-slate-700 font-medium text-sm rounded-xl transition-all duration-200 disabled:hover:bg-slate-100"
            onClick={handleNextCard}
            disabled={(selectedSet?.cards ?? []).length <= 1}
          >
            Next
            <ChevronRight
              className="size-4 group-hover:translate-x-0.5 transition-transform duration-200"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    );
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
        {selectedSet ? renderFlashcardViewer() : renderSetList()}
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
