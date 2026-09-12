"use client";

import { useEffect, useState, FormEvent } from "react";

// This page is intentionally not linked from the Navbar — reachable only by
// typing /tournament directly into the URL bar.

const PLAYERS_KEY = "tgl_tournament_players";
const SEEDING_KEY = "tgl_tournament_seeding";
const RESULTS_KEY = "tgl_tournament_bracket_results";
const RESULTS_ALT_KEY = "tgl_tournament_bracket_results_playin";
const AUTH_KEY = "tgl_tournament_unlocked";
const PASSWORD = "bxboys26";

const SEED_COUNT = 12;
const DEFAULT_SEEDING = Array.from({ length: SEED_COUNT }, (_, i) => i + 1);
const DEFAULT_PLAYERS = [
  "Ryan",
  "Nate",
  "Chris",
  "Max",
  "Scott",
  "Zach",
  "Travis",
  "Ben",
  "Tyler",
  "Taylor",
  "Dylan",
  "Matt",
];

const ORDINALS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th",
  "7th", "8th", "9th", "10th", "11th", "12th",
];

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
// STANDARD BRACKET
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

const ROUND_ORDER = [
  "Round 1",
  "Quarterfinals",
  "Semifinals",
  "Finals",
  "5th–8th Bracket",
  "9th–12th Bracket",
];

const PLACEMENT_CHAIN = ["final", "third_fourth", "p5_6", "p7_8", "p9_10", "p11_12"];

// ================================================================
// PLAY-IN BRACKET (alternate format)
// Nobody gets a bye — all 12 play a play-in game first. Winners form
// a 6-person championship bracket (places 1-6), losers form a
// 6-person consolation bracket (places 7-12). Each half gives its top
// 2 play-in winners a bye into their semifinal round.
// ================================================================
const ALT_MATCHES: MatchDef[] = [
  // Play-in round — every seed plays once
  { id: "pi_1", label: "Play-In Game 1", round: "Play-In Round", a: { type: "seed", seed: 1 }, b: { type: "seed", seed: 12 } },
  { id: "pi_2", label: "Play-In Game 2", round: "Play-In Round", a: { type: "seed", seed: 2 }, b: { type: "seed", seed: 11 } },
  { id: "pi_3", label: "Play-In Game 3", round: "Play-In Round", a: { type: "seed", seed: 3 }, b: { type: "seed", seed: 10 } },
  { id: "pi_4", label: "Play-In Game 4", round: "Play-In Round", a: { type: "seed", seed: 4 }, b: { type: "seed", seed: 9 } },
  { id: "pi_5", label: "Play-In Game 5", round: "Play-In Round", a: { type: "seed", seed: 5 }, b: { type: "seed", seed: 8 } },
  { id: "pi_6", label: "Play-In Game 6", round: "Play-In Round", a: { type: "seed", seed: 6 }, b: { type: "seed", seed: 7 } },

  // Championship bracket (play-in winners) — places 1-6
  { id: "cqf_1", label: "Winners QF 1", round: "Winners Bracket", a: { type: "winner", match: "pi_3" }, b: { type: "winner", match: "pi_6" } },
  { id: "cqf_2", label: "Winners QF 2", round: "Winners Bracket", a: { type: "winner", match: "pi_4" }, b: { type: "winner", match: "pi_5" } },
  { id: "csf_1", label: "Winners SF 1", round: "Winners Bracket", a: { type: "winner", match: "pi_1" }, b: { type: "winner", match: "cqf_1" } },
  { id: "csf_2", label: "Winners SF 2", round: "Winners Bracket", a: { type: "winner", match: "pi_2" }, b: { type: "winner", match: "cqf_2" } },
  { id: "final_alt", label: "Championship (1st / 2nd)", round: "Winners Finals", a: { type: "winner", match: "csf_1" }, b: { type: "winner", match: "csf_2" } },
  { id: "third_fourth_alt", label: "3rd Place Game", round: "Winners Finals", a: { type: "loser", match: "csf_1" }, b: { type: "loser", match: "csf_2" } },
  { id: "fifth_alt", label: "5th Place Game", round: "Winners Finals", a: { type: "loser", match: "cqf_1" }, b: { type: "loser", match: "cqf_2" } },

  // Consolation bracket (play-in losers) — places 7-12
  { id: "kqf_1", label: "Consolation QF 1", round: "Consolation Bracket", a: { type: "loser", match: "pi_3" }, b: { type: "loser", match: "pi_6" } },
  { id: "kqf_2", label: "Consolation QF 2", round: "Consolation Bracket", a: { type: "loser", match: "pi_4" }, b: { type: "loser", match: "pi_5" } },
  { id: "ksf_1", label: "Consolation SF 1", round: "Consolation Bracket", a: { type: "loser", match: "pi_1" }, b: { type: "winner", match: "kqf_1" } },
  { id: "ksf_2", label: "Consolation SF 2", round: "Consolation Bracket", a: { type: "loser", match: "pi_2" }, b: { type: "winner", match: "kqf_2" } },
  { id: "seventh_alt", label: "7th Place Game", round: "Consolation Finals", a: { type: "winner", match: "ksf_1" }, b: { type: "winner", match: "ksf_2" } },
  { id: "ninth_alt", label: "9th Place Game", round: "Consolation Finals", a: { type: "loser", match: "ksf_1" }, b: { type: "loser", match: "ksf_2" } },
  { id: "eleventh_alt", label: "11th Place Game", round: "Consolation Finals", a: { type: "loser", match: "kqf_1" }, b: { type: "loser", match: "kqf_2" } },
];

