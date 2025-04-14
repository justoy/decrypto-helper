"use client";

import { useState, useEffect } from "react";

export default function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  // Load API key from localStorage on component mount
  useEffect(() => {
    const savedKey = localStorage.getItem("OPENAI_API_KEY") || "";
    setApiKey(savedKey);
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem("OPENAI_API_KEY", apiKey.trim());
    setIsSaved(true);
    
    // Reset the "Saved" indicator after 2 seconds
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Step 1: Enter your OpenAI API Key</h2>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk-..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        />
        <button
          onClick={handleSaveApiKey}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isSaved
              ? "bg-green-500 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isSaved ? "Saved!" : "Save"}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 dark:text-gray-400">
        Your API key is stored locally in your browser and never sent to our servers.
      </p>
    </div>
  );
}
