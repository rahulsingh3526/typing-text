'use client';

import { useState, useCallback } from 'react';
import TypingTest from '@/components/TypingTest';
import Results from '@/components/Results';
import { generateText } from '@/utils/textGenerator';

export default function Home() {
  const [text, setText] = useState(generateText);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState({ wpm: 0, accuracy: 0 });

  const handleComplete = useCallback((wpm: number, accuracy: number) => {
    setResults({ wpm, accuracy });
    setShowResults(true);
  }, []);

  const handleRestart = useCallback(() => {
    setText(generateText()); // Generate new random text
    setShowResults(false);
  }, []);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          Typist
        </h1>
        <p className="text-center mb-8 text-gray-600 dark:text-gray-400">
          Improve your typing speed and accuracy
        </p>

        {!showResults ? (
          <TypingTest text={text} onComplete={handleComplete} />
        ) : (
          <Results
            wpm={results.wpm}
            accuracy={results.accuracy}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  );
}