const ALT_MATCH_MAP: Record<string, MatchDef> = Object.fromEntries(ALT_MATCHES.map((m) => [m.id, m]));

const ALT_ROUND_ORDER = [
  "Play-In Round",
  "Winners Bracket",
  "Winners Finals",
  "Consolation Bracket",
  "Consolation Finals",
];

const ALT_PLACEMENT_CHAIN = [
  "final_alt",
  "third_fourth_alt",
  "fifth_alt",
  "seventh_alt",
  "ninth_alt",
  "eleventh_alt",
];

type Results = Record<string, "A" | "B">;
type GetSeedName = (seed: number) => string;

function resolveSlot(
  source: SlotSource,
  results: Results,
  getSeedName: GetSeedName,
  matchMap: Record<string, MatchDef>
): string | null {
  if (source.type === "seed") {
    return getSeedName(source.seed);
  }

  const match = matchMap[source.match];
  const pick = results[source.match];
  if (!pick) return null;

  if (source.type === "winner") {
    return resolveSlot(pick === "A" ? match.a : match.b, results, getSeedName, matchMap);
  }
  // loser
  return resolveSlot(pick === "A" ? match.b : match.a, results, getSeedName, matchMap);
}

function buildStandings(
  placementChain: string[],
  results: Results,
  getSeedName: GetSeedName,
  matchMap: Record<string, MatchDef>
) {
  const standings: { place: string; name: string | null }[] = [];
  placementChain.forEach((matchId, idx) => {
    const done = !!results[matchId];
    standings.push({
      place: ORDINALS[idx * 2],
      name: done ? resolveSlot({ type: "winner", match: matchId }, results, getSeedName, matchMap) : null,
    });
    standings.push({
      place: ORDINALS[idx * 2 + 1],
      name: done ? resolveSlot({ type: "loser", match: matchId }, results, getSeedName, matchMap) : null,
    });
  });
  return standings;
}

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

