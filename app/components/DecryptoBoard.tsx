"use client";
import { useState } from "react";

interface RoundData {
  hints: string[];
  code: string; // e.g. "4,1,2"
}

// Helper to check if a row is empty
function isRowEmpty(row: RoundData): boolean {
  return row.hints.every(hint => hint.trim() === "") && row.code.trim() === "";
}

/** Renders a single row in the rounds table: Round #, 3 hints, code. */
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
 * Main Decrypto board with separate tables for our rounds, opponent's rounds, and:
 * - Our Rounds Table: dynamically increasing rows with 3 hints + code
 * - Opponent Rounds Table: dynamically increasing rows with 3 hints + code
 * - Second table: Groups the opponent team's hints from each round by the code digit.
 */
export default function DecryptoBoard() {
  // Initialize with one empty row for each table
  const [rounds, setRounds] = useState<RoundData[]>([
    { hints: ["", "", ""], code: "" }
  ]);

  const [ourRounds, setOurRounds] = useState<RoundData[]>([
    { hints: ["", "", ""], code: "" }
  ]);

  /** Handle updates to hints or code for the opponent's rounds. */
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

      // If the changed row is the last one and now not empty, append a new empty row
      if (roundIndex === updated.length - 1 && !isRowEmpty(updated[roundIndex])) {
        updated.push({ hints: ["", "", ""], code: "" });
      }
      return updated;
    });
  };

  /** Handle updates to hints or code for our team's rounds. */
  const handleOurRoundChange = (
    roundIndex: number,
    field: "hints" | "code",
    value: string | string[]
  ) => {
    setOurRounds((prev) => {
      const updated = [...prev];
      if (field === "hints") {
        updated[roundIndex].hints = value as string[];
      } else {
        updated[roundIndex].code = value as string;
      }

      // If the changed row is the last one and now not empty, append a new empty row
      if (roundIndex === updated.length - 1 && !isRowEmpty(updated[roundIndex])) {
        updated.push({ hints: ["", "", ""], code: "" });
      }
      return updated;
    });
  };

  /**
   * The second table: For each opponent round (except the last empty one), parse the code (e.g. "4,1,2"),
   * and then put each hint into the correct word‐number column (#1–#4).
   */
  const renderSecondTableBody = () => {
    // Exclude the last row if it is empty
    const validRounds = rounds.filter(row => !isRowEmpty(row));
    return validRounds.map((roundData, roundIndex) => {
      // Each row has up to 4 columns for word #1, #2, #3, #4
      const wordSlots = ["", "", "", ""];

      // Parse the code "4,1,2" => ["4", "1", "2"]
      const codeDigits = roundData.code
        .split(",")
        .map((part) => parseInt(part.trim(), 10))
        .filter((num) => !isNaN(num) && num >= 1 && num <= 4);

      // For each digit in the code, place the corresponding hint:
      //   codeDigits[i] => which word number (1-based)
      //   roundData.hints[i] => the i-th hint
      codeDigits.forEach((digit, i) => {
        if (i < roundData.hints.length) {
          // digit is 1-based, so digit=4 corresponds to index 3
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
      {/* Our Rounds Table (New) */}
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Our Rounds (Hints + Code)
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
          {ourRounds.map((roundData, idx) => (
            <RoundRow
              key={idx}
              roundIndex={idx}
              roundData={roundData}
              onChange={(field, value) => handleOurRoundChange(idx, field, value)}
            />
          ))}
        </tbody>
      </table>

      {/* Opponent's Rounds Table */}
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Opponent Rounds (Hints + Code)
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

      {/* Second Table: Hints by Secret Word Number for Opponent */}
      <h2 className="text-xl font-semibold mb-4 dark:text-white">
        Hints by Secret Word Number (Opponent)
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
