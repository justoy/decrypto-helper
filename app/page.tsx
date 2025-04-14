"use client";

import { useState } from "react";
import ApiKeyInput from "./components/ApiKeyInput";
import SecretWords from "./components/SecretWords";
import CodeGenerator from "./components/CodeGenerator";
import HintInput from "./components/HintInput";

export default function Home() {
  const [secretWords, setSecretWords] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Decrypto Helper
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            A modern helper tool for playing the Decrypto board game
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ApiKeyInput />
          
          <SecretWords onWordsGenerated={setSecretWords} />
          
          <CodeGenerator />
          
          <HintInput secretWords={secretWords} />
        </div>
      </main>

      <footer className="bg-white dark:bg-gray-800 mt-12">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Built with Next.js and Tailwind CSS. Ready for deployment on Vercel.
          </p>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
            <a 
              href="https://github.com/yourusername/decrypto-next" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-500 transition-colors"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
