// "use client";

// import { useEffect, useState } from "react";

// export const dynamic = "force-dynamic";

// const PLAYOFF_TEAMS = [
//   "SchutteMcGavin",
//   "Bartoneone",
//   "FOZ",
//   "stlud92",
//   "eazybeasy",
//   "WorldWidePain",
//   "Ceej137",
//   "sfbentley",
//   "DylanJarrett",
//   "CMarcellus87",
//   "claytonyingling",
//   "greysonavots",
// ];

// type SleeperRoster = {
//   roster_id: number;
//   owner_id: string;
// };

// type SleeperUser = {
//   user_id: string;
//   display_name: string;
// };

// type SleeperMatchup = {
//   roster_id: number;
//   points: number;
//   starters: string[];
//   players_points: Record<string, number>;
// };

// type SleeperPlayer = {
//   full_name?: string;
//   position?: string;
//   team?: string;
// };

// type ScoreEntry = {
//   team: string;
//   score: number;
//   leagueId: string;
// };

// type StarterEntry = {
//   id: string;
//   name: string;
//   position: string;
//   team: string;
//   points: number;
// };

// type RosterDetails = {
//   total: number;
//   starters: StarterEntry[];
// };

// export default function PlayoffsPage() {
//   const [scores, setScores] = useState<ScoreEntry[] | null>(null);
//   const [currentWeek, setCurrentWeek] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);

//   // Modal state
//   const [modalOpen, setModalOpen] = useState<boolean>(false);
//   const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
//   const [roster, setRoster] = useState<RosterDetails | null>(null);
//   const [rosterLoading, setRosterLoading] = useState<boolean>(false);

//   // ============================================================
//   // GET CURRENT NFL WEEK
//   // ============================================================
//   async function fetchCurrentWeek(): Promise<number | null> {
//     try {
//       const res = await fetch("https://api.sleeper.app/v1/state/nfl");
//       const data: { week?: number } = await res.json();
//       return typeof data.week === "number" ? data.week : null;
//     } catch {
//       return null;
//     }
//   }

//   // ============================================================
//   // FETCH MATCHUPS — NO PROJECTIONS
//   // ============================================================
//   async function loadScores(week: number) {
//     setLoading(true);

//     const leagueIds = [
//       "1255317029158662144",
//       "1255317690592022528",
//       "1255318252108664832",
//       "1255318483655196672",
//     ];

//     const allScores: ScoreEntry[] = [];

//     for (const leagueId of leagueIds) {
//       try {
//         const [rostersRes, usersRes, matchupsRes] = await Promise.all([
//           fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
//           fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
//           fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`),
//         ]);

//         const rosters: SleeperRoster[] = await rostersRes.json();
//         const users: SleeperUser[] = await usersRes.json();
//         const matchups: SleeperMatchup[] = await matchupsRes.json();

//         const rosterToUser: Record<number, string> = Object.fromEntries(
//           rosters.map((r) => [r.roster_id, r.owner_id])
//         );

//         const userMap: Record<string, string> = Object.fromEntries(
//           users.map((u) => [u.user_id, u.display_name])
//         );

//         for (const m of matchups) {
//           const ownerId = rosterToUser[m.roster_id];
//           const name = userMap[ownerId];

//           if (!PLAYOFF_TEAMS.includes(name)) continue;

//           allScores.push({
//             team: name,
//             score: m.points ?? 0,
//             leagueId,
//           });
//         }
//       } catch {
//         continue;
//       }
//     }

//     allScores.sort((a, b) => b.score - a.score);
//     setScores(allScores);
//     setLoading(false);
//   }

//   // ============================================================
//   // LOAD ROSTER FOR MODAL — NO PROJECTIONS
//   // ============================================================
//   async function openRoster(team: string, leagueId: string) {
//     if (!currentWeek) return;

//     setSelectedTeam(team);
//     setModalOpen(true);
//     setRosterLoading(true);

