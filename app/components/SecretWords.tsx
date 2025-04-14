"use client";

import { useState } from "react";
import { callOpenAI } from "../utils/openai";

interface SecretWordsProps {
  onWordsGenerated: (words: string[]) => void;
}

export default function SecretWords({ onWordsGenerated }: SecretWordsProps) {
  const [words, setWords] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const generateWords = async () => {
    setIsLoading(true);
    
    const prompt = `Generate 4 random, distinct English words for a code-guessing game. Output them with one word per line. Don't include anything else in your response. Only four lines, one word per line.`;
    
    try {
      const result = await callOpenAI(prompt);
      
      // Split lines, trim, and remove empties
      const generatedWords = result.split("\n").map(w => w.trim()).filter(Boolean);
      
      // Make sure we have exactly 4 words
      if (generatedWords.length === 4) {
        setWords(generatedWords);
        onWordsGenerated(generatedWords);
      } else {
        alert("Error: Didn't receive exactly 4 words. Please try again.");
      }
    } catch (error) {
      console.error("Error generating words:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Your 4 Secret Words</h2>
      
      <button
        onClick={generateWords}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isLoading ? "Generating..." : "Generate 4 Words"}
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
      
      {words.length === 0 && !isLoading && (
        <p className="text-gray-500 dark:text-gray-400 italic">
          Click the button to generate your team's secret words.
        </p>
      )}
    </div>
  );
}
