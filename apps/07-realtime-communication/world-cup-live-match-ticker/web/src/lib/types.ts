export type TeamSide = 'home' | 'away';

export type Team = {
  name: string;
  abbreviation: string;
  color: string;
  logo: string | null;
};

export type MatchInfo = {
  matchId: string;
  title: string;
  venue: string;
  attendance: number | null;
  kickoff: string;
  home: Team;
  away: Team;
  source: string;
};

export type CommentaryKind =
  | 'kickoff'
  | 'goal'
  | 'yellow-card'
  | 'red-card'
  | 'substitution'
  | 'var'
  | 'shot'
  | 'corner'
  | 'foul'
  | 'offside'
  | 'period'
  | 'other';

export type Pair = { home: number; away: number };

export type ScoreUpdate = {
  home: number;
  away: number;
  minute: string;
  side: TeamSide | null;
  text: string;
};

export type Commentary = {
  minute: string;
  kind: CommentaryKind;
  side: TeamSide | null;
  text: string;
};

export type StadiumStats = {
  viewers: number;
  shots: Pair;
  shotsOnTarget: Pair;
  corners: Pair;
  fouls: Pair;
  yellowCards: Pair;
  redCards: Pair;
  offsides: Pair;
};

export type FeedData = {
  'score-update': ScoreUpdate;
  'match-commentary': Commentary;
  'stadium-stats': StadiumStats;
};

export type FeedEventType = keyof FeedData;

export type FeedEvent = {
  [T in FeedEventType]: { id: number; type: T; data: FeedData[T] };
}[FeedEventType];

export type MatchSummary = {
  info: MatchInfo;
  score: Pair;
  clock: string; // "67'", "HT", "FT", or "KO" before the first minute
  viewers: number;
};
