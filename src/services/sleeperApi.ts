import axios from 'axios';

const SLEEPER_BASE_URL = 'https://api.sleeper.app/v1';

export interface SleeperUser {
  user_id: string;
  username: string;
  display_name: string;
  avatar: string;
}

export interface SleeperLeague {
  league_id: string;
  name: string;
  season: string;
  season_type: string;
  total_rosters: number;
  status: string;
  sport: string;
  settings: {
    max_keepers: number;
    draft_rounds: number;
    trade_deadline: number;
    playoff_week_start: number;
    num_teams: number;
    league_average_match: number;
    leg: number;
    playoff_type: number;
    playoff_round_type: number;
    playoff_seed_type: number;
    squads: number;
    teams: number;
    veto_votes_needed: number;
    veto_auto_poll: number;
    veto_show_votes: number;
    waiver_type: number;
    waiver_clear_days: number;
    waiver_day_of_week: number;
    start_week: number;
    taxi_years: number;
    taxi_allow_vets: number;
    taxi_slots: number;
    taxi_deadline: number;
    reserve_allow_sus: number;
    reserve_allow_cov: number;
    reserve_allow_out: number;
    reserve_allow_doubtful: number;
    reserve_allow_na: number;
    reserve_slots: number;
    playoff_teams: number;
  };
  scoring_settings: Record<string, number>;
  roster_positions: string[];
}

export interface SleeperRoster {
  roster_id: number;
  owner_id: string;
  players: string[];
  starters: string[];
  reserve: string[];
  taxi: string[];
  settings: {
    wins: number;
    losses: number;
    ties: number;
    fpts: number;
    fpts_against: number;
    fpts_decimal: number;
    fpts_against_decimal: number;
  };
}

export interface SleeperPlayer {
  player_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  team: string;
  position: string;
  age: number;
  years_exp: number;
  injury_status: string;
  fantasy_positions: string[];
  number: number;
  depth_chart_position: number;
  depth_chart_order: number;
  status: string;
  sport: string;
  news_updated: number;
}

export class SleeperApiService {
  static async searchUser(username: string): Promise<SleeperUser | null> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/user/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error searching user:', error);
      return null;
    }
  }

  static async getUserLeagues(userId: string, season: string = '2024'): Promise<SleeperLeague[]> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/user/${userId}/leagues/nfl/${season}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching user leagues:', error);
      return [];
    }
  }

  static async getLeague(leagueId: string): Promise<SleeperLeague | null> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/league/${leagueId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching league:', error);
      return null;
    }
  }

  static async getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/league/${leagueId}/rosters`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching league rosters:', error);
      return [];
    }
  }

  static async getLeagueUsers(leagueId: string): Promise<SleeperUser[]> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/league/${leagueId}/users`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching league users:', error);
      return [];
    }
  }

  static async getAllPlayers(): Promise<Record<string, SleeperPlayer>> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/players/nfl`);
      return response.data || {};
    } catch (error) {
      console.error('Error fetching all players:', error);
      return {};
    }
  }

  static async getTrendingPlayers(type: 'add' | 'drop' = 'add', lookback_hours: number = 24, limit: number = 25): Promise<any[]> {
    try {
      const response = await axios.get(`${SLEEPER_BASE_URL}/players/nfl/trending/${type}`, {
        params: { lookback_hours, limit }
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching trending players:', error);
      return [];
    }
  }
}