function BracketView({
  roundOrder,
  matches,
  results,
  getSeedName,
  matchMap,
  onPick,
  onReset,
  placementChain,
}: {
  roundOrder: string[];
  matches: MatchDef[];
  results: Results;
  getSeedName: GetSeedName;
  matchMap: Record<string, MatchDef>;
  onPick: (matchId: string, side: "A" | "B") => void;
  onReset: () => void;
  placementChain: string[];
}) {
  const standings = buildStandings(placementChain, results, getSeedName, matchMap);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={onReset}
          className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-700"
        >
          Reset Bracket
        </button>
      </div>

      {roundOrder.map((round) => {
        const roundMatches = matches.filter((m) => m.round === round);
        return (
          <div key={round} className="mb-10">
            <h2 className="text-lg font-semibold text-purple-400 mb-3">{round}</h2>
            <div className="flex flex-wrap gap-4">
              {roundMatches.map((m) => {
                const nameA = resolveSlot(m.a, results, getSeedName, matchMap);
                const nameB = resolveSlot(m.b, results, getSeedName, matchMap);
                return (
                  <MatchCard
                    key={m.id}
                    match={m}
                    nameA={nameA}
                    nameB={nameB}
                    pick={results[m.id]}
                    onPick={(side) => onPick(m.id, side)}
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
  );
}

type Tab = "setup" | "bracket" | "playin" | "about";

export default function TournamentPage() {
  const [players, setPlayers] = useState<string[]>(DEFAULT_PLAYERS);
  const [seeding, setSeeding] = useState<number[]>(DEFAULT_SEEDING);
  const [results, setResults] = useState<Results>({});
  const [resultsAlt, setResultsAlt] = useState<Results>({});
  const [activeTab, setActiveTab] = useState<Tab>("setup");
  const [loaded, setLoaded] = useState(false);

  const [authChecked, setAuthChecked] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(AUTH_KEY) === "1") {
      setUnlocked(true);
    }
    setAuthChecked(true);
  }, []);

  function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      window.sessionStorage.setItem(AUTH_KEY, "1");
      setUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  }

  useEffect(() => {
    try {
      const rawPlayers = window.localStorage.getItem(PLAYERS_KEY);
      if (rawPlayers) setPlayers(JSON.parse(rawPlayers));

      const rawSeeding = window.localStorage.getItem(SEEDING_KEY);
      if (rawSeeding) setSeeding(JSON.parse(rawSeeding));

      const rawResults = window.localStorage.getItem(RESULTS_KEY);
      if (rawResults) setResults(JSON.parse(rawResults));

      const rawResultsAlt = window.localStorage.getItem(RESULTS_ALT_KEY);
      if (rawResultsAlt) setResultsAlt(JSON.parse(rawResultsAlt));
    } catch {
      // ignore corrupt storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(PLAYERS_KEY, JSON.stringify(players));
  }, [players, loaded]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(SEEDING_KEY, JSON.stringify(seeding));
  }, [seeding, loaded]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
  }, [results, loaded]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem(RESULTS_ALT_KEY, JSON.stringify(resultsAlt));
  }, [resultsAlt, loaded]);

  function getSeedName(seed: number): string {
    const idx = seeding.indexOf(seed);
    const name = idx !== -1 ? players[idx]?.trim() : "";
    return name || `Seed ${seed}`;
  }

  function updateName(index: number, value: string) {
    setPlayers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function updateSeed(index: number, newSeed: number) {
    setSeeding((prev) => {
      const next = [...prev];
      const oldSeed = next[index];
      const otherIndex = next.indexOf(newSeed);
      next[index] = newSeed;
      if (otherIndex !== -1 && otherIndex !== index) {
        next[otherIndex] = oldSeed;
      }
      return next;
    });
    maybeClearResults();
  }

  function shuffleSeeds() {
    const shuffled = [...DEFAULT_SEEDING];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setSeeding(shuffled);
    maybeClearResults();
  }

  function maybeClearResults() {
    if (Object.keys(results).length === 0 && Object.keys(resultsAlt).length === 0) return;
    const ok = window.confirm(
      "Changing the seeding will reset the picks made so far on both brackets. Continue?"
    );
    if (ok) {
      setResults({});
      setResultsAlt({});
    }
  }

  function resetBracket() {
    setResults({});
    window.localStorage.removeItem(RESULTS_KEY);
  }

  function resetAltBracket() {
    setResultsAlt({});
    window.localStorage.removeItem(RESULTS_ALT_KEY);
  }

  function pick(matchId: string, side: "A" | "B") {
    setResults((prev) => ({ ...prev, [matchId]: side }));
  }

  function pickAlt(matchId: string, side: "A" | "B") {
    setResultsAlt((prev) => ({ ...prev, [matchId]: side }));
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: "setup", label: "1. Names & Seeding" },
    { id: "bracket", label: "2. Standard Bracket" },
    { id: "playin", label: "3. Play-In Bracket" },
    { id: "about", label: "How It Works" },
  ];

  if (!authChecked) {
    return <main className="min-h-screen bg-gray-950" />;
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <form
          onSubmit={handleUnlock}
          className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-sm"
        >
          <h1 className="text-xl font-bold mb-1 text-center">🏆 Tournament Bracket</h1>
          <p className="text-gray-400 text-sm mb-6 text-center">
            Enter the password to continue.
          </p>
          <input
            type="password"
            autoFocus
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError(false);
            }}
            placeholder="Password"
            className={`w-full bg-gray-800 border rounded px-3 py-2 text-sm mb-2 focus:outline-none ${
              passwordError ? "border-red-500" : "border-gray-700 focus:border-purple-500"
            }`}
          />
          {passwordError && (
            <p className="text-red-400 text-xs mb-3">Incorrect password. Try again.</p>
          )}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-500 rounded-lg py-2 text-sm font-semibold mt-3"
          >
            Enter
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🏆 12-Person Tournament Bracket</h1>

        {/* Sub-tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800 flex-wrap">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
                activeTab === t.id
                  ? "bg-gray-800 text-purple-400 border-b-2 border-purple-500"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/* TAB: NAMES & SEEDING                                          */}
        {/* ============================================================ */}
        {activeTab === "setup" && (
          <div className="max-w-3xl">
            <p className="text-gray-400 mb-6">
              Edit names if needed, then hit Shuffle Seeds to randomly assign
              each person a seed (1–12). You can also manually set a seed from
              the dropdown — picking a seed that's already taken swaps the two
              people. The same names/seeding feed both brackets below.
            </p>

            <div className="flex justify-end mb-3">
              <button
                onClick={shuffleSeeds}
                className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-semibold"
              >
                🔀 Shuffle Seeds
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg divide-y divide-gray-800">
              {players.map((name, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => updateName(i, e.target.value)}
                    placeholder={`Person ${i + 1} name`}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-purple-500"
                  />
                  <label className="text-xs text-gray-400">Seed</label>
                  <select
                    value={seeding[i]}
                    onChange={(e) => updateSeed(i, Number(e.target.value))}
                    className="bg-gray-800 border border-gray-700 rounded px-2 py-2 text-sm focus:outline-none focus:border-purple-500"
                  >
                    {DEFAULT_SEEDING.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-purple-400 mt-8 mb-3">
              Current Seeding
            </h2>
            <div className="bg-gray-900 rounded-lg overflow-hidden max-w-md">
              <table className="w-full text-sm">
                <tbody>
                  {DEFAULT_SEEDING.map((seed) => (
                    <tr key={seed} className="border-b border-gray-800 last:border-0">
                      <td className="py-2 px-4 text-gray-400 w-16">#{seed}</td>
                      <td className="py-2 px-4">{getSeedName(seed)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB: STANDARD BRACKET                                         */}
        {/* ============================================================ */}
        {activeTab === "bracket" && (
          <BracketView
            roundOrder={ROUND_ORDER}
            matches={MATCHES}
            results={results}
            getSeedName={getSeedName}
            matchMap={MATCH_MAP}
            onPick={pick}
            onReset={resetBracket}
            placementChain={PLACEMENT_CHAIN}
          />
        )}

        {/* ============================================================ */}
        {/* TAB: PLAY-IN BRACKET                                          */}
        {/* ============================================================ */}
        {activeTab === "playin" && (
          <BracketView
            roundOrder={ALT_ROUND_ORDER}
            matches={ALT_MATCHES}
            results={resultsAlt}
            getSeedName={getSeedName}
            matchMap={ALT_MATCH_MAP}
            onPick={pickAlt}
            onReset={resetAltBracket}
            placementChain={ALT_PLACEMENT_CHAIN}
          />
        )}

        {/* ============================================================ */}
        {/* TAB: HOW IT WORKS                                             */}
        {/* ============================================================ */}
        {activeTab === "about" && (
          <div className="max-w-3xl text-gray-300 space-y-10">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-purple-400 mb-2">
                  Standard Bracket
                </h2>
                <p>
                  All 12 people are assigned a seed from 1 (best) to 12. Because
                  12 isn&apos;t a clean bracket size, the top 4 seeds get a bye
                  straight to the Quarterfinals while seeds 5–12 play it out in
                  Round 1. From there it&apos;s single elimination — but instead
                  of just going home after a loss, everyone drops into a
                  placement bracket so that all 12 spots get decided by an
                  actual game, not a coin flip or tiebreaker.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Round 1 (4 games)</h3>
                <p>
                  Seeds 5–12 play head-to-head: 5 vs 12, 6 vs 11, 7 vs 10, 8 vs
                  9. Seeds 1–4 sit this round out.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Quarterfinals (4 games)</h3>
                <p>
                  The bye seeds (1–4) join the Round 1 winners. Losers here
                  don&apos;t get eliminated — they drop into the 5th–8th place
                  bracket.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Semifinals (2 games)</h3>
                <p>The 4 remaining players play down to 2.</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Championship & 3rd Place</h3>
                <p>
                  The two semifinal winners play for 1st/2nd. The two
                  semifinal <em>losers</em> play a separate game to decide 3rd
                  and 4th place — exactly like a bronze-medal game.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">5th–8th Place Bracket</h3>
                <p>
                  The 4 players who lost in the Quarterfinals play each other:
                  two games to set up a 5th Place Game (winners) and a 7th
                  Place Game (losers).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">9th–12th Place Bracket</h3>
                <p>
                  The 4 players who lost in Round 1 play each other the same
                  way: two games leading to a 9th Place Game (winners) and an
                  11th Place Game (losers).
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">End result</h3>
                <p>
                  20 total games are played, and every one of the 12 people
                  ends up with a final rank from 1st to 12th — nobody is left
                  unranked.
                </p>
              </div>
            </div>

            <div className="space-y-6 border-t border-gray-800 pt-8">
              <div>
                <h2 className="text-xl font-semibold text-purple-400 mb-2">
                  Play-In Bracket (alternate format)
                </h2>
                <p>
                  This version skips byes entirely — every one of the 12
                  people has to win a play-in game before anything else
                  happens. Seeds are paired 1 vs 12, 2 vs 11, 3 vs 10, 4 vs 9,
                  5 vs 8, and 6 vs 7. Winners move into a 6-person
                  Championship Bracket that plays down to 1st–6th; losers move
                  into their own 6-person Consolation Bracket that plays down
                  to 7th–12th. Just like the standard bracket, nobody is
                  eliminated outright — every game feeds into the next one
                  until all 12 spots are decided.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Play-In Round (6 games)</h3>
                <p>
                  Every seed plays exactly one game: 1v12, 2v11, 3v10, 4v9,
                  5v8, 6v7.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Winners Bracket (places 1–6)</h3>
                <p>
                  The winners of the 1v12 and 2v11 games get a bye straight to
                  the semifinals. The winners of 3v10 vs 6v7, and 4v9 vs 5v8,
                  play a quarterfinal to join them. From there it&apos;s
                  semifinals, a Championship Game (1st/2nd), a 3rd Place Game,
                  and a 5th Place Game between the two quarterfinal losers.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">Consolation Bracket (places 7–12)</h3>
                <p>
                  The play-in losers follow the identical structure on the
                  other side: the 1v12 and 2v11 losers get a bye into their
                  semifinal, the rest play a quarterfinal first. It ends with
                  a 7th Place Game, a 9th Place Game, and an 11th Place Game.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-1">End result</h3>
                <p>
                  Also 20 total games, also a full 1st–12th ranking — the only
                  difference from the standard bracket is that nobody skips
                  the first round. A rough start doesn&apos;t end your
                  tournament; it just changes which bracket you&apos;re
                  fighting to move up in.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
