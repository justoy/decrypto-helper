"use client";
import { useState } from "react";

interface RoundData {
  hints: string[];
  code: string; // e.g. "4,1,2"
}

/** Renders a single row in the first table: Round #, 3 hints, code. */
function RoundRow({
  roundIndex,
  roundData,
  onChange,
}: {
  roundIndex: number;
  roundData: RoundData;
  onChange: (field: "hints" | "code", value: string | string[]) => void;
}) {
  // Update a single hint (among the 3)
  const handleHintChange = (hintIndex: number, newHint: string) => {
    const updatedHints = [...roundData.hints];
    updatedHints[hintIndex] = newHint;
    onChange("hints", updatedHints);
  };

  return (
    <tr className="border-b border-gray-300">
      <td className="px-2 py-1 text-center">{roundIndex + 1}</td>
      {roundData.hints.map((hint, i) => (
        <td key={i} className="px-2 py-1">
          <input
            type="text"
            className="border rounded w-full p-1"
            value={hint}
            onChange={(e) => handleHintChange(i, e.target.value)}
            placeholder={`Hint ${i + 1}`}
          />
        </td>
      ))}
      <td className="px-2 py-1">
        <input
          type="text"
          className="border rounded w-full p-1"
          value={roundData.code}
          onChange={(e) => onChange("code", e.target.value)}
          placeholder="Code (e.g. 4,1,2)"
        />
      </td>
    </tr>
  );
}

/**
 * Main Decrypto board with:
 * - First table: 8 rounds, each has 3 hints + code
 * - Second table: groups the 3 hints from each round by the code digit.
 */
export default function DecryptoBoard() {
  const [rounds, setRounds] = useState<RoundData[]>(
    Array.from({ length: 8 }, () => ({
      hints: ["", "", ""],
      code: "",
    }))
  );

  /** Handle updates to hints or code for a specific round. */
  const handleRoundChange = (
    roundIndex: number,
    field: "hints" | "code",
    value: string | string[]
  ) => {
    setRounds((prev) => {
      const updated = [...prev];
      if (field === "hints") {
        updated[roundIndex].hints = value as string[];
      } else {
        updated[roundIndex].code = value as string;
      }
      return updated;
    });
  };

  /**
   * The second table: For each round, parse the code (e.g. "4.1.2").
   * Then we put each hint into the correct word‐number column (#1–#4).
   */
  const renderSecondTableBody = () => {
    return rounds.map((roundData, roundIndex) => {
      // Each row has up to 4 columns for word #1, #2, #3, #4
      // Start them all empty:
      const wordSlots = ["", "", "", ""];

      // Parse the code "4.1.2" => ["4", "1", "2"]
      const codeDigits = roundData.code
        .split(",")
        .map((part) => parseInt(part.trim(), 10))
        .filter((num) => !isNaN(num) && num >= 1 && num <= 4);

      // For each digit in the code, place the corresponding hint.
      //   codeDigits[i] => which word number (1-based)
      //   roundData.hints[i] => the i-th hint
      codeDigits.forEach((digit, i) => {
        if (i < roundData.hints.length) {
          // digit is 1-based, so digit=4 => index 3
          const slotIndex = digit - 1; 
          wordSlots[slotIndex] = roundData.hints[i];
        }
      });

      return (
        <tr key={roundIndex} className="border-b border-gray-300">
          <td className="px-2 py-1 text-center">{roundIndex + 1}</td>
          <td className="px-2 py-1">{wordSlots[0]}</td>
          <td className="px-2 py-1">{wordSlots[1]}</td>
          <td className="px-2 py-1">{wordSlots[2]}</td>
          <td className="px-2 py-1">{wordSlots[3]}</td>
        </tr>
      );
    });
  };

  return (
    <div className="p-4 border border-gray-200 rounded-md shadow-sm bg-white dark:bg-gray-800">
      {/* FIRST TABLE */}
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Decrypto Rounds (Hints + Code)
      </h2>
      <table className="w-full mb-8 border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="px-2 py-1">Round</th>
            <th className="px-2 py-1">Hint 1</th>
            <th className="px-2 py-1">Hint 2</th>
            <th className="px-2 py-1">Hint 3</th>
            <th className="px-2 py-1">Code</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((roundData, idx) => (
            <RoundRow
              key={idx}
              roundIndex={idx}
              roundData={roundData}
              onChange={(field, value) => handleRoundChange(idx, field, value)}
            />
          ))}
        </tbody>
      </table>

      {/* SECOND TABLE */}
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Hints by Secret Word Number
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-400">
            <th className="px-2 py-1">Round</th>
            <th className="px-2 py-1">Word #1</th>
            <th className="px-2 py-1">Word #2</th>
            <th className="px-2 py-1">Word #3</th>
            <th className="px-2 py-1">Word #4</th>
          </tr>
        </thead>
        <tbody>{renderSecondTableBody()}</tbody>
      </table>
    </div>
  );
}