//     try {
//       const [rostersRes, usersRes, matchupsRes, playersRes] = await Promise.all([
//         fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
//         fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
//         fetch(
//           `https://api.sleeper.app/v1/league/${leagueId}/matchups/${currentWeek}`
//         ),
//         fetch("https://api.sleeper.app/v1/players/nfl"),
//       ]);

//       const rosters: SleeperRoster[] = await rostersRes.json();
//       const users: SleeperUser[] = await usersRes.json();
//       const matchups: SleeperMatchup[] = await matchupsRes.json();
//       const players: Record<string, SleeperPlayer> = await playersRes.json();

//       const user = users.find((u) => u.display_name === team);
//       if (!user) return;

//       const rosterObj = rosters.find((r) => r.owner_id === user.user_id);
//       const match = matchups.find((m) => m.roster_id === rosterObj?.roster_id);
//       if (!match) return;

//       const starters: StarterEntry[] =
//         match.starters?.map((pid) => ({
//           id: pid,
//           name: players[pid]?.full_name ?? "Unknown",
//           position: players[pid]?.position ?? "N/A",
//           team: players[pid]?.team ?? "—",
//           points: match.players_points?.[pid] ?? 0,
//         })) ?? [];

//       setRoster({
//         total: match.points ?? 0,
//         starters,
//       });
//     } finally {
//       setRosterLoading(false);
//     }
//   }

//   // ============================================================
//   // INITIAL LOAD
//   // ============================================================
//   useEffect(() => {
//     async function init() {
//       const week = await fetchCurrentWeek();
//       setCurrentWeek(week);

//       if (week) await loadScores(week);
//     }

//     init();
//   }, []);

//   return (
//     <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
//       <div className="max-w-3xl mx-auto">
//         <h1 className="text-3xl font-bold mb-4 text-center">
//           🏈 Playoffs {currentWeek ? `— Week ${currentWeek}` : ""}
//         </h1>

//         {loading && <p className="text-center text-gray-400">Loading…</p>}

//         {!loading && scores && (
//           <ul className="space-y-3">
//             {scores.map((t, idx) => (
//               <li
//                 key={`${t.leagueId}-${t.team}`}
//                 className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
//                 onClick={() => openRoster(t.team, t.leagueId)}
//               >
//                 <div className="flex justify-between">
//                   <div>
//                     <div className="font-bold text-lg">{t.team}</div>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     <span className="text-purple-400 font-bold">
//                       {t.score.toFixed(2)}
//                     </span>
//                     {idx < 6 && <span className="text-green-500 text-xl">✔</span>}
//                   </div>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* =========================
//           MODAL
//       ========================== */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-6 z-50">
//           <div className="bg-gray-900 p-6 rounded-xl max-w-lg w-full relative">
//             <button
//               className="absolute top-3 right-3 text-xl text-gray-400"
//               onClick={() => setModalOpen(false)}
//             >
//               ✕
//             </button>

//             <h2 className="text-xl font-bold mb-2">
//               {selectedTeam} — Week {currentWeek}
//             </h2>

//             {rosterLoading && <p>Loading roster...</p>}

//             {!rosterLoading && roster && (
//               <>
//                 <p className="mb-4 text-gray-300">
//                   Total:{" "}
//                   <span className="text-purple-400">
//                     {roster.total.toFixed(2)}
//                   </span>
//                 </p>

//                 <table className="w-full text-sm">
//                   <tbody>
//                     {roster.starters.map((p) => (
//                       <tr key={p.id} className="border-b border-gray-700">
//                         <td className="py-1">{p.name}</td>
//                         <td className="py-1 text-center">{p.team}</td>
//                         <td className="py-1 text-center">{p.position}</td>
//                         <td className="py-1 text-right">{p.points.toFixed(1)}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }


"use client";

import { useEffect, useState } from "react";

export const dynamic = "force-dynamic";

