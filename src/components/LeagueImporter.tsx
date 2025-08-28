import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { SleeperApiService } from '@/services/sleeperApi';
import { ESPNApiService } from '@/services/espnApi';
import { 
  Download, 
  Search, 
  Users, 
  Trophy, 
  ExternalLink,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface LeagueImporterProps {
  onLeagueImported: (leagueData: any) => void;
}

export const LeagueImporter = ({ onLeagueImported }: LeagueImporterProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sleeperUsername, setSleeperUsername] = useState('');
  const [espnLeagueId, setEspnLeagueId] = useState('');
  const [espnS2, setEspnS2] = useState('');
  const [espnSwid, setEspnSwid] = useState('');
  const [foundLeagues, setFoundLeagues] = useState<any[]>([]);
  const [importedLeague, setImportedLeague] = useState<any>(null);

  const searchSleeperLeagues = async () => {
    if (!sleeperUsername.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a Sleeper username",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Find user
      const user = await SleeperApiService.searchUser(sleeperUsername);
      if (!user) {
        toast({
          title: "User Not Found",
          description: "Could not find a Sleeper user with that username",
          variant: "destructive"
        });
        return;
      }

      // Get user's leagues
      const leagues = await SleeperApiService.getUserLeagues(user.user_id);
      setFoundLeagues(leagues);

      toast({
        title: "Leagues Found",
        description: `Found ${leagues.length} leagues for ${user.display_name || user.username}`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Failed to search for leagues. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const importSleeperLeague = async (league: any) => {
    setLoading(true);
    try {
      // Get detailed league data
      const [leagueDetails, rosters, users, allPlayers] = await Promise.all([
        SleeperApiService.getLeague(league.league_id),
        SleeperApiService.getLeagueRosters(league.league_id),
        SleeperApiService.getLeagueUsers(league.league_id),
        SleeperApiService.getAllPlayers()
      ]);

      const importedData = {
        platform: 'sleeper',
        league: leagueDetails,
        rosters,
        users,
        players: allPlayers,
        importedAt: new Date().toISOString()
      };

      setImportedLeague(importedData);
      onLeagueImported(importedData);

      toast({
        title: "League Imported Successfully",
        description: `${league.name} has been imported with ${rosters.length} teams`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import league data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const importESPNLeague = async () => {
    if (!espnLeagueId.trim()) {
      toast({
        title: "League ID Required",
        description: "Please enter an ESPN league ID",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const [league, teams] = await Promise.all([
        ESPNApiService.getLeague(espnLeagueId),
        ESPNApiService.getLeagueTeams(espnLeagueId)
      ]);

      if (!league) {
        toast({
          title: "League Not Found",
          description: "Could not find ESPN league. Check your League ID and privacy settings.",
          variant: "destructive"
        });
        return;
      }

      const importedData = {
        platform: 'espn',
        league,
        teams,
        importedAt: new Date().toISOString()
      };

      setImportedLeague(importedData);
      onLeagueImported(importedData);

      toast({
        title: "ESPN League Imported",
        description: `${league.settings?.name} has been imported`,
      });
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import ESPN league. Make sure the league is public or you have proper access.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Download className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Import Your League
        </h2>
      </div>

      <Tabs defaultValue="sleeper" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sleeper" className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Sleeper
          </TabsTrigger>
          <TabsTrigger value="espn">ESPN Fantasy</TabsTrigger>
        </TabsList>

        <TabsContent value="sleeper" className="space-y-6">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Import from Sleeper</h3>
                <Badge variant="secondary">Free • No API Key Required</Badge>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sleeper-username">Sleeper Username</Label>
                <div className="flex gap-2">
                  <Input
                    id="sleeper-username"
                    placeholder="Enter your Sleeper username"
                    value={sleeperUsername}
                    onChange={(e) => setSleeperUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchSleeperLeagues()}
                  />
                  <Button 
                    onClick={searchSleeperLeagues}
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    Search
                  </Button>
                </div>
              </div>

              {foundLeagues.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Found Leagues:</h4>
                  {foundLeagues.map((league) => (
                    <div key={league.league_id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Trophy className="h-4 w-4 text-warning" />
                        <div>
                          <div className="font-medium">{league.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Users className="h-3 w-3" />
                            {league.total_rosters} teams • {league.season} • {league.status}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => importSleeperLeague(league)}
                        disabled={loading}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Download className="h-3 w-3" />}
                        Import
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="espn" className="space-y-6">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <ExternalLink className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Import from ESPN Fantasy</h3>
                <Badge variant="outline">Public Leagues Only</Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="espn-league-id">League ID</Label>
                  <Input
                    id="espn-league-id"
                    placeholder="Enter ESPN League ID (found in URL)"
                    value={espnLeagueId}
                    onChange={(e) => setEspnLeagueId(e.target.value)}
                  />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">How to find your ESPN League ID:</p>
                      <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                        <li>Go to your ESPN Fantasy league</li>
                        <li>Look at the URL: fantasy.espn.com/football/league?leagueId=<strong>123456</strong></li>
                        <li>Copy the number after "leagueId="</li>
                        <li>Note: Only public leagues can be imported</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={importESPNLeague}
                  disabled={loading}
                  className="w-full flex items-center gap-2"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                  Import ESPN League
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {importedLeague && (
        <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6" />
            <div>
              <h3 className="text-lg font-semibold">League Successfully Imported!</h3>
              <p className="text-sm opacity-90">
                {importedLeague.platform === 'sleeper' 
                  ? `${importedLeague.league?.name} with ${importedLeague.rosters?.length} teams`
                  : `${importedLeague.league?.settings?.name} imported from ESPN`
                }
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};