"use client";

import { useState } from "react";

interface CodeGeneratorProps {
  onCodeGenerated?: (code: number[]) => void;
}

export default function CodeGenerator({ onCodeGenerated }: CodeGeneratorProps) {
  const [code, setCode] = useState<number[]>([]);

  const generateCode = () => {
    // Start with an array [1, 2, 3, 4]
    const arr = [1, 2, 3, 4];
    
    // Shuffle the array
    arr.sort(() => Math.random() - 0.5);
    
    // Slice off the first 3
    const newCode = arr.slice(0, 3);
    
    // Update state
    setCode(newCode);
    
    // Call the callback if provided
    if (onCodeGenerated) {
      onCodeGenerated(newCode);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Current Turn</h2>
      
      <button
        onClick={generateCode}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors mb-4"
      >
        Generate 3 Random Numbers
      </button>
      
      {code.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <p className="text-lg font-bold">Code: <span className="font-mono">{code.join(" ")}</span></p>
        </div>
      )}
    </div>
  );
}