// ================================
// WEEK-SPECIFIC PLAYOFF TEAMS
// ================================
const WEEK_PLAYERS: Record<number, string[]> = {
  14: [
    "SchutteMcGavin",
    "Bartoneone",
    "FOZ",
    "stlud92",
    "eazybeasy",
    "WorldWidePain",
    "Ceej137",
    "sfbentley",
    "DylanJarrett",
    "CMarcellus87",
    "claytonyingling",
    "greysonavots",
  ],

  15: [
    "DylanJarrett",
    "eazybeasy",
    "Ceej137",
    "greysonavots",
    "WorldWidePain",
    "SchutteMcGavin",
  ],

  16: [
    // UPDATE SEMIFINAL TEAMS
    "Winner A",
    "Winner B",
  ],

  17: [
    // CHAMPIONSHIP TEAMS
    "Champion A",
    "Champion B",
  ],
};

const PLAYOFF_WEEKS = [14, 15, 16, 17];

type SleeperRoster = {
  roster_id: number;
  owner_id: string;
};

type SleeperUser = {
  user_id: string;
  display_name: string;
};

type SleeperMatchup = {
  roster_id: number;
  points: number;
  starters: string[];
  players_points: Record<string, number>;
};

type SleeperPlayer = {
  full_name?: string;
  position?: string;
  team?: string;
};

type ScoreEntry = {
  team: string;
  score: number;
  leagueId: string;
};

type StarterEntry = {
  id: string;
  name: string;
  position: string;
  team: string;
  points: number;
};

type RosterDetails = {
  total: number;
  starters: StarterEntry[];
};

// ===============================
// Advancement count per week
// ===============================
function getAdvancingCount(week: number): number {
  switch (week) {
    case 14:
      return 6;
    case 15:
      return 3;
    case 16:
      return 2;
    case 17:
      return 1; // trophy winner
    default:
      return 0;
  }
}

