import { NextRequest, NextResponse } from 'next/server';

export const revalidate = 900;

export async function GET(req: NextRequest) {
  const leagueId = req.nextUrl.searchParams.get("league");

  if (!leagueId) {
    return NextResponse.json({ error: "Missing league ID" }, { status: 400 });
  }

  const [rosters, users] = await Promise.all([
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`).then((r) => r.json()),
    fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`).then((r) => r.json()),
  ]);

  const userMap = Object.fromEntries(users.map((u: any) => [u.user_id, u.display_name]));

  const standings = rosters.map((r: any) => {
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
