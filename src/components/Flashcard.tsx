import { motion } from "framer-motion";
import { useState } from "react";
import { RotateCcw } from "lucide-react";

interface FlashcardProps {
  question: string;
  answer: string;
  index: number;
}

const Flashcard = ({ question, answer, index }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      className="relative w-full h-64 cursor-pointer perspective-1000"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Question */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between backface-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--coral)) 0%, hsl(var(--purple)) 100%)",
            backfaceVisibility: "hidden",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-foreground/80 bg-white/20 px-3 py-1 rounded-full">
                Card {index + 1}
              </span>
              <RotateCcw className="w-5 h-5 text-foreground/60" />
            </div>
            <span className="text-xs uppercase tracking-wider text-foreground/70 font-semibold">
              Question
            </span>
          </div>
          <p className="text-foreground text-lg font-semibold leading-relaxed">
            {question}
          </p>
          <p className="text-xs text-foreground/60 text-center">
            Click to reveal answer
          </p>
        </div>

        {/* Back - Answer */}
        <div
          className="absolute inset-0 rounded-2xl p-6 flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, hsl(var(--teal)) 0%, hsl(var(--secondary)) 100%)",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-foreground/80 bg-white/20 px-3 py-1 rounded-full">
                Card {index + 1}
              </span>
              <RotateCcw className="w-5 h-5 text-foreground/60" />
            </div>
            <span className="text-xs uppercase tracking-wider text-foreground/70 font-semibold">
              Answer
            </span>
          </div>
          <p className="text-foreground text-base font-medium leading-relaxed">
            {answer}
          </p>
          <p className="text-xs text-foreground/60 text-center">
            Click to see question
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Flashcard;
