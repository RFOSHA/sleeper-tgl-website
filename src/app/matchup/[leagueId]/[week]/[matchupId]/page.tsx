import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type SleeperUser = {
  user_id: string;
  display_name: string;
};

type SleeperRoster = {
  roster_id: number;
  owner_id: string;
};

type SleeperMatchup = {
  matchup_id: number;
  roster_id: number;
  starters: string[];
  points: number;
};

type SleeperPlayer = {
  full_name?: string;
  position?: string;
  team?: string;
};

async function getMatchupData(leagueId: string, week: string, matchupId: string) {
  const [rostersRes, usersRes, matchupsRes, playersRes] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`),
    fetch("https://api.sleeper.app/v1/players/nfl"),
  ]);

  if (!rostersRes.ok || !usersRes.ok || !matchupsRes.ok || !playersRes.ok) return null;

  const rosters: SleeperRoster[] = await rostersRes.json();
  const users: SleeperUser[] = await usersRes.json();
  const matchups: SleeperMatchup[] = await matchupsRes.json();
  const players: Record<string, SleeperPlayer> = await playersRes.json();

  const userMap = Object.fromEntries(users.map((u) => [u.user_id, u.display_name]));
  const rosterMap = Object.fromEntries(rosters.map((r) => [r.roster_id, r.owner_id]));

  const teams = matchups.filter((m) => m.matchup_id.toString() === matchupId);

  if (teams.length !== 2) return null;

  const formattedTeams = teams.map((team) => {
    const ownerId = rosterMap[team.roster_id];
    const manager = userMap[ownerId] || "Unknown";

    return {
      manager,
      points: team.points ?? 0,
      starters:
        team.starters?.map((pid: string) => {
          const player = players[pid] || {};
          return {
            player_id: pid,
            name: player.full_name ?? "Unknown",
            position: player.position ?? "N/A",
            team: player.team ?? "",
          };
        }) ?? [],
    };
  });

  return formattedTeams;
}

export default async function MatchupPage({
  params,
}: {
  params: { leagueId: string; week: string; matchupId: string };
}) {
  const data = await getMatchupData(params.leagueId, params.week, params.matchupId);

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Week {params.week} Matchup Details
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {data.map((team, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-6 shadow">
              <h2 className="text-xl font-semibold mb-4 text-purple-400">
                {team.manager} — {typeof team.points === "number" ? team.points.toFixed(2) : "—"} pts
              </h2>
              <table className="w-full text-sm text-left">
                <thead className="text-gray-400">
                  <tr>
                    <th className="py-1">Player</th>
                    <th className="py-1">Team</th>
                    <th className="py-1">Pos</th>
                  </tr>
                </thead>
                <tbody>
                  {team.starters.map((p) => (
                    <tr key={p.player_id} className="text-gray-200">
                      <td className="py-1">{p.name}</td>
                      <td className="py-1">{p.team}</td>
                      <td className="py-1">{p.position}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
