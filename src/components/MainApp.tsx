import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Sparkles,
  Send,
  BookOpen,
  Brain,
  FileText,
  Download,
  LogOut,
  Zap,
  Clock,
  Layers,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import AnimatedCharacter from "./AnimatedCharacter";
import Flashcard from "./Flashcard";
import QuizSection from "./QuizSection";
import { toast } from "@/hooks/use-toast";

interface MainAppProps {
  username: string;
  onLogout: () => void;
}

interface GeneratedContent {
  topic: string;
  summary: string;
  keyPoints: string[];
  flashcards: { question: string; answer: string }[];
  quiz: { question: string; options: string[]; answer_index: number }[];
  script: string;
  timestamp: string;
}

const MainApp = ({ username, onLogout }: MainAppProps) => {
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [animationSpeed, setAnimationSpeed] = useState([5]);
  const [cardCount, setCardCount] = useState([5]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [activeTab, setActiveTab] = useState<"animation" | "flashcards" | "quiz">("animation");

  const simulateAIAnalysis = (text: string, count: number) => {
    const sentences = text
      .split(".")
      .filter((s) => s.trim().length > 20)
      .map((s) => s.trim());

    const summary =
      sentences.slice(0, 3).join(". ") + "." || text.substring(0, 200);

    const keyPoints = sentences.slice(0, 8).map((s) => s + ".");

    const flashcards = sentences.slice(0, count).map((sentence, i) => {
      const words = sentence.split(" ");
      const snippet = words.slice(0, 6).join(" ") + (words.length > 6 ? "..." : "");
      return {
        question: `What does this statement explain: "${snippet}"?`,
        answer: sentence + ".",
      };
    });

    const quiz = sentences.slice(0, 5).map((sentence) => ({
      question: `Which option best matches: "${sentence.substring(0, 60)}..."?`,
      options: [
        sentence + ".",
        "An unrelated statement about a different concept.",
        "A statement that contradicts the explanation.",
        "None of the above options are correct.",
      ],
      answer_index: 0,
    }));

    return { summary, keyPoints, flashcards, quiz };
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !explanation.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter both a topic and explanation",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 300);

    // Simulate AI processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const result = simulateAIAnalysis(explanation, cardCount[0]);
    const script = `Welcome to our explanation of ${topic}. ${result.summary}`;

    clearInterval(progressInterval);
    setProgress(100);

    setTimeout(() => {
      setGeneratedContent({
        topic,
        summary: result.summary,
        keyPoints: result.keyPoints,
        flashcards: result.flashcards,
        quiz: result.quiz,
        script,
        timestamp: new Date().toLocaleString(),
      });
      setIsGenerating(false);
      setProgress(0);
      toast({
        title: "Content generated! 🎉",
        description: "Your animated explanation is ready",
      });
    }, 500);
  };

  const downloadFlashcards = () => {
    if (!generatedContent) return;
    const data = JSON.stringify(generatedContent.flashcards, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedContent.topic}_flashcards.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadSummary = () => {
    if (!generatedContent) return;
    const text = `Topic: ${generatedContent.topic}\n\nSummary:\n${generatedContent.summary}\n\nKey Points:\n${generatedContent.keyPoints.map((p, i) => `${i + 1}. ${p}`).join("\n")}`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${generatedContent.topic}_summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-border/50"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral to-purple flex items-center justify-center"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-foreground" />
            </motion.div>
            <h1 className="font-display text-xl font-bold gradient-text">
              AI Explainer
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">
              Welcome, <span className="text-foreground font-semibold">{username}</span>
            </span>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold gradient-text">
            Transform Complex Topics
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Enter any topic and explanation to generate interactive animations,
            flashcards, and quizzes powered by AI
          </p>
        </motion.section>

        {/* Input Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-3xl p-6 md:p-8"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* Input Fields */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <BookOpen className="w-4 h-4 text-coral" />
                  Topic Title
                </label>
                <Input
                  placeholder="e.g., Quantum Computing, Machine Learning, etc."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <FileText className="w-4 h-4 text-teal" />
                  Detailed Explanation
                </label>
                <Textarea
                  placeholder="Enter a detailed explanation of the topic..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="min-h-[180px]"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <Clock className="w-4 h-4 text-purple" />
                  Animation Speed: {animationSpeed[0]}s
                </label>
                <Slider
                  value={animationSpeed}
                  onValueChange={setAnimationSpeed}
                  min={3}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                  <Layers className="w-4 h-4 text-gold" />
                  Flashcard Count: {cardCount[0]}
                </label>
                <Slider
                  value={cardCount}
                  onValueChange={setCardCount}
                  min={3}
                  max={10}
                  step={1}
                  className="w-full"
                />
              </div>

              <Button
                variant="glow"
                size="lg"
                className="w-full"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Explanation
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-coral to-purple"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    {progress < 30
                      ? "Analyzing content..."
                      : progress < 60
                      ? "Creating animations..."
                      : progress < 90
                      ? "Generating flashcards..."
                      : "Finalizing..."}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.section>

        {/* Generated Content */}
        <AnimatePresence>
          {generatedContent && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              className="space-y-8"
            >
              {/* Summary Card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 border-2 border-teal/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal to-secondary flex items-center justify-center flex-shrink-0">
                    <Brain className="w-6 h-6 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-xl font-bold gradient-text-secondary mb-2">
                      AI-Generated Summary
                    </h3>
                    <p className="text-foreground leading-relaxed">
                      {generatedContent.summary}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Generated: {generatedContent.timestamp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex gap-2 p-1 bg-muted/50 rounded-xl">
                {[
                  { id: "animation", label: "Animation", icon: Sparkles },
                  { id: "flashcards", label: "Flashcards", icon: Layers },
                  { id: "quiz", label: "Quiz", icon: Brain },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-coral to-purple text-foreground shadow-lg"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === "animation" && (
                  <motion.div
                    key="animation"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <AnimatedCharacter
                      topic={generatedContent.topic}
                      keyPoints={generatedContent.keyPoints}
                      script={generatedContent.script}
                      animationDuration={animationSpeed[0]}
                    />
                  </motion.div>
                )}

                {activeTab === "flashcards" && (
                  <motion.div
                    key="flashcards"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-2xl font-bold gradient-text">
                        Smart Flashcards
                      </h3>
                      <Button variant="glass" size="sm" onClick={downloadFlashcards}>
                        <Download className="w-4 h-4" />
                        Download JSON
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {generatedContent.flashcards.map((card, i) => (
                        <Flashcard
                          key={i}
                          question={card.question}
                          answer={card.answer}
                          index={i}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === "quiz" && (
                  <motion.div
                    key="quiz"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    <h3 className="font-display text-2xl font-bold gradient-text">
                      Knowledge Quiz
                    </h3>
                    <QuizSection questions={generatedContent.quiz} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Download Actions */}
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="teal" onClick={downloadSummary}>
                  <Download className="w-4 h-4" />
                  Download Summary
                </Button>
                <Button variant="coral" onClick={downloadFlashcards}>
                  <Download className="w-4 h-4" />
                  Download Flashcards
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Features List (when no content) */}
        {!generatedContent && !isGenerating && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid md:grid-cols-3 gap-6 pt-8"
          >
            {[
              {
                icon: Sparkles,
                title: "Interactive Animations",
                description: "Engaging character animations with voice-over",
                color: "coral",
              },
              {
                icon: Layers,
                title: "Smart Flashcards",
                description: "Auto-generated study cards with flip animation",
                color: "teal",
              },
              {
                icon: Brain,
                title: "Knowledge Quizzes",
                description: "Test your understanding with MCQ questions",
                color: "purple",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="glass-card rounded-2xl p-6 text-center group hover:scale-105 transition-transform duration-300"
              >
                <div
                  className={`w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                    feature.color === "coral"
                      ? "bg-gradient-to-br from-coral to-coral-light"
                      : feature.color === "teal"
                      ? "bg-gradient-to-br from-teal to-teal-light"
                      : "bg-gradient-to-br from-purple to-purple-light"
                  }`}
                >
                  <feature.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.section>
        )}
      </main>
    </div>
  );
};

export default MainApp;
