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
    <tr className="border-b border-slate-200 dark:border-slate-700">
      <td className="px-3 py-2 text-center">{roundIndex + 1}</td>
      {roundData.hints.map((hint, i) => (
        <td key={i} className="px-3 py-2">
          <input
            type="text"
            className="border rounded w-full p-1 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"
            value={hint}
            onChange={(e) => handleHintChange(i, e.target.value)}
            placeholder={`Hint ${i + 1}`}
          />
        </td>
      ))}
      <td className="px-3 py-2">
        <input
          type="text"
          className="border rounded w-full p-1 bg-white dark:bg-gray-700 text-slate-900 dark:text-slate-100 border-slate-300 dark:border-slate-600 placeholder-slate-500 dark:placeholder-slate-400"
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
interface DecryptoBoardProps {
  currentCode?: number[];
  currentHints?: string[];
}

export default function DecryptoBoard({ currentCode = [], currentHints = [] }: DecryptoBoardProps) {
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
      if (roundIndex === updated.length - 1 && !isRowEmpty(updated[roundIndex])) {
        updated.push({ hints: ["", "", ""], code: "" });
      }
      return updated;
    });
  };

  /** Add a new round to ourRounds using currentHints and currentCode */
  const handleAddOurRound = () => {
    const hints = [...currentHints];
    while (hints.length < 3) hints.push("");
    const codeStr = currentCode.join(",");
    setOurRounds((prev) => {
      const updated = [...prev];
      if (updated.length > 0 && isRowEmpty(updated[updated.length - 1])) {
        updated[updated.length - 1] = { hints, code: codeStr };
      } else {
        updated.push({ hints, code: codeStr });
      }
      updated.push({ hints: ["", "", ""], code: "" });
      return updated;
    });
  };

  const canAddOurRound =
    currentHints.length === 3 &&
    currentHints.every((h) => h.trim().length > 0) &&
    currentCode.length === 3 &&
    currentCode.every((n) => typeof n === "number" && n >= 1 && n <= 4);

  /**
   * The second table: For each opponent round (except the last empty one), parse the code (e.g. "4,1,2"),
   * and then put each hint into the correct word‐number column (#1–#4).
   */
  const renderSecondTableBody = () => {
    const validRounds = rounds.filter(row => !isRowEmpty(row));
    return validRounds.map((roundData, roundIndex) => {
      const wordSlots = ["", "", "", ""];
      const codeDigits = roundData.code
        .split(",")
        .map((part) => parseInt(part.trim(), 10))
        .filter((num) => !isNaN(num) && num >= 1 && num <= 4);
      codeDigits.forEach((digit, i) => {
        if (i < roundData.hints.length) {
          const slotIndex = digit - 1;
          wordSlots[slotIndex] = roundData.hints[i];
        }
      });
      return (
        <tr key={roundIndex} className="border-b border-slate-200 dark:border-slate-700">
          <td className="px-3 py-2 text-center">{roundIndex + 1}</td>
          <td className="px-3 py-2">{wordSlots[0]}</td>
          <td className="px-3 py-2">{wordSlots[1]}</td>
          <td className="px-3 py-2">{wordSlots[2]}</td>
          <td className="px-3 py-2">{wordSlots[3]}</td>
        </tr>
      );
    });
  };

  /**
   * The third table: For each of our rounds (except the last empty one), parse the code (e.g. "4,1,2"),
   * and then put each hint into the correct word‐number column (#1–#4).
   */
  const renderOurHintsByWordTableBody = () => {
    const validRounds = ourRounds.filter(row => !isRowEmpty(row));
    return validRounds.map((roundData, roundIndex) => {
      const wordSlots = ["", "", "", ""];
      const codeDigits = roundData.code
        .split(",")
        .map((part) => parseInt(part.trim(), 10))
        .filter((num) => !isNaN(num) && num >= 1 && num <= 4);
      codeDigits.forEach((digit, i) => {
        if (i < roundData.hints.length) {
          const slotIndex = digit - 1;
          wordSlots[slotIndex] = roundData.hints[i];
        }
      });
      return (
        <tr key={roundIndex} className="border-b border-slate-200 dark:border-slate-700">
          <td className="px-3 py-2 text-center">{roundIndex + 1}</td>
          <td className="px-3 py-2">{wordSlots[0]}</td>
          <td className="px-3 py-2">{wordSlots[1]}</td>
          <td className="px-3 py-2">{wordSlots[2]}</td>
          <td className="px-3 py-2">{wordSlots[3]}</td>
        </tr>
      );
    });
  };

  return (
    <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-md shadow-sm bg-white dark:bg-gray-900">
      {/* Our Rounds Table */}
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Our Rounds (Hints + Code)</h2>
      <button
        className={`mb-4 px-4 py-2 rounded font-medium ${canAddOurRound ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-slate-300 text-slate-500 cursor-not-allowed"}`}
        onClick={handleAddOurRound}
        disabled={!canAddOurRound}
      >
        Fill Current Round Hints and Code
      </button>
      <table className="w-full mb-8 rounded-lg shadow-md bg-sky-50 dark:bg-sky-900">
        <thead className="bg-sky-100 dark:bg-sky-800">
          <tr className="divide-x divide-slate-200 dark:divide-slate-700">
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Round</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Hint 1</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Hint 2</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Hint 3</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Code</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
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

      {/* Our Hints by Secret Word Number Table */}
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Our Hints by Secret Word Number</h2>
      <table className="w-full mb-8 rounded-lg shadow-md bg-sky-50 dark:bg-sky-900">
        <thead className="bg-sky-100 dark:bg-sky-800">
          <tr className="divide-x divide-slate-200 dark:divide-slate-700">
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Round</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #1</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #2</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #3</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #4</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {renderOurHintsByWordTableBody()}
        </tbody>
      </table>

      <div className="my-8 border-t border-slate-300 dark:border-slate-600" />

      {/* Opponent's Rounds Table */}
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Opponent Rounds (Hints + Code)</h2>
      <table className="w-full mb-8 rounded-lg shadow-md bg-rose-50 dark:bg-rose-900">
        <thead className="bg-rose-100 dark:bg-rose-800">
          <tr className="divide-x divide-slate-200 dark:divide-slate-700">
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Round</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Hint 1</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Hint 2</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Hint 3</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Code</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
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

      {/* Hints by Secret Word Number (Opponent) Table */}
      <h2 className="text-xl font-semibold mb-4 dark:text-slate-100">Hints by Secret Word Number (Opponent)</h2>
      <table className="w-full rounded-lg shadow-md bg-rose-50 dark:bg-rose-900">
        <thead className="bg-rose-100 dark:bg-rose-800">
          <tr className="divide-x divide-slate-200 dark:divide-slate-700">
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Round</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #1</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #2</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #3</th>
            <th className="px-4 py-2 text-left text-slate-700 dark:text-slate-300 font-medium">Word #4</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {renderSecondTableBody()}
        </tbody>
      </table>
    </div>
  );
}
