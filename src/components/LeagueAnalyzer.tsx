import { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  AlertTriangle,
  BarChart3,
  Trophy,
  Zap
} from 'lucide-react';

interface LeagueAnalyzerProps {
  leagueData: any;
}

export const LeagueAnalyzer = ({ leagueData }: LeagueAnalyzerProps) => {
  const analysis = useMemo(() => {
    if (!leagueData) return null;

    if (leagueData.platform === 'sleeper') {
      return analyzeSleeperLeague(leagueData);
    } else if (leagueData.platform === 'espn') {
      return analyzeESPNLeague(leagueData);
    }

    return null;
  }, [leagueData]);

  if (!analysis) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Import a league to see detailed analysis</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          League Analysis
        </h2>
        <Badge variant="secondary">{analysis.platform}</Badge>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <div>
              <div className="text-2xl font-bold">{analysis.teamCount}</div>
              <div className="text-sm text-muted-foreground">Teams</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-warning" />
            <div>
              <div className="text-2xl font-bold">{analysis.competitiveScore}%</div>
              <div className="text-sm text-muted-foreground">Competitive</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-card shadow-card">
          <div className="flex items-center gap-3">
            <Zap className="h-8 w-8 text-accent" />
            <div>
              <div className="text-2xl font-bold">{analysis.tradeOpportunities}</div>
              <div className="text-sm text-muted-foreground">Trade Ops</div>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="teams" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="teams">Team Analysis</TabsTrigger>
          <TabsTrigger value="trades">Trade Opportunities</TabsTrigger>
          <TabsTrigger value="insights">League Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="teams" className="space-y-4">
          {analysis.teams.map((team: any, index: number) => (
            <Card key={team.id} className="p-4 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Badge variant={index < 3 ? "default" : "secondary"}>
                    #{index + 1}
                  </Badge>
                  <div>
                    <h3 className="font-semibold">{team.name}</h3>
                    <p className="text-sm text-muted-foreground">{team.owner}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{team.totalPoints}</div>
                  <div className="text-xs text-muted-foreground">Total Points</div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-2">Strengths</div>
                  <div className="flex flex-wrap gap-1">
                    {team.strengths.map((strength: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">Needs</div>
                  <div className="flex flex-wrap gap-1">
                    {team.needs.map((need: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="trades" className="space-y-4">
          {analysis.tradeRecommendations.map((trade: any, index: number) => (
            <Card key={index} className="p-4 bg-gradient-card shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Trade Opportunity</h3>
                <Badge variant="secondary">{trade.confidence}% Match</Badge>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">{trade.team1} sends:</div>
                  {trade.team1Gives.map((player: string, i: number) => (
                    <div key={i} className="text-sm text-muted-foreground">• {player}</div>
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">{trade.team2} sends:</div>
                  {trade.team2Gives.map((player: string, i: number) => (
                    <div key={i} className="text-sm text-muted-foreground">• {player}</div>
                  ))}
                </div>
              </div>
              
              <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                <div className="text-sm text-muted-foreground">{trade.reasoning}</div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="p-6 bg-gradient-card shadow-card">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              League Insights
            </h3>
            
            <div className="space-y-4">
              {analysis.insights.map((insight: any, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-background/50 rounded-lg">
                  {insight.type === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-success mt-0.5" />
                  ) : insight.type === 'negative' ? (
                    <TrendingDown className="h-4 w-4 text-destructive mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5" />
                  )}
                  <div className="text-sm">
                    <div className="font-medium mb-1">{insight.title}</div>
                    <div className="text-muted-foreground">{insight.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

function analyzeSleeperLeague(leagueData: any) {
  const { league, rosters, users, players } = leagueData;
  
  // Analyze teams
  const teams = rosters.map((roster: any) => {
    const user = users.find((u: any) => u.user_id === roster.owner_id);
    const teamPlayers = roster.players?.map((playerId: string) => players[playerId]).filter(Boolean) || [];
    
    // Calculate position strengths and needs
    const positions = teamPlayers.reduce((acc: any, player: any) => {
      if (player?.fantasy_positions) {
        player.fantasy_positions.forEach((pos: string) => {
          acc[pos] = (acc[pos] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const strengths = [];
    const needs = [];
    
    if (positions.QB >= 2) strengths.push('QB Depth');
    if (positions.RB >= 4) strengths.push('RB Depth');
    if (positions.WR >= 5) strengths.push('WR Depth');
    if (positions.TE >= 2) strengths.push('TE Depth');
    
    if (!positions.QB || positions.QB < 2) needs.push('QB');
    if (!positions.RB || positions.RB < 3) needs.push('RB');
    if (!positions.WR || positions.WR < 4) needs.push('WR');
    if (!positions.TE || positions.TE < 2) needs.push('TE');

    return {
      id: roster.roster_id,
      name: user?.display_name || user?.username || `Team ${roster.roster_id}`,
      owner: user?.username || 'Unknown',
      totalPoints: roster.settings?.fpts || 0,
      wins: roster.settings?.wins || 0,
      losses: roster.settings?.losses || 0,
      strengths,
      needs,
      players: teamPlayers
    };
  });

  // Sort teams by performance
  teams.sort((a, b) => b.totalPoints - a.totalPoints);

  // Generate trade recommendations
  const tradeRecommendations = generateTradeRecommendations(teams);

  // Calculate competitive score
  const avgPoints = teams.reduce((sum, team) => sum + team.totalPoints, 0) / teams.length;
  const variance = teams.reduce((sum, team) => sum + Math.pow(team.totalPoints - avgPoints, 2), 0) / teams.length;
  const competitiveScore = Math.max(0, 100 - (Math.sqrt(variance) / avgPoints * 100));

  return {
    platform: 'Sleeper',
    teamCount: teams.length,
    competitiveScore: Math.round(competitiveScore),
    tradeOpportunities: tradeRecommendations.length,
    teams,
    tradeRecommendations,
    insights: generateLeagueInsights(teams, league)
  };
}

function analyzeESPNLeague(leagueData: any) {
  const { league, teams } = leagueData;
  
  const analyzedTeams = teams.map((team: any, index: number) => ({
    id: team.id,
    name: `${team.location} ${team.nickname}`,
    owner: team.owners?.[0] || 'Unknown',
    totalPoints: 0, // ESPN data would need more processing
    wins: 0,
    losses: 0,
    strengths: ['Unknown'],
    needs: ['Requires detailed analysis'],
    players: []
  }));

  return {
    platform: 'ESPN',
    teamCount: teams.length,
    competitiveScore: 75, // Default for ESPN
    tradeOpportunities: Math.floor(teams.length / 2),
    teams: analyzedTeams,
    tradeRecommendations: [],
    insights: [
      {
        type: 'info',
        title: 'ESPN Analysis Limited',
        description: 'Full analysis requires additional ESPN API access. Basic information shown.'
      }
    ]
  };
}

function generateTradeRecommendations(teams: any[]) {
  const recommendations = [];
  
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const team1 = teams[i];
      const team2 = teams[j];
      
      // Find complementary needs
      const team1CanHelp = team1.strengths.filter(s => team2.needs.some(n => s.includes(n)));
      const team2CanHelp = team2.strengths.filter(s => team1.needs.some(n => s.includes(n)));
      
      if (team1CanHelp.length > 0 && team2CanHelp.length > 0) {
        recommendations.push({
          team1: team1.name,
          team2: team2.name,
          team1Gives: team1CanHelp.map(s => `${s} Player`),
          team2Gives: team2CanHelp.map(s => `${s} Player`),
          confidence: Math.min(90, 60 + (team1CanHelp.length + team2CanHelp.length) * 10),
          reasoning: `${team1.name} has excess ${team1CanHelp.join(', ')} while ${team2.name} needs it. ${team2.name} can offer ${team2CanHelp.join(', ')} that ${team1.name} needs.`
        });
      }
    }
  }
  
  return recommendations.slice(0, 5); // Top 5 recommendations
}

function generateLeagueInsights(teams: any[], league: any) {
  const insights = [];
  
  const topTeam = teams[0];
  const bottomTeam = teams[teams.length - 1];
  const pointsGap = topTeam.totalPoints - bottomTeam.totalPoints;
  
  if (pointsGap > 200) {
    insights.push({
      type: 'negative',
      title: 'Large Point Gap',
      description: `There's a ${pointsGap} point difference between first and last place, indicating low competitiveness.`
    });
  } else if (pointsGap < 100) {
    insights.push({
      type: 'positive',
      title: 'Competitive League',
      description: `Only ${pointsGap} points separate first and last place. This is a very competitive league!`
    });
  }
  
  const activeTraders = teams.filter(team => team.needs.length < 3).length;
  if (activeTraders > teams.length / 2) {
    insights.push({
      type: 'positive',
      title: 'Active Trading Environment',
      description: `${activeTraders} teams have well-rounded rosters, indicating active trading.`
    });
  }
  
  insights.push({
    type: 'info',
    title: 'League Format',
    description: `${teams.length}-team league with ${league.roster_positions?.length || 'standard'} roster positions.`
  });
  
  return insights;
}