"use client";

import { useState } from "react";
import { callOpenAI } from "../utils/openai";

interface HintInputProps {
  secretWords: string[];
  onHintsChange?: (hints: string[]) => void;
}

export default function HintInput({ secretWords, onHintsChange }: HintInputProps) {
  const [hints, setHints] = useState("");
  const [aiGuess, setAiGuess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGuessCode = async () => {
    if (!hints.trim()) {
      alert("Please enter some hints!");
      return;
    }

    if (secretWords.length < 4) {
      alert("Please generate your 4 secret words first!");
      return;
    }

    setIsLoading(true);

    try {
      // Prompt: we tell the LLM the 4 secret words and the hints, 
      // then ask it to guess the 3-digit code.
      const prompt = `
You are playing the boardgame Decrypto. Your teammate just provided his hints, and you are guessing the three numbers. Your team secret words are:
1) ${secretWords[0]}
2) ${secretWords[1]}
3) ${secretWords[2]}
4) ${secretWords[3]}

Hints: ${hints}

These hints relate to a combination of three digits (each between 1 and 4, e.g. "1 2 4"). 
Guess the most likely 3-digit code based on the hints. 
Output only the digits, nothing else.
      `.trim();

      const guess = await callOpenAI(prompt);
      setAiGuess(guess || "[Guessing]");
    } catch (error) {
      console.error("Error getting AI guess:", error);
      setAiGuess("Error occurred while getting AI guess");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="mb-6">
        <label htmlFor="hintsInput" className="block text-sm font-medium mb-2">
          Enter 3 hints (comma separated):
        </label>
        <input
          id="hintsInput"
          type="text"
          value={hints}
          onChange={(e) => {
            setHints(e.target.value);
            if (onHintsChange) {
              // Split by comma, trim whitespace
              const hintsArr = e.target.value
                .split(",")
                .map((h) => h.trim())
                .filter((h) => h.length > 0);
              onHintsChange(hintsArr);
            }
          }}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          placeholder="e.g. ocean, running, night"
        />
        <button
          onClick={handleGuessCode}
          disabled={isLoading || secretWords.length < 4}
          className="mt-3 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Thinking..." : "Ask AI to guess my code"}
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">AI&apos;s Guess for Your Code:</h3>
        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg min-h-16 flex items-center justify-center">
          {aiGuess ? (
            <p className="text-xl font-mono">{aiGuess}</p>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 italic">
              Enter hints above and click the button to get AI&apos;s guess
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
