import { mkdir, readFile, writeFile } from 'node:fs/promises';
import type { CommentaryKind, MatchInfo, Team, TeamSide } from './types.ts';

const ESPN_SUMMARY_URL =
  'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary';
const CACHE_DIR = new URL('../.cache/', import.meta.url);

type EspnCompetitor = {
  homeAway: 'home' | 'away';
  team: {
    displayName: string;
    abbreviation: string;
    color?: string;
    logos?: { href: string }[];
  };
};

type EspnCommentary = {
  sequence: number;
  time: { value: number; displayValue: string };
  text: string;
  play?: {
    type: { type: string };
    team?: { displayName: string };
  };
};

type EspnSummary = {
  header: {
    season?: { name?: string };
    competitions: { date: string; competitors: EspnCompetitor[] }[];
  };
  gameInfo?: { venue?: { fullName?: string }; attendance?: number };
  commentary?: EspnCommentary[];
};

export type ReplayStep = {
  sequence: number;
  clockSeconds: number;
  minute: string;
  kind: CommentaryKind;
  side: TeamSide | null;
  text: string;
};

export type LoadedMatch = { info: MatchInfo; steps: ReplayStep[] };

export async function loadMatch(matchId: string): Promise<LoadedMatch> {
  const summary = await readSummary(matchId);
  return normalize(matchId, summary);
}

async function readSummary(matchId: string): Promise<EspnSummary> {
  const cacheFile = new URL(`espn-${matchId}.json`, CACHE_DIR);

  try {
    return JSON.parse(await readFile(cacheFile, 'utf8')) as EspnSummary;
  } catch {
    console.log(`No cached data for match ${matchId} — fetching from ESPN`);
  }

  const res = await fetch(`${ESPN_SUMMARY_URL}?event=${matchId}`);
  if (!res.ok) {
    throw new Error(`ESPN responded ${res.status} for match ${matchId}`);
  }
  const summary = (await res.json()) as EspnSummary;

  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(cacheFile, JSON.stringify(summary));
  return summary;
}

function normalize(matchId: string, summary: EspnSummary): LoadedMatch {
  const competition = summary.header.competitions[0];
  const home = competition?.competitors.find((c) => c.homeAway === 'home');
  const away = competition?.competitors.find((c) => c.homeAway === 'away');
  if (!competition || !home || !away) {
    throw new Error(`Match ${matchId} has no home/away teams.`);
  }

  const toTeam = (c: EspnCompetitor): Team => {
    const { displayName, abbreviation, color, logos } = c.team;
    return {
      name: displayName,
      abbreviation,
      color: color ?? '888888',
      logo: logos?.[0]?.href ?? null,
    };
  };

  const info: MatchInfo = {
    matchId,
    title: summary.header.season?.name ?? 'FIFA World Cup',
    venue: summary.gameInfo?.venue?.fullName ?? 'Unknown venue',
    attendance: summary.gameInfo?.attendance ?? null,
    kickoff: competition.date,
    home: toTeam(home),
    away: toTeam(away),
    source: 'ESPN',
  };

  const sideOf = (teamName: string | undefined): TeamSide | null => {
    return teamName === home.team.displayName
      ? 'home'
      : teamName === away.team.displayName
        ? 'away'
        : null;
  };

  const toStep = (line: EspnCommentary): ReplayStep => ({
    sequence: line.sequence,
    clockSeconds: line.time.value,
    minute: line.time.displayValue,
    kind: classifyPlay(line.play?.type.type, line.text),
    side: sideOf(line.play?.team?.displayName),
    text: line.text,
  });

  const steps = [...(summary.commentary ?? [])]
    .sort((a, b) => a.sequence - b.sequence)
    .map(toStep);

  return { info, steps };
}

export function classifyPlay(
  playType: string | undefined,
  text: string,
): CommentaryKind {
  if (!playType) {
    return /^(first half|second half|match ends|extra time|halftime)/i.test(
      text,
    )
      ? 'period'
      : 'other';
  }

  if (playType === 'kickoff') return 'kickoff';
  if (playType.startsWith('goal') || playType === 'penalty---scored') {
    return 'goal';
  }

  if (playType === 'yellow-card') return 'yellow-card';
  if (playType.startsWith('red-card')) return 'red-card';
  if (playType === 'substitution') return 'substitution';
  if (playType.startsWith('var')) return 'var';

  if (playType.startsWith('shot') || playType.startsWith('penalty')) {
    return 'shot';
  }

  if (playType === 'corner-awarded') return 'corner';
  if (playType === 'foul' || playType === 'handball') return 'foul';
  if (playType === 'offside') return 'offside';

  if (
    playType === 'halftime' ||
    playType.startsWith('start-') ||
    playType.startsWith('end-')
  ) {
    return playType.includes('delay') ? 'other' : 'period';
  }

  return 'other';
}
