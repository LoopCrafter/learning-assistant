import { useState } from "react";

type FlashcardProps = {
  flashcard: any;
  onToggleStar: () => void;
};

const Flashcard: React.FC<FlashcardProps> = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlipped = () => {
    setIsFlipped((prev) => !prev);
  };
  return <div>Flashcard</div>;
};

export default Flashcard;
