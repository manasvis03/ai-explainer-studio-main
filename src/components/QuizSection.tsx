import { motion } from "framer-motion";
import { useState } from "react";
import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { Button } from "./ui/button";

interface QuizQuestion {
  question: string;
  options: string[];
  answer_index: number;
}

interface QuizSectionProps {
  questions: QuizQuestion[];
}

const QuizSection = ({ questions }: QuizSectionProps) => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer_index) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers(new Array(questions.length).fill(null));
    setSubmitted(false);
    setScore(0);
  };

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="space-y-6">
      {/* Score Banner */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`glass-card rounded-2xl p-6 text-center ${
            percentage >= 70
              ? "border-2 border-teal/50"
              : percentage >= 40
              ? "border-2 border-gold/50"
              : "border-2 border-coral/50"
          }`}
        >
          <Trophy
            className={`w-12 h-12 mx-auto mb-3 ${
              percentage >= 70
                ? "text-teal"
                : percentage >= 40
                ? "text-gold"
                : "text-coral"
            }`}
          />
          <h3 className="font-display text-2xl font-bold gradient-text mb-2">
            Your Score: {score}/{questions.length}
          </h3>
          <p className="text-muted-foreground">
            {percentage >= 70
              ? "Excellent work! You've mastered this topic! 🎉"
              : percentage >= 40
              ? "Good effort! Keep practicing! 💪"
              : "Keep learning! You'll get there! 📚"}
          </p>
          <Button variant="coral" className="mt-4" onClick={handleReset}>
            Try Again
          </Button>
        </motion.div>
      )}

      {/* Questions */}
      {questions.map((q, qIndex) => (
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: qIndex * 0.1 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-start gap-4 mb-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-coral to-purple flex items-center justify-center font-display font-bold text-foreground">
              {qIndex + 1}
            </span>
            <h4 className="text-lg font-semibold text-foreground">{q.question}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-14">
            {q.options.map((option, oIndex) => {
              const isSelected = answers[qIndex] === oIndex;
              const isCorrect = q.answer_index === oIndex;
              const showResult = submitted;

              let optionStyle = "border-border hover:border-primary/50";
              if (showResult) {
                if (isCorrect) {
                  optionStyle = "border-teal bg-teal/10";
                } else if (isSelected && !isCorrect) {
                  optionStyle = "border-destructive bg-destructive/10";
                }
              } else if (isSelected) {
                optionStyle = "border-primary bg-primary/10";
              }

              return (
                <motion.button
                  key={oIndex}
                  whileHover={{ scale: submitted ? 1 : 1.02 }}
                  whileTap={{ scale: submitted ? 1 : 0.98 }}
                  onClick={() => handleSelect(qIndex, oIndex)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all duration-300 ${optionStyle}`}
                  disabled={submitted}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {String.fromCharCode(65 + oIndex)}
                    </span>
                    <span className="flex-1 text-foreground">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-teal" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      ))}

      {/* Submit Button */}
      {!submitted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center pt-4"
        >
          <Button
            variant="glow"
            size="lg"
            onClick={handleSubmit}
            disabled={answers.some((a) => a === null)}
          >
            <CheckCircle2 className="w-5 h-5" />
            Check Answers
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default QuizSection;
