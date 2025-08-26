import axios from 'axios';

// ESPN Fantasy API endpoints (unofficial/hidden API)
const ESPN_BASE_URL = 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl';

export interface ESPNLeague {
  id: number;
  name: string;
  status: {
    currentMatchupPeriod: number;
    finalScoringPeriod: number;
    firstScoringPeriod: number;
    isActive: boolean;
    latestScoringPeriod: number;
  };
  settings: {
    name: string;
    size: number;
    rosterSettings: {
      isBenchUnlimited: boolean;
      lineupSlotCounts: Record<string, number>;
    };
    scoringSettings: {
      scoringItems: Array<{
        points: number;
        statId: number;
      }>;
    };
  };
}

export interface ESPNTeam {
  id: number;
  abbrev: string;
  location: string;
  nickname: string;
  owners: string[];
  roster: {
    entries: Array<{
      playerId: number;
      lineupSlotId: number;
      playerPoolEntry: {
        player: {
          id: number;
          fullName: string;
          defaultPositionId: number;
          eligibleSlots: number[];
          stats: Array<{
            seasonId: number;
            statSourceId: number;
            statSplitTypeId: number;
            stats: Record<string, number>;
          }>;
        };
      };
    }>;
  };
}

export interface ESPNPlayer {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  defaultPositionId: number;
  eligibleSlots: number[];
  proTeamId: number;
  stats: Array<{
    seasonId: number;
    stats: Record<string, number>;
  }>;
}

export class ESPNApiService {
  static async getLeague(leagueId: string, seasonId: string = '2024'): Promise<ESPNLeague | null> {
    try {
      const response = await axios.get(`${ESPN_BASE_URL}/seasons/${seasonId}/segments/0/leagues/${leagueId}`, {
        params: {
          view: ['mSettings', 'mTeam', 'modular', 'mNav']
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ESPN league:', error);
      return null;
    }
  }

  static async getLeagueTeams(leagueId: string, seasonId: string = '2024'): Promise<ESPNTeam[]> {
    try {
      const response = await axios.get(`${ESPN_BASE_URL}/seasons/${seasonId}/segments/0/leagues/${leagueId}`, {
        params: {
          view: ['mRoster', 'mTeam']
        }
      });
      return response.data.teams || [];
    } catch (error) {
      console.error('Error fetching ESPN teams:', error);
      return [];
    }
  }

  static async getPlayers(leagueId: string, seasonId: string = '2024'): Promise<ESPNPlayer[]> {
    try {
      const response = await axios.get(`${ESPN_BASE_URL}/seasons/${seasonId}/segments/0/leagues/${leagueId}`, {
        params: {
          view: ['kona_player_info']
        }
      });
      return response.data.players || [];
    } catch (error) {
      console.error('Error fetching ESPN players:', error);
      return [];
    }
  }

  static getPositionName(positionId: number): string {
    const positions: Record<number, string> = {
      0: 'QB',
      2: 'RB',
      4: 'WR',
      6: 'TE',
      16: 'DST',
      17: 'K',
      20: 'BENCH',
      21: 'IR',
      23: 'FLEX'
    };
    return positions[positionId] || 'UNKNOWN';
  }

  static convertESPNPlayerToLocal(espnPlayer: any): any {
    return {
      id: espnPlayer.id.toString(),
      name: espnPlayer.fullName,
      team: espnPlayer.proTeamId ? this.getTeamAbbreviation(espnPlayer.proTeamId) : 'FA',
      position: this.getPositionName(espnPlayer.defaultPositionId),
      adp: 999, // ESPN doesn't provide ADP directly
      projection: this.getProjection(espnPlayer.stats),
      currentPerformance: this.getCurrentPerformance(espnPlayer.stats),
      value: this.calculateValue(espnPlayer.stats),
      tier: 3, // Default tier
      bye: 0, // Would need additional data
      injury: this.getInjuryStatus(espnPlayer.injuryStatus)
    };
  }

  private static getTeamAbbreviation(proTeamId: number): string {
    const teams: Record<number, string> = {
      1: 'ATL', 2: 'BUF', 3: 'CHI', 4: 'CIN', 5: 'CLE', 6: 'DAL', 7: 'DEN', 8: 'DET',
      9: 'GB', 10: 'TEN', 11: 'IND', 12: 'KC', 13: 'LV', 14: 'LAR', 15: 'MIA', 16: 'MIN',
      17: 'NE', 18: 'NO', 19: 'NYG', 20: 'NYJ', 21: 'PHI', 22: 'ARI', 23: 'PIT', 24: 'LAC',
      25: 'SF', 26: 'SEA', 27: 'TB', 28: 'WAS', 29: 'CAR', 30: 'JAX', 33: 'BAL', 34: 'HOU'
    };
    return teams[proTeamId] || 'FA';
  }

  private static getProjection(stats: any[]): number {
    // Extract projection from stats array
    const projectionStat = stats?.find(stat => stat.statSourceId === 1);
    return projectionStat?.stats?.['0'] || 0;
  }

  private static getCurrentPerformance(stats: any[]): number {
    // Extract current performance from stats array
    const actualStat = stats?.find(stat => stat.statSourceId === 0);
    return actualStat?.stats?.['0'] || 0;
  }

  private static calculateValue(stats: any[]): number {
    // Simple value calculation based on projected points
    const projection = this.getProjection(stats);
    return Math.min(100, Math.max(0, Math.round(projection / 3)));
  }

  private static getInjuryStatus(injuryStatus?: string): 'healthy' | 'questionable' | 'doubtful' | 'out' {
    if (!injuryStatus) return 'healthy';
    const status = injuryStatus.toLowerCase();
    if (status.includes('out')) return 'out';
    if (status.includes('doubtful')) return 'doubtful';
    if (status.includes('questionable')) return 'questionable';
    return 'healthy';
  }
}