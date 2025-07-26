// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface Matchup {
//   league_name: string;
//   matchup_id: number;
//   team_1_name: string;
//   team_1_score: string;
//   team_2_name: string;
//   team_2_score: string;
// }

// interface LeaderboardEntry {
//   team_name: string;
//   points: number;
//   league_name: string;
// }

// export default function WeeklyMatchups() {
//   const [matchups, setMatchups] = useState<Matchup[]>([]);
//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
//   const [currentWeek, setCurrentWeek] = useState<number | null>(null);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch('/api/weekly');
//       const data = await res.json();
//       setMatchups(data.matchups);
//       setLeaderboard(data.leaderboard);
//       setCurrentWeek(data.week);
//     };
//     load();
//     const interval = setInterval(load, 15 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, []);

//   const leagues = [...new Set(matchups.map(m => m.league_name))];

//   return (
//     <div className="min-h-screen bg-[#0f1115] text-white p-6 space-y-8">
//       <h1 className="text-4xl font-bold text-center text-white">
//         🏈 Sleeper Weekly Matchups {currentWeek ? `(Week ${currentWeek})` : ''}
//       </h1>

//       <Tabs defaultValue={leagues[0]} className="w-full">
//         <TabsList className="flex justify-center flex-wrap gap-2 bg-gray-800 rounded-xl p-2">
//           {leagues.map(league => (
//             <TabsTrigger
//               key={league}
//               value={league}
//               className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white"
//             >
//               {league}
//             </TabsTrigger>
//           ))}
//           <TabsTrigger
//             value="leaderboard"
//             className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
//           >
//             Leaderboard
//           </TabsTrigger>
//         </TabsList>

//         {leagues.map(league => (
//           <TabsContent key={league} value={league}>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//               {matchups
//                 .filter(m => m.league_name === league)
//                 .map((m, i) => {
//                   const t1 = parseFloat(m.team_1_score);
//                   const t2 = parseFloat(m.team_2_score);
//                   const t1Win = t1 > t2;
//                   const t2Win = t2 > t1;

//                   return (
//                     <div
//                       key={i}
//                       className="bg-gradient-to-br from-[#1e1f24] to-[#2d2f36] rounded-2xl shadow-md p-5 border border-gray-700"
//                     >
//                       <div className="text-center text-gray-400 text-sm mb-2">
//                         Matchup #{m.matchup_id}
//                       </div>
//                       <div className="flex justify-between text-lg font-bold mb-2">
//                         <span className={t1Win ? 'text-green-400' : ''}>{m.team_1_name}</span>
//                         <span className={t1Win ? 'text-green-400' : ''}>{t1.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-lg font-bold">
//                         <span className={t2Win ? 'text-green-400' : ''}>{m.team_2_name}</span>
//                         <span className={t2Win ? 'text-green-400' : ''}>{t2.toFixed(2)}</span>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </TabsContent>
//         ))}

//         <TabsContent value="leaderboard">
//           <ScrollArea className="max-h-[80vh] mt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {leaderboard.map((team, i) => (
//                 <Card key={i} className="bg-[#1e1f24] border border-gray-700 rounded-xl text-white">
//                   <CardContent className="p-4 flex justify-between items-center">
//                     <div>
//                       <div className="text-xl font-bold">
//                         #{i + 1} {team.team_name}
//                       </div>
//                       <div className="text-sm text-gray-400">{team.league_name}</div>
//                     </div>
//                     <div className="text-2xl font-extrabold">{team.points.toFixed(2)}</div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
// import { ScrollArea } from '@/components/ui/scroll-area';

// interface Record {
//   wins: number;
//   losses: number;
// }

// interface Matchup {
//   league_name: string;
//   matchup_id: number;
//   team_1_name: string;
//   team_1_score: string;
//   team_2_name: string;
//   team_2_score: string;
//   team_1_record?: Record;
//   team_2_record?: Record;
// }

// interface LeaderboardEntry {
//   team_name: string;
//   points: number;
//   league_name: string;
// }

