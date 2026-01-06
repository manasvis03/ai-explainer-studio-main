import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback, useRef } from "react";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import { Button } from "./ui/button";

interface AnimatedCharacterProps {
  topic: string;
  keyPoints: string[];
  script: string;
  animationDuration?: number;
}

const AnimatedCharacter = ({
  topic,
  keyPoints,
  script,
  animationDuration = 5,
}: AnimatedCharacterProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [displayedText, setDisplayedText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speak = useCallback((text: string): Promise<void> => {
    return new Promise((resolve) => {
      if (!voiceEnabled || !("speechSynthesis" in window)) {
        // If voice disabled, resolve after animation duration
        setTimeout(resolve, animationDuration * 1000);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      // Get voices (may need to wait for them to load)
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(
          (v) => v.lang?.startsWith("en") && v.name?.toLowerCase().includes("female")
        ) || voices.find((v) => v.lang?.startsWith("en")) || voices[0];
        if (englishVoice) utterance.voice = englishVoice;
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice();
      } else {
        window.speechSynthesis.onvoiceschanged = setVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        resolve();
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }, [voiceEnabled, animationDuration]);

  const typeText = useCallback((text: string, onComplete?: () => void) => {
    setDisplayedText("");
    const words = text.split(" ");
    let i = 0;
    const interval = setInterval(() => {
      if (i < words.length) {
        setDisplayedText(words.slice(0, i + 1).join(" "));
        i++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const playCurrentPoint = useCallback(async () => {
    if (!isPlaying || isPaused) return;

    const currentText = keyPoints[currentIndex] || script;
    
    // Start typing animation
    const cleanupTyping = typeText(currentText);
    
    // Wait for speech to complete
    await speak(currentText);
    
    cleanupTyping();

    // Small delay between points
    await new Promise(resolve => setTimeout(resolve, 500));

    // Move to next point or finish
    if (currentIndex < keyPoints.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsPlaying(false);
      setDisplayedText("Explanation complete! Click Start to replay.");
    }
  }, [isPlaying, isPaused, currentIndex, keyPoints, script, typeText, speak]);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      playCurrentPoint();
    }
  }, [isPlaying, isPaused, currentIndex, playCurrentPoint]);

  const handleStart = () => {
    if (currentIndex >= keyPoints.length - 1 || !isPlaying) {
      setCurrentIndex(0);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    if ("speechSynthesis" in window) {
      if (isPaused) {
        window.speechSynthesis.resume();
      } else {
        window.speechSynthesis.pause();
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentIndex(0);
    setDisplayedText("Click Start to begin the animated explanation");
    setIsSpeaking(false);
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if ("speechSynthesis" in window && voiceEnabled) {
      window.speechSynthesis.cancel();
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-coral/5" />
      
      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-center">
        {/* Character Scene */}
        <div className="relative w-full lg:w-1/2 h-80 flex items-center justify-center">
          {/* Lightbulb */}
          <motion.div
            className="absolute top-4 left-1/2 text-5xl z-20"
            animate={{
              scale: isSpeaking ? [0.8, 1.2, 0.8] : 0,
              opacity: isSpeaking ? 1 : 0,
            }}
            transition={{
              duration: 1,
              repeat: isSpeaking ? Infinity : 0,
              ease: "easeInOut",
            }}
            style={{ marginLeft: -24 }}
          >
            💡
          </motion.div>

          {/* Character */}
          <motion.div
            className="relative"
            animate={{
              y: isPlaying && !isPaused ? [0, -8, 0] : 0,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Head */}
            <div className="relative w-24 h-28 mx-auto">
              {/* Hair */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-10 bg-amber-800 rounded-t-full border-2 border-foreground/80" />
              {/* Face */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-28 bg-amber-200 rounded-[45%_45%_40%_40%] border-2 border-foreground/80">
                {/* Eyebrows */}
                <motion.div
                  className="absolute top-6 left-5 w-5 h-1 bg-foreground/80 rounded"
                  animate={{ y: isSpeaking ? [0, -3, 0] : 0 }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute top-6 right-5 w-5 h-1 bg-foreground/80 rounded"
                  animate={{ y: isSpeaking ? [0, -3, 0] : 0 }}
                  transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                />
                {/* Eyes */}
                <div className="absolute top-10 left-5 w-4 h-4 bg-foreground rounded-full">
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-foreground/0 rounded-full" />
                </div>
                <div className="absolute top-10 right-5 w-4 h-4 bg-foreground rounded-full">
                  <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-foreground/0 rounded-full" />
                </div>
                {/* Mouth - animated when speaking */}
                <motion.div 
                  className="absolute top-16 left-1/2 -translate-x-1/2 w-8 border-2 border-foreground/80 border-t-0 rounded-b-full"
                  animate={{ 
                    height: isSpeaking ? [4, 8, 4, 6, 4] : 4,
                  }}
                  transition={{ 
                    duration: 0.3, 
                    repeat: isSpeaking ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </div>

            {/* Body */}
            <div className="relative w-20 h-24 mx-auto mt-1 bg-teal rounded-xl border-2 border-foreground/80" />

            {/* Arms */}
            <motion.div
              className="absolute top-32 left-0 w-12 h-3 bg-amber-200 rounded-full border border-foreground/80 origin-right"
              animate={{ rotate: isSpeaking ? [-30, -10, -30] : -30 }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ transformOrigin: "right center" }}
            />
            <motion.div
              className="absolute top-32 right-0 w-12 h-3 bg-amber-200 rounded-full border border-foreground/80 origin-left"
              animate={{ rotate: isSpeaking ? [30, 10, 30] : 30 }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
              style={{ transformOrigin: "left center" }}
            />

            {/* Legs */}
            <div className="flex gap-2 justify-center mt-1">
              <div className="w-4 h-20 bg-foreground/80 rounded-full" />
              <div className="w-4 h-20 bg-foreground/80 rounded-full" />
            </div>
          </motion.div>

          {/* Speech Bubble */}
          <AnimatePresence>
            <motion.div
              className="absolute right-0 top-10 lg:right-4 w-56 bg-card border-2 border-border text-foreground rounded-2xl p-4 shadow-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: isPlaying ? 1 : 0.9, 
                opacity: isPlaying ? 1 : 0.7,
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Bubble tail */}
              <div className="absolute -left-4 top-10 w-0 h-0 border-r-[16px] border-r-border border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent" />
              <p className="text-sm font-medium leading-relaxed text-foreground">
                {displayedText || "Click Start to begin!"}
              </p>
              {isSpeaking && (
                <motion.div 
                  className="flex gap-1 mt-2 justify-end"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-coral"
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls & Info */}
        <div className="w-full lg:w-1/2 space-y-4">
          <h3 className="font-display text-xl font-bold gradient-text">{topic}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{script}</p>

          {/* Progress Indicator */}
          <div className="flex gap-2">
            {keyPoints.map((_, i) => (
              <motion.div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i === currentIndex
                    ? "bg-gradient-to-r from-coral to-purple"
                    : i < currentIndex
                    ? "bg-teal"
                    : "bg-muted"
                }`}
                animate={{
                  scale: i === currentIndex && isSpeaking ? [1, 1.1, 1] : 1,
                }}
                transition={{ duration: 0.5, repeat: i === currentIndex && isSpeaking ? Infinity : 0 }}
              />
            ))}
          </div>

          {/* Status */}
          <div className="text-xs text-muted-foreground">
            {isSpeaking ? (
              <span className="text-coral">🔊 Speaking point {currentIndex + 1} of {keyPoints.length}...</span>
            ) : isPlaying ? (
              <span className="text-teal">Preparing next point...</span>
            ) : (
              <span>Ready to explain</span>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-3">
            <Button
              variant="coral"
              size="sm"
              onClick={handleStart}
              disabled={isPlaying && !isPaused}
            >
              <Play className="w-4 h-4" />
              Start
            </Button>
            <Button
              variant="glass"
              size="sm"
              onClick={handlePause}
              disabled={!isPlaying}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="glass" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <Button
              variant={voiceEnabled ? "teal" : "glass"}
              size="sm"
              onClick={toggleVoice}
            >
              {voiceEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
              Voice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimatedCharacter;
