"use client";

import { useEffect, useState } from "react";

// This page is intentionally not linked from the Navbar — reachable only by
// typing /tournament directly into the URL bar.

const STORAGE_KEY = "tgl_tournament_bracket_results";

const SEED_NAMES = Array.from({ length: 12 }, (_, i) => `Seed ${i + 1}`);

type SlotSource =
  | { type: "seed"; seed: number }
  | { type: "winner"; match: string }
  | { type: "loser"; match: string };

interface MatchDef {
  id: string;
  label: string;
  round: string;
  a: SlotSource;
  b: SlotSource;
}

// ================================================================
// BRACKET DEFINITION
// 12 seeds, top 4 seeds get a first-round bye. Every loser drops into
// a placement bracket so all 12 spots get decided by an actual game.
// ================================================================
const MATCHES: MatchDef[] = [
  // Round 1 — seeds 5-12 only, seeds 1-4 have a bye
  { id: "r1_1", label: "Game 1", round: "Round 1", a: { type: "seed", seed: 5 }, b: { type: "seed", seed: 12 } },
  { id: "r1_2", label: "Game 2", round: "Round 1", a: { type: "seed", seed: 6 }, b: { type: "seed", seed: 11 } },
  { id: "r1_3", label: "Game 3", round: "Round 1", a: { type: "seed", seed: 7 }, b: { type: "seed", seed: 10 } },
  { id: "r1_4", label: "Game 4", round: "Round 1", a: { type: "seed", seed: 8 }, b: { type: "seed", seed: 9 } },

  // Quarterfinals
  { id: "qf_1", label: "Game 5", round: "Quarterfinals", a: { type: "seed", seed: 1 }, b: { type: "winner", match: "r1_4" } },
  { id: "qf_2", label: "Game 6", round: "Quarterfinals", a: { type: "seed", seed: 4 }, b: { type: "winner", match: "r1_3" } },
  { id: "qf_3", label: "Game 7", round: "Quarterfinals", a: { type: "seed", seed: 3 }, b: { type: "winner", match: "r1_2" } },
  { id: "qf_4", label: "Game 8", round: "Quarterfinals", a: { type: "seed", seed: 2 }, b: { type: "winner", match: "r1_1" } },

  // Semifinals
  { id: "sf_1", label: "Game 9", round: "Semifinals", a: { type: "winner", match: "qf_1" }, b: { type: "winner", match: "qf_2" } },
  { id: "sf_2", label: "Game 10", round: "Semifinals", a: { type: "winner", match: "qf_3" }, b: { type: "winner", match: "qf_4" } },

  // Championship + 3rd place
  { id: "final", label: "Championship (1st / 2nd)", round: "Finals", a: { type: "winner", match: "sf_1" }, b: { type: "winner", match: "sf_2" } },
  { id: "third_fourth", label: "3rd Place Game", round: "Finals", a: { type: "loser", match: "sf_1" }, b: { type: "loser", match: "sf_2" } },

  // 5th-8th placement bracket (quarterfinal losers)
  { id: "c58_1", label: "Game 11", round: "5th–8th Bracket", a: { type: "loser", match: "qf_1" }, b: { type: "loser", match: "qf_2" } },
  { id: "c58_2", label: "Game 12", round: "5th–8th Bracket", a: { type: "loser", match: "qf_3" }, b: { type: "loser", match: "qf_4" } },
  { id: "p5_6", label: "5th Place Game", round: "5th–8th Bracket", a: { type: "winner", match: "c58_1" }, b: { type: "winner", match: "c58_2" } },
  { id: "p7_8", label: "7th Place Game", round: "5th–8th Bracket", a: { type: "loser", match: "c58_1" }, b: { type: "loser", match: "c58_2" } },

  // 9th-12th placement bracket (round 1 losers)
  { id: "c912_1", label: "Game 13", round: "9th–12th Bracket", a: { type: "loser", match: "r1_4" }, b: { type: "loser", match: "r1_3" } },
  { id: "c912_2", label: "Game 14", round: "9th–12th Bracket", a: { type: "loser", match: "r1_2" }, b: { type: "loser", match: "r1_1" } },
  { id: "p9_10", label: "9th Place Game", round: "9th–12th Bracket", a: { type: "winner", match: "c912_1" }, b: { type: "winner", match: "c912_2" } },
  { id: "p11_12", label: "11th Place Game", round: "9th–12th Bracket", a: { type: "loser", match: "c912_1" }, b: { type: "loser", match: "c912_2" } },
];

const MATCH_MAP: Record<string, MatchDef> = Object.fromEntries(MATCHES.map((m) => [m.id, m]));

type Results = Record<string, "A" | "B">;

