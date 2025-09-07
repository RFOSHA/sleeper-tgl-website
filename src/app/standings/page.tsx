'use client';

import { useState, useEffect } from 'react';

const LEAGUES = [
  { id: "1255317029158662144", name: "League 1" },
  { id: "1255317690592022528", name: "League 2" },
  { id: "1255318252108664832", name: "League 3" },
  { id: "1255318483655196672", name: "League 4" },
];

type Entry = {
  team_name: string;
  wins: number;
  losses: number;
  ties: number;
  pf: number;
  pa: number;
};

export default function StandingsPage() {
  const [leagueId, setLeagueId] = useState(LEAGUES[0].id);
  const [data, setData] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/standings?league=${leagueId}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d.standings);
        setLoading(false);
      });
  }, [leagueId]);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">League Standings</h1>

        <div className="flex justify-center">
          <select
            value={leagueId}
            onChange={(e) => setLeagueId(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-md"
          >
            {LEAGUES.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-gray-800 text-left uppercase text-gray-400 tracking-wide">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">W-L-T</th>
                  <th className="py-3 px-4 text-right">PF</th>
                  <th className="py-3 px-4 text-right">PA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.map((entry, index) => (
                  <tr key={entry.team_name} className="hover:bg-gray-900">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{entry.team_name}</td>
                    <td className="py-3 px-4">{entry.wins}-{entry.losses}-{entry.ties}</td>
                    <td className="py-3 px-4 text-right">{entry.pf.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{entry.pa.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