// export default function WeeklyMatchups() {
//   const [matchups, setMatchups] = useState<Matchup[]>([]);
//   const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
//   const [currentWeek, setCurrentWeek] = useState<number | null>(null);
//   const [selectedWeek, setSelectedWeek] = useState<number>(1);

//   useEffect(() => {
//     const load = async () => {
//       const res = await fetch(`/api/weekly?week=${selectedWeek}`);
//       const data = await res.json();
//       setMatchups(data.matchups);
//       setLeaderboard(data.leaderboard);
//       setCurrentWeek(data.week);
//     };
//     load();

//     const interval = setInterval(load, 15 * 60 * 1000);
//     return () => clearInterval(interval);
//   }, [selectedWeek]);

//   const leagues = [...new Set(matchups.map(m => m.league_name))];

//   return (
//     <div className="min-h-screen bg-[#0f1115] text-white p-6 space-y-8">
//       <h1 className="text-4xl font-bold text-center text-white">
//         🏈 Sleeper Weekly Matchups {currentWeek ? `(Week ${currentWeek})` : ''}
//       </h1>

//       <div className="flex justify-center mt-4">
//         <select
//           value={selectedWeek}
//           onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
//           className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600"
//         >
//           {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
//             <option key={week} value={week}>
//               Week {week}
//             </option>
//           ))}
//         </select>
//       </div>

//       <Tabs defaultValue={leagues[0]} className="w-full">
//         <TabsList className="flex justify-center flex-wrap gap-2 bg-gray-800 rounded-xl p-2">
//           {leagues.map(league => (
//             <TabsTrigger
//               key={league}
//               value={league}
//               className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white"
//             >
//               {league}
//             </TabsTrigger>
//           ))}
//           <TabsTrigger
//             value="leaderboard"
//             className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
//           >
//             Leaderboard
//           </TabsTrigger>
//         </TabsList>

//         {leagues.map(league => (
//           <TabsContent key={league} value={league}>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
//               {matchups
//                 .filter(m => m.league_name === league)
//                 .map((m, i) => {
//                   const t1 = parseFloat(m.team_1_score);
//                   const t2 = parseFloat(m.team_2_score);
//                   const t1Win = t1 > t2;
//                   const t2Win = t2 > t1;

//                   return (
//                     <div
//                       key={i}
//                       className="bg-gradient-to-br from-[#1e1f24] to-[#2d2f36] rounded-2xl shadow-md p-5 border border-gray-700"
//                     >
//                       <div className="text-center text-gray-400 text-sm mb-2">
//                         Matchup #{m.matchup_id}
//                       </div>

//                       {/* Team 1 */}
//                       <div className="flex justify-between items-center mb-2">
//                         <div className="flex flex-col">
//                           <span className={t1Win ? 'text-green-400 font-bold' : 'font-bold'}>
//                             {m.team_1_name}
//                           </span>
//                           <span className="text-sm text-gray-400">
//                             ({m.team_1_record?.wins ?? 0}-{m.team_1_record?.losses ?? 0})
//                           </span>
//                         </div>
//                         <span className={`text-lg font-bold ${t1Win ? 'text-green-400' : 'text-white'}`}>
//                           {t1.toFixed(2)}
//                         </span>
//                       </div>

//                       {/* Team 2 */}
//                       <div className="flex justify-between items-center">
//                         <div className="flex flex-col">
//                           <span className={t2Win ? 'text-green-400 font-bold' : 'font-bold'}>
//                             {m.team_2_name}
//                           </span>
//                           <span className="text-sm text-gray-400">
//                             ({m.team_2_record?.wins ?? 0}-{m.team_2_record?.losses ?? 0})
//                           </span>
//                         </div>
//                         <span className={`text-lg font-bold ${t2Win ? 'text-green-400' : 'text-white'}`}>
//                           {t2.toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </TabsContent>
//         ))}

