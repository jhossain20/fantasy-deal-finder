import { useState, useMemo } from 'react';
import { Player } from '@/types/fantasy';
import { mockPlayers, searchPlayers } from '@/data/mockPlayers';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Search, Plus } from 'lucide-react';

interface PlayerSearchProps {
  onPlayerSelect: (player: Player) => void;
  excludedPlayers?: string[];
}

export const PlayerSearch = ({ onPlayerSelect, excludedPlayers = [] }: PlayerSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const filteredPlayers = useMemo(() => {
    const available = mockPlayers.filter(player => !excludedPlayers.includes(player.id));
    return searchValue ? searchPlayers(searchValue).filter(player => !excludedPlayers.includes(player.id)) : available;
  }, [searchValue, excludedPlayers]);

  const handleSelect = (player: Player) => {
    onPlayerSelect(player);
    setOpen(false);
    setSearchValue('');
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case 'QB': return 'bg-destructive text-destructive-foreground';
      case 'RB': return 'bg-success text-success-foreground';
      case 'WR': return 'bg-secondary text-secondary-foreground';
      case 'TE': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <Plus className="h-4 w-4" />
          Add Player
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Search players..." 
            value={searchValue}
            onValueChange={setSearchValue}
          />
          <CommandList>
            <CommandEmpty>No players found.</CommandEmpty>
            <CommandGroup>
              {filteredPlayers.slice(0, 20).map((player) => (
                <CommandItem
                  key={player.id}
                  onSelect={() => handleSelect(player)}
                  className="flex items-center justify-between p-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={getPositionColor(player.position)}>
                      {player.position}
                    </Badge>
                    <div>
                      <div className="font-medium">{player.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {player.team} • ADP: {player.adp} • Value: {player.value}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};