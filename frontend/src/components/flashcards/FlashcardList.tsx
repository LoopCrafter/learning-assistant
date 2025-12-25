import type { FlashcardsSet } from "@src/types/flashcard";
import { formatRelativeTime } from "@src/utils";
import { Brain, Plus, Trash2 } from "lucide-react";

type FlashcardListProps = {
  flashcardsSets: FlashcardsSet[];
  handleGenerateFlashcards: () => void;
  generating: boolean;
  handleSelectSet: (set: FlashcardsSet) => void;
  handleDeleteRequest: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    set: FlashcardsSet
  ) => void;
};
const FlashcardList: React.FC<FlashcardListProps> = ({
  flashcardsSets,
  handleGenerateFlashcards,
  generating,
  handleSelectSet,
  handleDeleteRequest,
}) => {
  const handleDeleteSet = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    set: FlashcardsSet
  ) => {
    e.stopPropagation();
    handleDeleteRequest(e, set);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Your Flashcard Sets
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {flashcardsSets.length}
            {flashcardsSets.length > 1 ? " sets" : " set"} available
          </p>
        </div>
        <button
          className="group inline-flex items-center gap-2 px-6 h-12 bg-linear-to-r from-emerald-500 to-teal-500  hover:from-emerald-600 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          onClick={handleGenerateFlashcards}
          disabled={generating}
        >
          {generating ? (
            <>
              <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Plus className="size-4" strokeWidth={2} />
              Generate New Set
            </>
          )}
        </button>
      </div>
      {/* Flashcard Sets List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flashcardsSets.map((set) => {
          return (
            <div
              className="group relative bg-white/80 backdrop-blur-xl border-2 border-slate-200 hover:border-emerald-300 rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/10"
              key={set._id}
              onClick={() => handleSelectSet(set)}
            >
              <button
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-50  rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                onClick={(e) => handleDeleteSet(e, set)}
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </button>
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center size-12 rounded-xl bg-linear-to-br from-emerald-100 to-teal-100">
                  <Brain className="size-6 text-emerald-600" strokeWidth={2} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    Flashcard Sets
                  </h4>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Created {formatRelativeTime(set.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <span className="text-sm font-semibold text-emerald-700">
                      {set.cards.length}
                      {set.cards.length > 1 ? "cards" : "card"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlashcardList;
