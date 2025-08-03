'use client';

import { useEffect, useState } from 'react';

type LeaderboardEntry = {
  team_name: string;
  points: number;
  league: string;
};

export default function LeaguePage() {
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/league')
      .then((res) => res.json())
      .then((d) => {
        setData(d.leaderboard);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center">Season Standings</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-gray-800 text-left uppercase text-gray-400 tracking-wide">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Team</th>
                  <th className="py-3 px-4">League</th>
                  <th className="py-3 px-4 text-right">Points For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.map((entry, index) => (
                  <tr key={`${entry.team_name}-${entry.league}`} className="hover:bg-gray-900">
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4">{entry.team_name}</td>
                    <td className="py-3 px-4">{entry.league}</td>
                    <td className="py-3 px-4 text-right">{entry.points.toFixed(2)}</td>
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
