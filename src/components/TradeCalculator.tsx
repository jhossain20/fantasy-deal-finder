import { useState } from 'react';
import { Player, TradeTeam } from '@/types/fantasy';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PlayerCard } from './PlayerCard';
import { PlayerSearch } from './PlayerSearch';
import { TradeAnalysis } from './TradeAnalysis';
import { Plus, Minus, BarChart3, Users } from 'lucide-react';

export const TradeCalculator = () => {
  const [teams, setTeams] = useState<TradeTeam[]>([
    { id: '1', name: 'Team A', players: [] },
    { id: '2', name: 'Team B', players: [] }
  ]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const addTeam = () => {
    const newTeam: TradeTeam = {
      id: String(teams.length + 1),
      name: `Team ${String.fromCharCode(65 + teams.length)}`,
      players: []
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (teamId: string) => {
    if (teams.length > 2) {
      setTeams(teams.filter(team => team.id !== teamId));
    }
  };

  const updateTeamName = (teamId: string, name: string) => {
    setTeams(teams.map(team => 
      team.id === teamId ? { ...team, name } : team
    ));
  };

  const addPlayerToTeam = (teamId: string, player: Player) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, players: [...team.players, player] }
        : team
    ));
  };

  const removePlayerFromTeam = (teamId: string, playerId: string) => {
    setTeams(teams.map(team => 
      team.id === teamId 
        ? { ...team, players: team.players.filter(p => p.id !== playerId) }
        : team
    ));
  };

  const getTotalValue = (players: Player[]) => 
    players.reduce((sum, player) => sum + player.value, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Trade Calculator
        </h2>
        <div className="flex gap-2">
          <Button
            onClick={addTeam}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Team
          </Button>
          <Button
            onClick={() => setShowAnalysis(!showAnalysis)}
            variant="default"
            size="sm"
            className="flex items-center gap-2 bg-gradient-primary"
          >
            <BarChart3 className="h-4 w-4" />
            {showAnalysis ? 'Hide' : 'Show'} Analysis
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card key={team.id} className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center justify-between mb-4">
                <Input
                  value={team.name}
                  onChange={(e) => updateTeamName(team.id, e.target.value)}
                  className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                />
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {team.players.length}
                  </Badge>
                  {teams.length > 2 && (
                    <Button
                      onClick={() => removeTeam(team.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">Total Value</div>
                <div className="text-2xl font-bold text-primary">
                  {getTotalValue(team.players)}
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {team.players.map((player) => (
                  <div
                    key={player.id}
                    className="flex items-center justify-between p-2 bg-background/50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={
                        player.position === 'QB' ? 'bg-destructive text-destructive-foreground' :
                        player.position === 'RB' ? 'bg-success text-success-foreground' :
                        player.position === 'WR' ? 'bg-secondary text-secondary-foreground' :
                        player.position === 'TE' ? 'bg-warning text-warning-foreground' :
                        'bg-muted text-muted-foreground'
                      }>
                        {player.position}
                      </Badge>
                      <span className="font-medium">{player.name}</span>
                      <span className="text-xs text-muted-foreground">({player.team})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-primary">
                        {player.value}
                      </span>
                      <Button
                        onClick={() => removePlayerFromTeam(team.id, player.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <PlayerSearch onPlayerSelect={(player) => addPlayerToTeam(team.id, player)} />
            </Card>
          ))}
        </div>

        {showAnalysis && (
          <TradeAnalysis teams={teams} />
        )}
      </div>
    </div>
  );
};