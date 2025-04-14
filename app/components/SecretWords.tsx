"use client";

import { useState } from "react";
import {WORDS_LIBRARY} from "../data/words"

interface SecretWordsProps {
  onWordsGenerated: (words: string[]) => void;
}

export default function SecretWords({ onWordsGenerated }: SecretWordsProps) {
  const [words, setWords] = useState<string[]>([]);

  const generateWords = () => {
    const generatedWords: string[] = [];
    while (generatedWords.length < 4) {
      const randomIndex = Math.floor(Math.random() * WORDS_LIBRARY.length);
      const word = WORDS_LIBRARY[randomIndex];
      if (!generatedWords.includes(word)) {
        generatedWords.push(word);
      }
    }
    setWords(generatedWords);
    onWordsGenerated(generatedWords);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Your 4 Secret Words</h2>
      
      <button
        onClick={generateWords}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors mb-4"
      >
        Generate 4 Words
      </button>
      
      {words.length > 0 && (
        <ol className="list-decimal pl-6 space-y-2">
          {words.map((word, index) => (
            <li key={index} className="text-lg font-medium">
              {word}
            </li>
          ))}
        </ol>
      )}
      
      {words.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 italic">
          Click the button to generate your team&apos;s secret words.
        </p>
      )}
    </div>
  );
}
