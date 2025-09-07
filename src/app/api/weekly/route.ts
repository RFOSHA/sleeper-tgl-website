import { NextResponse } from 'next/server';

const LEAGUE_ID_MAP = {
  "1255317029158662144": "League 1",
  "1255317690592022528": "League 2",
  "1255318252108664832": "League 3",
  "1255318483655196672": "League 4",
};

export const revalidate = 900; // 15 minutes

type SleeperMatchup = {
  roster_id: number;
  matchup_id: number;
  points: number;
};

type SleeperRoster = {
  roster_id: number;
  owner_id: string;
};

type SleeperUser = {
  user_id: string;
  display_name: string;
};

type MatchupOutput = {
  league_name: string;
  matchup_id: number;
  team_1_name: string;
  team_1_score: string;
  team_2_name: string;
  team_2_score: string;
  team_1_record?: { wins: number; losses: number };
  team_2_record?: { wins: number; losses: number };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedWeek = parseInt(searchParams.get("week") || "0");

  const state = await fetch("https://api.sleeper.app/v1/state/nfl").then((res) => res.json());
  const currentWeek = requestedWeek || (state.week === 0 ? 1 : state.week);

  const allMatchupsThisWeek: MatchupOutput[] = [];
  const recordMap: Record<string, { wins: number; losses: number }> = {};

  for (const [leagueId, leagueName] of Object.entries(LEAGUE_ID_MAP) as [string, string][]) {
    const rosters: SleeperRoster[] = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/rosters`
    ).then((r) => r.json());

    const users: SleeperUser[] = await fetch(
      `https://api.sleeper.app/v1/league/${leagueId}/users`
    ).then((r) => r.json());

    const rosterMap = Object.fromEntries(
      rosters.map((r) => [r.roster_id, r.owner_id])
    );

    const userMap = Object.fromEntries(
      users.map((u) => [u.user_id, u.display_name])
    );

    for (let week = 1; week <= currentWeek; week++) {
      const matchups: SleeperMatchup[] = await fetch(
        `https://api.sleeper.app/v1/league/${leagueId}/matchups/${week}`
      ).then((r) => r.json());

      const grouped = new Map<number, SleeperMatchup[]>();
      matchups.forEach((m) => {
        if (!grouped.has(m.matchup_id)) grouped.set(m.matchup_id, []);
        grouped.get(m.matchup_id)?.push(m);
      });

      for (const [matchupId, pair] of grouped.entries()) {
        if (pair.length === 2) {
          const [t1, t2] = pair;
          const t1Score = parseFloat(t1.points.toString()).toFixed(2);
          const t2Score = parseFloat(t2.points.toString()).toFixed(2);

          const t1Name = userMap[rosterMap[t1.roster_id]] ?? `Roster ${t1.roster_id}`;
          const t2Name = userMap[rosterMap[t2.roster_id]] ?? `Roster ${t2.roster_id}`;

          const id1 = `${leagueName}|${t1Name}`;
          const id2 = `${leagueName}|${t2Name}`;

          recordMap[id1] = recordMap[id1] || { wins: 0, losses: 0 };
          recordMap[id2] = recordMap[id2] || { wins: 0, losses: 0 };

          if (parseFloat(t1Score) > parseFloat(t2Score)) {
            recordMap[id1].wins += 1;
            recordMap[id2].losses += 1;
          } else if (parseFloat(t2Score) > parseFloat(t1Score)) {
            recordMap[id2].wins += 1;
            recordMap[id1].losses += 1;
          }

          if (week === currentWeek) {
            allMatchupsThisWeek.push({
              league_name: leagueName,
              matchup_id: matchupId,
              team_1_name: t1Name,
              team_1_score: t1Score,
              team_2_name: t2Name,
              team_2_score: t2Score,
            });
          }
        }
      }
    }
  }

  allMatchupsThisWeek.forEach((m) => {
    const id1 = `${m.league_name}|${m.team_1_name}`;
    const id2 = `${m.league_name}|${m.team_2_name}`;
    m.team_1_record = recordMap[id1];
    m.team_2_record = recordMap[id2];
  });

  const leaderboard = allMatchupsThisWeek
    .flatMap((m) => [
      {
        team_name: m.team_1_name,
        points: parseFloat(m.team_1_score),
        league_name: m.league_name,
      },
      {
        team_name: m.team_2_name,
        points: parseFloat(m.team_2_score),
        league_name: m.league_name,
      },
    ])
    .sort((a, b) => b.points - a.points);

  return NextResponse.json({
    week: currentWeek,
    matchups: allMatchupsThisWeek,
    leaderboard,
  });
}