function resolveSlot(source: SlotSource, results: Results): string | null {
  if (source.type === "seed") {
    return SEED_NAMES[source.seed - 1];
  }

  const match = MATCH_MAP[source.match];
  const pick = results[source.match];
  if (!pick) return null;

  if (source.type === "winner") {
    return resolveSlot(pick === "A" ? match.a : match.b, results);
  }
  // loser
  return resolveSlot(pick === "A" ? match.b : match.a, results);
}

const ROUND_ORDER = [
  "Round 1",
  "Quarterfinals",
  "Semifinals",
  "Finals",
  "5th–8th Bracket",
  "9th–12th Bracket",
];

function MatchCard({
  match,
  nameA,
  nameB,
  pick,
  onPick,
}: {
  match: MatchDef;
  nameA: string | null;
  nameB: string | null;
  pick: "A" | "B" | undefined;
  onPick: (side: "A" | "B") => void;
}) {
  const canPick = !!nameA && !!nameB;

  return (
    <div className="bg-gray-800 rounded-lg p-3 w-56">
      <div className="text-xs text-gray-400 mb-2">{match.label}</div>
      {(["A", "B"] as const).map((side) => {
        const name = side === "A" ? nameA : nameB;
        const isWinner = pick === side;
        return (
          <button
            key={side}
            disabled={!canPick}
            onClick={() => onPick(side)}
            className={`w-full text-left px-3 py-2 rounded mb-1 last:mb-0 transition ${
              !name
                ? "bg-gray-900 text-gray-600 cursor-not-allowed"
                : isWinner
                ? "bg-purple-600 text-white font-semibold"
                : "bg-gray-900 text-gray-200 hover:bg-gray-700 cursor-pointer"
            }`}
          >
            {name ?? "TBD"}
          </button>
        );
      })}
    </div>
  );
}

export default function TournamentPage() {
  const [results, setResults] = useState<Results>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setResults(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
  }, [results, loaded]);

  function pick(matchId: string, side: "A" | "B") {
    setResults((prev) => ({ ...prev, [matchId]: side }));
  }

  function reset() {
    setResults({});
    window.localStorage.removeItem(STORAGE_KEY);
  }

  const standings = [
    { place: "1st", name: results.final ? resolveSlot({ type: "winner", match: "final" }, results) : null },
    { place: "2nd", name: results.final ? resolveSlot({ type: "loser", match: "final" }, results) : null },
    { place: "3rd", name: results.third_fourth ? resolveSlot({ type: "winner", match: "third_fourth" }, results) : null },
    { place: "4th", name: results.third_fourth ? resolveSlot({ type: "loser", match: "third_fourth" }, results) : null },
    { place: "5th", name: results.p5_6 ? resolveSlot({ type: "winner", match: "p5_6" }, results) : null },
    { place: "6th", name: results.p5_6 ? resolveSlot({ type: "loser", match: "p5_6" }, results) : null },
    { place: "7th", name: results.p7_8 ? resolveSlot({ type: "winner", match: "p7_8" }, results) : null },
    { place: "8th", name: results.p7_8 ? resolveSlot({ type: "loser", match: "p7_8" }, results) : null },
    { place: "9th", name: results.p9_10 ? resolveSlot({ type: "winner", match: "p9_10" }, results) : null },
    { place: "10th", name: results.p9_10 ? resolveSlot({ type: "loser", match: "p9_10" }, results) : null },
    { place: "11th", name: results.p11_12 ? resolveSlot({ type: "winner", match: "p11_12" }, results) : null },
    { place: "12th", name: results.p11_12 ? resolveSlot({ type: "loser", match: "p11_12" }, results) : null },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">🏆 12-Person Tournament Bracket</h1>
          <button
            onClick={reset}
            className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-700"
          >
            Reset Bracket
          </button>
        </div>

        {ROUND_ORDER.map((round) => {
          const roundMatches = MATCHES.filter((m) => m.round === round);
          return (
            <div key={round} className="mb-10">
              <h2 className="text-lg font-semibold text-purple-400 mb-3">{round}</h2>
              <div className="flex flex-wrap gap-4">
                {roundMatches.map((m) => {
                  const nameA = resolveSlot(m.a, results);
                  const nameB = resolveSlot(m.b, results);
                  return (
                    <MatchCard
                      key={m.id}
                      match={m}
                      nameA={nameA}
                      nameB={nameB}
                      pick={results[m.id]}
                      onPick={(side) => pick(m.id, side)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-purple-400 mb-3">Final Standings</h2>
          <div className="bg-gray-900 rounded-lg overflow-hidden max-w-md">
            <table className="w-full text-sm">
              <tbody>
                {standings.map((s) => (
                  <tr key={s.place} className="border-b border-gray-800 last:border-0">
                    <td className="py-2 px-4 text-gray-400 w-16">{s.place}</td>
                    <td className="py-2 px-4">{s.name ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
