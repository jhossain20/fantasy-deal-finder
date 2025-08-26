import { Player } from '@/types/fantasy';

export const mockPlayers: Player[] = [
  // Quarterbacks
  {
    id: 'mahomes',
    name: 'Patrick Mahomes',
    team: 'KC',
    position: 'QB',
    adp: 12,
    projection: 285,
    currentPerformance: 298,
    value: 92,
    tier: 1,
    bye: 10,
    injury: 'healthy'
  },
  {
    id: 'allen',
    name: 'Josh Allen',
    team: 'BUF',
    position: 'QB',
    adp: 8,
    projection: 310,
    currentPerformance: 325,
    value: 95,
    tier: 1,
    bye: 12,
    injury: 'healthy'
  },
  {
    id: 'burrow',
    name: 'Joe Burrow',
    team: 'CIN',
    position: 'QB',
    adp: 24,
    projection: 275,
    currentPerformance: 285,
    value: 89,
    tier: 2,
    bye: 7,
    injury: 'healthy'
  },

  // Running Backs
  {
    id: 'mccaffrey',
    name: 'Christian McCaffrey',
    team: 'SF',
    position: 'RB',
    adp: 2,
    projection: 320,
    currentPerformance: 342,
    value: 98,
    tier: 1,
    bye: 9,
    injury: 'healthy'
  },
  {
    id: 'henry',
    name: 'Derrick Henry',
    team: 'BAL',
    position: 'RB',
    adp: 18,
    projection: 245,
    currentPerformance: 268,
    value: 88,
    tier: 2,
    bye: 14,
    injury: 'healthy'
  },
  {
    id: 'barkley',
    name: 'Saquon Barkley',
    team: 'PHI',
    position: 'RB',
    adp: 6,
    projection: 280,
    currentPerformance: 295,
    value: 91,
    tier: 1,
    bye: 5,
    injury: 'healthy'
  },

  // Wide Receivers
  {
    id: 'jefferson',
    name: 'Justin Jefferson',
    team: 'MIN',
    position: 'WR',
    adp: 4,
    projection: 295,
    currentPerformance: 315,
    value: 96,
    tier: 1,
    bye: 6,
    injury: 'healthy'
  },
  {
    id: 'chase',
    name: "Ja'Marr Chase",
    team: 'CIN',
    position: 'WR',
    adp: 5,
    projection: 290,
    currentPerformance: 305,
    value: 94,
    tier: 1,
    bye: 7,
    injury: 'healthy'
  },
  {
    id: 'hill',
    name: 'Tyreek Hill',
    team: 'MIA',
    position: 'WR',
    adp: 10,
    projection: 275,
    currentPerformance: 260,
    value: 85,
    tier: 1,
    bye: 6,
    injury: 'questionable'
  },
  {
    id: 'adams',
    name: 'Davante Adams',
    team: 'LV',
    position: 'WR',
    adp: 22,
    projection: 240,
    currentPerformance: 225,
    value: 78,
    tier: 2,
    bye: 10,
    injury: 'healthy'
  },

  // Tight Ends
  {
    id: 'kelce',
    name: 'Travis Kelce',
    team: 'KC',
    position: 'TE',
    adp: 15,
    projection: 225,
    currentPerformance: 240,
    value: 92,
    tier: 1,
    bye: 10,
    injury: 'healthy'
  },
  {
    id: 'andrews',
    name: 'Mark Andrews',
    team: 'BAL',
    position: 'TE',
    adp: 35,
    projection: 185,
    currentPerformance: 195,
    value: 85,
    tier: 2,
    bye: 14,
    injury: 'healthy'
  },

  // Additional players for better variety
  {
    id: 'lamb',
    name: 'CeeDee Lamb',
    team: 'DAL',
    position: 'WR',
    adp: 7,
    projection: 285,
    currentPerformance: 298,
    value: 93,
    tier: 1,
    bye: 7,
    injury: 'healthy'
  },
  {
    id: 'taylor',
    name: 'Jonathan Taylor',
    team: 'IND',
    position: 'RB',
    adp: 16,
    projection: 260,
    currentPerformance: 245,
    value: 82,
    tier: 2,
    bye: 14,
    injury: 'questionable'
  },
  {
    id: 'lamar',
    name: 'Lamar Jackson',
    team: 'BAL',
    position: 'QB',
    adp: 14,
    projection: 290,
    currentPerformance: 305,
    value: 94,
    tier: 1,
    bye: 14,
    injury: 'healthy'
  }
];

export const getPlayersByPosition = (position: string) => 
  mockPlayers.filter(player => player.position === position);

export const getTopValuePlayers = (limit: number = 10) =>
  mockPlayers
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);

export const searchPlayers = (query: string) =>
  mockPlayers.filter(player => 
    player.name.toLowerCase().includes(query.toLowerCase()) ||
    player.team.toLowerCase().includes(query.toLowerCase())
  );