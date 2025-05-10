import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { generateText, categories, getAvailableCategories } from '@/utils/textGenerator';
import Leaderboard from './Leaderboard';
import VirtualKeyboard from './VirtualKeyboard';

interface Score {
  wpm: number;
  accuracy: number;
  date: string;
}

interface TypingTestProps {
  text: string;
  onComplete: (wpm: number, accuracy: number) => void;
}

// Utility functions moved outside component to prevent recreating on each render
const calculateWPM = (wordCount: number, timeInMinutes: number): number => {
  return Math.round(wordCount / timeInMinutes);
};

const calculateAccuracy = (input: string, originalText: string, totalKeystrokes: number): number => {
  if (!input.length) return 0;
  const correctChars = input.split('').filter((char, i) => char === originalText[i]).length;
  // Calculate accuracy based on total keystrokes including errors
  return Math.round((correctChars / totalKeystrokes) * 100);
};

export default function TypingTest({ text, onComplete }: TypingTestProps) {
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentStats, setCurrentStats] = useState({ wpm: 0, accuracy: 0 });
  const [errors, setErrors] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>(categories.TECHNOLOGY);
  const [currentText, setCurrentText] = useState(() => generateText(categories.TECHNOLOGY));
  const [showCompletionMenu, setShowCompletionMenu] = useState(false);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Refs for performance optimization
  const statsUpdateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const lastStatsUpdateRef = useRef<number>(0);
  
  // Reset function to reuse
  const resetTest = useCallback((newText?: string) => {
    setInput('');
    setStartTime(null);
    setIsComplete(false);
    setCurrentWordIndex(0);
    setCurrentStats({ wpm: 0, accuracy: 0 });
    setErrors(0);
    setTotalKeystrokes(0);
    setShowCompletionMenu(false);
    if (newText) {
      setCurrentText(newText);
    }
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    resetTest();
  }, [resetTest]);

  // Handle new text
  const handleNewText = useCallback(() => {
    const newText = generateText(selectedCategory);
    resetTest(newText);
  }, [selectedCategory, resetTest]);

  // Generate new text when category changes
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    const newText = generateText(category);
    resetTest(newText);
  }, [resetTest]);

  // Memoize words array and joined text
  const words = useMemo(() => currentText.split(' '), [currentText]);
  const joinedText = useMemo(() => words.join(' '), [words]);

  // Update stats in real-time
  const updateStats = useCallback(() => {
    if (!startTime) return;
    
    const now = Date.now();
    if (now - lastStatsUpdateRef.current < 200) return;
    
    const timeInMinutes = (now - startTime) / 60000;
    const wordsTyped = input.trim().split(' ').length;
    
    const currentWpm = calculateWPM(wordsTyped, timeInMinutes);
    const currentAccuracy = calculateAccuracy(input, joinedText, totalKeystrokes);
    
    setCurrentStats({ wpm: currentWpm, accuracy: currentAccuracy });
    lastStatsUpdateRef.current = now;

    // Auto-complete when reaching the end
    if (input.length >= joinedText.length) {
      handleComplete();
    }
  }, [input, startTime, joinedText, totalKeystrokes]);

  // Load high scores from localStorage on mount
  useEffect(() => {
    const savedScores = localStorage.getItem('typingHighScores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Update high scores
  const updateHighScores = useCallback((wpm: number, accuracy: number) => {
    const newScore: Score = {
      wpm,
      accuracy,
      date: new Date().toISOString()
    };

    setHighScores(prevScores => {
      const allScores = [...prevScores, newScore];
      // Sort by WPM in descending order
      const sortedScores = allScores.sort((a, b) => b.wpm - a.wpm);
      // Keep only top 3
      const topScores = sortedScores.slice(0, 3);
      // Save to localStorage
      localStorage.setItem('typingHighScores', JSON.stringify(topScores));
      return topScores;
    });
  }, []);

  const handleComplete = useCallback(() => {
    if (!startTime || isComplete) return;
    
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = input.trim().split(' ').length;
    
    const finalWpm = calculateWPM(wordsTyped, timeInMinutes);
    const finalAccuracy = calculateAccuracy(input, text, totalKeystrokes);
    
    setIsComplete(true);
    setShowCompletionMenu(true);
    onComplete(finalWpm, finalAccuracy);
    updateHighScores(finalWpm, finalAccuracy);
  }, [startTime, isComplete, input, text, totalKeystrokes, onComplete, updateHighScores]);

  // Stats update effect
  useEffect(() => {
    if (!startTime || isComplete) return;
    updateStats();
    statsUpdateTimeoutRef.current = setTimeout(updateStats, 200);
    return () => {
      if (statsUpdateTimeoutRef.current) {
        clearTimeout(statsUpdateTimeoutRef.current);
      }
    };
  }, [updateStats, startTime, isComplete]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    // Calculate errors using joined text
    const newErrors = newInput.split('').reduce((count, char, i) => (
      count + (char !== joinedText[i] && joinedText[i] ? 1 : 0)
    ), 0);

    // Update total keystrokes (includes both correct and incorrect keystrokes)
    setTotalKeystrokes(prev => prev + 1);
    setErrors(newErrors);
    setInput(newInput);
    
    const currentWordCount = newInput.trim().split(' ').length;
    setCurrentWordIndex(currentWordCount - 1);
  }, [startTime, joinedText]);

  // Render the words with proper styling
  const renderedWords = words.map((word, index) => (
    <span
      key={index}
      className={`mx-2 px-2 py-1 rounded ${
        index < currentWordIndex
          ? 'text-emerald-500'
          : index === currentWordIndex
          ? 'bg-purple-100 text-purple-900'
          : 'text-gray-700'
      }`}
    >
      {word}
    </span>
  ));

  return (
    <div className="min-h-screen w-full max-w-5xl mx-auto p-12 space-y-16 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900 via-fuchsia-900 to-pink-900 animate-gradient-shift">
      {/* Header with animation */}
      <div className="text-center space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-transparent bg-clip-text animate-gradient-text">
            Speed Typing Test
          </h1>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-purple-900 flex items-center gap-2"
          >
            <span>🏆</span> Leaderboard
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-8 p-16">
        <div className="stat-card">
          <div className="text-4xl font-bold text-pink-300 tabular-nums animate-number">
            {currentStats.wpm}
          </div>
          <div className="text-sm font-medium text-pink-300/70">WPM</div>
        </div>
        <div className="stat-card">
          <div className="text-4xl font-bold text-purple-300 tabular-nums animate-number">
            {currentStats.accuracy}%
          </div>
          <div className="text-sm font-medium text-purple-300/70">Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="text-4xl font-bold text-indigo-300 tabular-nums animate-number">
            {errors}
          </div>
          <div className="text-sm font-medium text-indigo-300/70">Errors</div>
        </div>
      </div>

      {/* Text Display */}
      <div className="p-6 bg-white/10 rounded-lg">
        <div className="text-xl leading-relaxed">
          {renderedWords}
        </div>
      </div>

      {/* Input Area */}
      <div className="relative animate-slide-up">
        <textarea
          className="w-full p-6 text-lg bg-purple-900/30 backdrop-blur-sm rounded-2xl border-2 border-purple-500/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent text-purple-100 shadow-xl transition-all duration-300 font-mono hover:shadow-2xl focus:shadow-2xl"
          value={input}
          onChange={handleInput}
          placeholder="Start typing..."
          disabled={isComplete}
          rows={4}
          autoFocus
        />
        {!startTime && !showCompletionMenu && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-900/5 rounded-2xl backdrop-blur-sm">
            <p className="text-lg font-medium text-purple-200 animate-bounce-subtle">
              Click here to start typing
            </p>
          </div>
        )}

        {/* Completion Menu */}
        {showCompletionMenu && (
          <div className="absolute inset-0 flex items-center justify-center bg-purple-900/10 rounded-2xl backdrop-blur-sm animate-fade-scale">
            <div className="flex gap-4 animate-slide-up">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 dark:focus:ring-offset-purple-900"
              >
                Try Again
              </button>
              <button
                onClick={handleNewText}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-purple-900"
              >
                New Text
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      <div className="mt-8">
        <VirtualKeyboard onType={(key) => setInput(input + key)} />
      </div>

      {/* Category Selection */}
      <div className="text-center space-y-6 animate-fade-in">
        <p className="text-purple-200 animate-slide-up">
          Test your typing speed and accuracy with meaningful sentences
        </p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap mt-4">
          {getAvailableCategories().map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? 'bg-pink-500/20 text-pink-300 scale-105 shadow-lg animate-selected'
                  : 'bg-purple-800/30 text-purple-300 hover:bg-purple-700/30'
              }`}
            >
              {category.replace('_', ' ').charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="fixed inset-0 flex items-center justify-center bg-purple-900/50 backdrop-blur-sm z-50">
          <div className="relative transform transition-all duration-300 scale-100">
            <div className="relative bg-purple-800/90 rounded-2xl shadow-2xl border border-purple-500/20">
              <button
                onClick={() => setShowLeaderboard(false)}
                className="absolute top-4 right-4 text-purple-300 hover:text-purple-100"
              >
                ✕
              </button>
              <div className="p-6">
                <Leaderboard scores={highScores} />
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .stat-card {
          @apply flex flex-col items-center justify-center p-6 rounded-2xl shadow-lg border border-purple-500/20 transition-all duration-300 hover:scale-105 hover:shadow-xl backdrop-blur-sm bg-purple-900/30;
        }

        @keyframes gradient-shift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }

        @keyframes gradient-text {
          0% { background-size: 100%; }
          50% { background-size: 200%; }
          100% { background-size: 100%; }
        }

        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        @keyframes fade-scale {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes slide-up {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }

        .animate-gradient-text {
          background-size: 200% auto;
          animation: gradient-text 4s ease infinite;
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }

        .animate-pulse-subtle {
          animation: pulse-subtle 2s ease-in-out infinite;
        }

        .animate-fade-scale {
          animation: fade-scale 0.3s ease-out forwards;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        .animate-number {
          transition: all 0.3s ease-out;
        }

        .animate-selected {
          animation: selected 0.3s ease-out forwards;
        }

        @keyframes selected {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
} 