//         {/* Leaderboard */}
//         <TabsContent value="leaderboard">
//           <ScrollArea className="max-h-[80vh] mt-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {leaderboard.map((team, i) => (
//                 <Card key={i} className="bg-[#1e1f24] border border-gray-700 rounded-xl text-white">
//                   <CardContent className="p-4 flex justify-between items-center">
//                     <div>
//                       <div className="text-xl font-bold">
//                         #{i + 1} {team.team_name}
//                       </div>
//                       <div className="text-sm text-gray-400">{team.league_name}</div>
//                     </div>
//                     <div className="text-2xl font-extrabold">{team.points.toFixed(2)}</div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </ScrollArea>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Record {
  wins: number;
  losses: number;
}

interface Matchup {
  league_name: string;
  matchup_id: number;
  team_1_name: string;
  team_1_score: string;
  team_2_name: string;
  team_2_score: string;
  team_1_record?: Record;
  team_2_record?: Record;
}

interface LeaderboardEntry {
  team_name: string;
  points: number;
  league_name: string;
}

export default function WeeklyMatchups() {
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentWeek, setCurrentWeek] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/weekly?week=${selectedWeek}`);
      const data = await res.json();
      setMatchups(data.matchups);
      setLeaderboard(data.leaderboard);
      setCurrentWeek(data.week);
    };
    load();

    const interval = setInterval(load, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [selectedWeek]);

  const leagues = [...new Set(matchups.map(m => m.league_name))];

  return (
    <div className="min-h-screen bg-[#0f1115] text-white p-6 space-y-8">
      <h1 className="text-4xl font-bold text-center">
        🏈 Sleeper Weekly Matchups (Week {selectedWeek})
      </h1>

      <div className="flex justify-center mt-4">
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
          className="bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-600"
        >
          {Array.from({ length: 18 }, (_, i) => i + 1).map((week) => (
            <option key={week} value={week}>
              Week {week}
            </option>
          ))}
        </select>
      </div>

      <Tabs defaultValue={leagues[0]} className="w-full">
        <TabsList className="flex justify-center flex-wrap gap-2 bg-gray-800 rounded-xl p-2">
          {leagues.map((league) => (
            <TabsTrigger
              key={league}
              value={league}
              className="text-white data-[state=active]:bg-gray-600 data-[state=active]:text-white"
            >
              {league}
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="leaderboard"
            className="text-white data-[state=active]:bg-yellow-500 data-[state=active]:text-black"
          >
            Leaderboard
          </TabsTrigger>
        </TabsList>

        {leagues.map((league) => (
          <TabsContent key={league} value={league}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {matchups
                .filter((m) => m.league_name === league)
                .map((m, i) => {
                  const t1 = parseFloat(m.team_1_score);
                  const t2 = parseFloat(m.team_2_score);
                  const t1Win = t1 > t2;
                  const t2Win = t2 > t1;

                  return (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-[#1e1f24] to-[#2d2f36] rounded-2xl shadow-md p-5 border border-gray-700"
                    >
                      <div className="text-center text-gray-400 text-sm mb-2">
                        Matchup #{m.matchup_id}
                      </div>

                      <div className="flex justify-between items-center mb-2">
                        <div className="flex flex-col">
                          <span className={t1Win ? 'text-green-400 font-bold' : 'font-bold'}>
                            {m.team_1_name}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({m.team_1_record?.wins ?? 0}-{m.team_1_record?.losses ?? 0})
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${t1Win ? 'text-green-400' : 'text-white'}`}>
                          {t1.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className={t2Win ? 'text-green-400 font-bold' : 'font-bold'}>
                            {m.team_2_name}
                          </span>
                          <span className="text-sm text-gray-400">
                            ({m.team_2_record?.wins ?? 0}-{m.team_2_record?.losses ?? 0})
                          </span>
                        </div>
                        <span className={`text-lg font-bold ${t2Win ? 'text-green-400' : 'text-white'}`}>
                          {t2.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </TabsContent>
        ))}

        <TabsContent value="leaderboard">
          <ScrollArea className="max-h-[80vh] mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard.map((team, i) => (
                <Card key={i} className="bg-[#1e1f24] border border-gray-700 rounded-xl text-white">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <div className="text-xl font-bold">
                        #{i + 1} {team.team_name}
                      </div>
                      <div className="text-sm text-gray-400">{team.league_name}</div>
                    </div>
                    <div className="text-2xl font-extrabold">{team.points.toFixed(2)}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