export default function PlayoffsPage() {
  const [scores, setScores] = useState<ScoreEntry[] | null>(null);
  const [selectedWeek, setSelectedWeek] = useState<number>(14);
  const [loading, setLoading] = useState<boolean>(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [roster, setRoster] = useState<RosterDetails | null>(null);
  const [rosterLoading, setRosterLoading] = useState<boolean>(false);

  // ============================================================
  // FETCH MATCHUPS FOR SELECTED WEEK
  // ============================================================
  async function loadScores(week: number) {
    setLoading(true);

    const activeTeams = WEEK_PLAYERS[week] ?? [];
    const leagueIds = [
      "1255317029158662144",
      "1255317690592022528",
      "1255318252108664832",
      "1255318483655196672",
    ];

    const allScores: ScoreEntry[] = [];

    for (const leagueId of leagueIds) {
      try {
        const [rostersRes, usersRes, matchupsRes] = await Promise.all([
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
          fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
          fetch(
            `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`
          ),
        ]);

        const rosters: SleeperRoster[] = await rostersRes.json();
        const users: SleeperUser[] = await usersRes.json();
        const matchups: SleeperMatchup[] = await matchupsRes.json();

        const rosterToUser: Record<number, string> = Object.fromEntries(
          rosters.map((r) => [r.roster_id, r.owner_id])
        );

        const userMap: Record<string, string> = Object.fromEntries(
          users.map((u) => [u.user_id, u.display_name])
        );

        for (const m of matchups) {
          const ownerId = rosterToUser[m.roster_id];
          const name = userMap[ownerId];

          if (!activeTeams.includes(name)) continue;

          allScores.push({
            team: name,
            score: m.points ?? 0,
            leagueId,
          });
        }
      } catch {
        continue;
      }
    }

    allScores.sort((a, b) => b.score - a.score);
    setScores(allScores);
    setLoading(false);
  }

  // ============================================================
  // LOAD ROSTER FOR MODAL (for selected week)
  // ============================================================
  async function openRoster(team: string, leagueId: string) {
    setSelectedTeam(team);
    setModalOpen(true);
    setRosterLoading(true);

    try {
      const [rostersRes, usersRes, matchupsRes, playersRes] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
        fetch(
          `https://api.sleeper.app/v1/league/${leagueId}/matchups/${selectedWeek}`
        ),
        fetch("https://api.sleeper.app/v1/players/nfl"),
      ]);

      const rosters: SleeperRoster[] = await rostersRes.json();
      const users: SleeperUser[] = await usersRes.json();
      const matchups: SleeperMatchup[] = await matchupsRes.json();
      const players: Record<string, SleeperPlayer> = await playersRes.json();

      const user = users.find((u) => u.display_name === team);
      if (!user) return;

      const rosterObj = rosters.find((r) => r.owner_id === user.user_id);
      const match = matchups.find((m) => m.roster_id === rosterObj?.roster_id);
      if (!match) return;

      const starters: StarterEntry[] =
        match.starters?.map((pid) => ({
          id: pid,
          name: players[pid]?.full_name ?? "Unknown",
          position: players[pid]?.position ?? "N/A",
          team: players[pid]?.team ?? "—",
          points: match.players_points?.[pid] ?? 0,
        })) ?? [];

      setRoster({
        total: match.points ?? 0,
        starters,
      });
    } finally {
      setRosterLoading(false);
    }
  }

  // ============================================================
  // LOAD WHEN WEEK CHANGES
  // ============================================================
  useEffect(() => {
    loadScores(selectedWeek);
  }, [selectedWeek]);

  // ============================================================
  // UI
  // ============================================================
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">

        {/* WEEK SELECTOR */}
        <div className="flex justify-center mb-6">
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            {PLAYOFF_WEEKS.map((wk) => (
              <option key={wk} value={wk}>
                Week {wk}
              </option>
            ))}
          </select>
        </div>

        <h1 className="text-3xl font-bold mb-4 text-center">
          🏈 Playoffs — Week {selectedWeek}
        </h1>

        {loading && <p className="text-center text-gray-400">Loading…</p>}

        {!loading && scores && (
          <ul className="space-y-3">
            {scores.map((t, idx) => {
              const advancingLimit = getAdvancingCount(selectedWeek);

              let badge = null;
              if (selectedWeek === 17 && idx === 0) {
                badge = <span className="text-yellow-400 text-2xl">🏆</span>;
              } else if (idx < advancingLimit) {
                badge = <span className="text-green-500 text-xl">✔</span>;
              }

              return (
                <li
                  key={`${t.leagueId}-${t.team}`}
                  className="bg-gray-800 p-4 rounded cursor-pointer hover:bg-gray-700"
                  onClick={() => openRoster(t.team, t.leagueId)}
                >
                  <div className="flex justify-between">
                    <div className="font-bold text-lg">{t.team}</div>

                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-bold">
                        {t.score.toFixed(2)}
                      </span>
                      {badge}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* =========================
          MODAL
      ========================== */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center p-6 z-50">
          <div className="bg-gray-900 p-6 rounded-xl max-w-lg w-full relative">
            <button
              className="absolute top-3 right-3 text-xl text-gray-400"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">
              {selectedTeam} — Week {selectedWeek}
            </h2>

            {rosterLoading && <p>Loading roster...</p>}

            {!rosterLoading && roster && (
              <>
                <p className="mb-4 text-gray-300">
                  Total:{" "}
                  <span className="text-purple-400">
                    {roster.total.toFixed(2)}
                  </span>
                </p>

                <table className="w-full text-sm">
                  <tbody>
                    {roster.starters.map((p) => (
                      <tr key={p.id} className="border-b border-gray-700">
                        <td className="py-1">{p.name}</td>
                        <td className="py-1 text-center">{p.team}</td>
                        <td className="py-1 text-center">{p.position}</td>
                        <td className="py-1 text-right">{p.points.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}