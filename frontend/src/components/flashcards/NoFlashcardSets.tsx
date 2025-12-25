import { Brain, Sparkles } from "lucide-react";

type NoFlashcardsetsProps = {
  handleGenerateFlashcards: () => void;
  generating: boolean;
};
const NoFlashcardSets: React.FC<NoFlashcardsetsProps> = ({
  handleGenerateFlashcards,
  generating,
}) => {
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

export default NoFlashcardSets;
