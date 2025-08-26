import { Player } from '@/types/fantasy';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Heart } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  onSelect?: () => void;
  isSelected?: boolean;
}

const getPositionColor = (position: string) => {
  switch (position) {
    case 'QB': return 'bg-destructive text-destructive-foreground';
    case 'RB': return 'bg-success text-success-foreground';
    case 'WR': return 'bg-secondary text-secondary-foreground';
    case 'TE': return 'bg-warning text-warning-foreground';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getInjuryIcon = (injury?: string) => {
  switch (injury) {
    case 'questionable': return <Heart className="h-3 w-3 text-warning" />;
    case 'doubtful': return <Heart className="h-3 w-3 text-destructive" />;
    case 'out': return <Heart className="h-3 w-3 text-destructive fill-destructive" />;
    default: return null;
  }
};

export const PlayerCard = ({ player, onSelect, isSelected }: PlayerCardProps) => {
  const performanceTrend = player.currentPerformance && player.projection 
    ? player.currentPerformance - player.projection 
    : 0;

  return (
    <Card 
      className={`p-4 transition-all duration-200 cursor-pointer hover:shadow-card ${
        isSelected ? 'ring-2 ring-primary shadow-glow' : ''
      } bg-gradient-card`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className={getPositionColor(player.position)}>
            {player.position}
          </Badge>
          <span className="text-xs font-medium text-muted-foreground">
            {player.team}
          </span>
          {getInjuryIcon(player.injury)}
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Value</div>
          <div className="text-lg font-bold text-primary">{player.value}</div>
        </div>
      </div>

      <div className="mb-3">
        <h3 className="font-semibold text-foreground">{player.name}</h3>
        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
          <span>ADP: {player.adp}</span>
          <span>Tier {player.tier}</span>
          <span>Bye: {player.bye}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Projection:</span>
          <span className="font-medium">{player.projection}</span>
        </div>
        
        {player.currentPerformance && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current:</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{player.currentPerformance}</span>
              {performanceTrend !== 0 && (
                <div className="flex items-center">
                  {performanceTrend > 0 ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={`text-xs ml-1 ${
                    performanceTrend > 0 ? 'text-success' : 'text-destructive'
                  }`}>
                    {performanceTrend > 0 ? '+' : ''}{performanceTrend}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};