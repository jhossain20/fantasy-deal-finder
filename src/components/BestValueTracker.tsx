import { useState } from 'react';
import { Player } from '@/types/fantasy';
import { getTopValuePlayers, getPlayersByPosition } from '@/data/mockPlayers';
import { PlayerCard } from './PlayerCard';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Filter } from 'lucide-react';

export const BestValueTracker = () => {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const topValuePlayers = getTopValuePlayers(15);
  const positionPlayers = {
    QB: getPlayersByPosition('QB').sort((a, b) => b.value - a.value),
    RB: getPlayersByPosition('RB').sort((a, b) => b.value - a.value),
    WR: getPlayersByPosition('WR').sort((a, b) => b.value - a.value),
    TE: getPlayersByPosition('TE').sort((a, b) => b.value - a.value)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Best Value Players
          </h2>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Star className="h-3 w-3" />
          {selectedPlayers.length} selected
        </Badge>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Top Value
          </TabsTrigger>
          <TabsTrigger value="QB">QB</TabsTrigger>
          <TabsTrigger value="RB">RB</TabsTrigger>
          <TabsTrigger value="WR">WR</TabsTrigger>
          <TabsTrigger value="TE">TE</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="text-lg font-semibold">Highest Value Players</h3>
              <Badge variant="outline">Top 15</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topValuePlayers.map((player, index) => (
                <div key={player.id} className="relative">
                  {index < 3 && (
                    <Badge 
                      className="absolute -top-2 -right-2 z-10 bg-gradient-primary"
                    >
                      #{index + 1}
                    </Badge>
                  )}
                  <PlayerCard
                    player={player}
                    onSelect={() => togglePlayerSelection(player.id)}
                    isSelected={selectedPlayers.includes(player.id)}
                  />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {Object.entries(positionPlayers).map(([position, players]) => (
          <TabsContent key={position} value={position} className="mt-6">
            <Card className="p-6 bg-gradient-card shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{position} Rankings</h3>
                <Badge variant="outline">{players.length} players</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {players.map((player, index) => (
                  <div key={player.id} className="relative">
                    <Badge 
                      variant="secondary"
                      className="absolute -top-2 -right-2 z-10"
                    >
                      #{index + 1}
                    </Badge>
                    <PlayerCard
                      player={player}
                      onSelect={() => togglePlayerSelection(player.id)}
                      isSelected={selectedPlayers.includes(player.id)}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {selectedPlayers.length > 0 && (
        <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow">
          <div className="flex items-center gap-3 mb-3">
            <Star className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Selected Players</h3>
          </div>
          <p className="text-sm opacity-90">
            You've selected {selectedPlayers.length} players for potential trades. 
            Use these in your trade calculator to explore deal opportunities.
          </p>
        </Card>
      )}
    </div>
  );
};