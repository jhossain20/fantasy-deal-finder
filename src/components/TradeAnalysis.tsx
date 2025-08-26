import { useMemo } from 'react';
import { TradeTeam } from '@/types/fantasy';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Target
} from 'lucide-react';

interface TradeAnalysisProps {
  teams: TradeTeam[];
}

export const TradeAnalysis = ({ teams }: TradeAnalysisProps) => {
  const analysis = useMemo(() => {
    if (teams.length < 2 || teams.some(team => team.players.length === 0)) {
      return null;
    }

    const teamValues = teams.map(team => ({
      id: team.id,
      name: team.name,
      totalValue: team.players.reduce((sum, player) => sum + player.value, 0),
      playerCount: team.players.length,
      positions: team.players.reduce((acc, player) => {
        acc[player.position] = (acc[player.position] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    }));

    const maxValue = Math.max(...teamValues.map(t => t.totalValue));
    const minValue = Math.min(...teamValues.map(t => t.totalValue));
    const valueDifference = maxValue - minValue;
    const fairnessScore = Math.max(0, 100 - (valueDifference / maxValue * 100));

    const winner = teamValues.find(t => t.totalValue === maxValue);
    const loser = teamValues.find(t => t.totalValue === minValue);

    const recommendations = [];
    
    if (fairnessScore < 70) {
      recommendations.push(`Trade heavily favors ${winner?.name}. Consider adding value to balance.`);
    }
    
    if (valueDifference > 50) {
      recommendations.push(`Large value gap (${valueDifference} points). Review player valuations.`);
    }

    // Check for position imbalances
    teamValues.forEach(team => {
      const hasQB = team.positions.QB > 0;
      const hasRB = team.positions.RB > 0;
      const hasWR = team.positions.WR > 0;
      
      if (!hasQB && team.playerCount > 1) {
        recommendations.push(`${team.name} lacks QB depth after trade.`);
      }
      if (!hasRB && team.playerCount > 1) {
        recommendations.push(`${team.name} lacks RB depth after trade.`);
      }
      if (!hasWR && team.playerCount > 1) {
        recommendations.push(`${team.name} lacks WR depth after trade.`);
      }
    });

    if (fairnessScore >= 85) {
      recommendations.push('This appears to be a very fair trade for both sides.');
    }

    return {
      teamValues,
      fairnessScore,
      winner: winner?.name,
      loser: loser?.name,
      valueDifference,
      recommendations
    };
  }, [teams]);

  if (!analysis) {
    return (
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="text-center text-muted-foreground">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>Add players to teams to see trade analysis</p>
        </div>
      </Card>
    );
  }

  const getFairnessColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getFairnessIcon = (score: number) => {
    if (score >= 85) return <CheckCircle className="h-5 w-5 text-success" />;
    if (score >= 70) return <AlertTriangle className="h-5 w-5 text-warning" />;
    return <AlertTriangle className="h-5 w-5 text-destructive" />;
  };

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-gradient-card shadow-card">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="h-6 w-6 text-primary" />
          <h3 className="text-xl font-bold">Trade Analysis</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              {getFairnessIcon(analysis.fairnessScore)}
              <div>
                <div className="text-sm text-muted-foreground">Trade Fairness</div>
                <div className={`text-2xl font-bold ${getFairnessColor(analysis.fairnessScore)}`}>
                  {Math.round(analysis.fairnessScore)}%
                </div>
              </div>
            </div>
            <Progress 
              value={analysis.fairnessScore} 
              className="h-2"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Value Difference</div>
                <div className="text-2xl font-bold text-foreground">
                  {analysis.valueDifference} pts
                </div>
              </div>
            </div>
            {analysis.winner && analysis.winner !== analysis.loser && (
              <Badge variant="secondary" className="flex items-center gap-2 w-fit">
                <TrendingUp className="h-3 w-3" />
                {analysis.winner} wins trade
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-foreground flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Team Values
          </h4>
          {analysis.teamValues.map((team) => (
            <div key={team.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="font-medium">{team.name}</span>
                <Badge variant="outline">{team.playerCount} players</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-primary">{team.totalValue}</span>
                <span className="text-sm text-muted-foreground">pts</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {analysis.recommendations.length > 0 && (
        <Card className="p-6 bg-gradient-card shadow-card">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{rec}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};