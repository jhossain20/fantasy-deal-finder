export interface Player {
  id: string;
  name: string;
  team: string;
  position: 'QB' | 'RB' | 'WR' | 'TE' | 'K' | 'DST';
  adp: number;
  projection: number;
  currentPerformance?: number;
  value: number;
  tier: number;
  bye: number;
  injury?: 'healthy' | 'questionable' | 'doubtful' | 'out';
}

export interface TradeTeam {
  id: string;
  name: string;
  players: Player[];
}

export interface Trade {
  id: string;
  teams: TradeTeam[];
  analysis?: TradeAnalysis;
}

export interface TradeAnalysis {
  fairness: number; // 0-100 scale
  winner?: string;
  recommendations: string[];
  valueChanges: Record<string, number>;
}

export interface League {
  id: string;
  name: string;
  teams: FantasyTeam[];
  settings: LeagueSettings;
}

export interface FantasyTeam {
  id: string;
  name: string;
  owner: string;
  roster: Player[];
  needs: string[];
  strengths: string[];
}

export interface LeagueSettings {
  scoring: 'standard' | 'ppr' | 'half-ppr';
  teamCount: number;
  rosterSize: number;
  startingLineup: Record<string, number>;
}