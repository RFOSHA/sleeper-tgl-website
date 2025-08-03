import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 900;

type SleeperUser = {
  user_id: string;
  display_name: string;
};

type SleeperRoster = {
  roster_id: number;
  owner_id: string;
  settings?: {
    wins?: number;
    losses?: number;
    ties?: number;
    fpts?: number;
    fpts_against?: number;
  };
};

export async function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("league");

  if (!leagueId) {
    return NextResponse.json({ error: "Missing league ID" }, { status: 400 });
  }

  const [rostersRes, usersRes] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
  ]);

  if (!rostersRes.ok || !usersRes.ok) {
    return NextResponse.json({ error: "Failed to fetch data from Sleeper API" }, { status: 502 });
  }

  const rosters: SleeperRoster[] = await rostersRes.json();
  const users: SleeperUser[] = await usersRes.json();

  const userMap = Object.fromEntries(users.map((u) => [u.user_id, u.display_name]));

  const standings = rosters.map((r) => {
    const name = userMap[r.owner_id] ?? `Roster ${r.roster_id}`;
    const s = r.settings ?? {};
    return {
      team_name: name,
      wins: s.wins ?? 0,
      losses: s.losses ?? 0,
      ties: s.ties ?? 0,
      pf: s.fpts ?? 0,
      pa: s.fpts_against ?? 0,
    };
  });

  standings.sort((a, b) => {
    const winDiff = (b.wins - b.losses) - (a.wins - a.losses);
    return winDiff !== 0 ? winDiff : b.pf - a.pf;
  });

  return NextResponse.json({ standings });
}
