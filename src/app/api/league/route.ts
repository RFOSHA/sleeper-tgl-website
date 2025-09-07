import { NextResponse } from 'next/server';

const LEAGUE_ID_MAP = {
  "1255317029158662144": "League 1",
  "1255317690592022528": "League 2",
  "1255318252108664832": "League 3",
  "1255318483655196672": "League 4",
};

type SleeperRoster = {
  owner_id: string;
  settings: {
    fpts: number;
  };
};

type SleeperUser = {
  user_id: string;
  display_name: string;
};

export const revalidate = 900;

export async function GET() {
  const leaderboard: { team_name: string; points: number; league: string }[] = [];

  for (const [leagueId, leagueName] of Object.entries(LEAGUE_ID_MAP) as [string, string][]) {
    const [rosters, users] = await Promise.all([
      fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`).then(res => res.json()),
      fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`).then(res => res.json()),
    ]);

    const userMap = Object.fromEntries(
      users.map((u: SleeperUser) => [u.user_id, u.display_name])
    );

    for (const r of rosters as SleeperRoster[]) {
      const displayName = userMap[r.owner_id] ?? "Unknown Manager";
      leaderboard.push({
        team_name: displayName,
        points: r.settings?.fpts ?? 0,
        league: leagueName,
      });
    }
  }

  // Sort descending by points
  leaderboard.sort((a, b) => b.points - a.points);

  return NextResponse.json({ leaderboard });
}
