import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TradeCalculator } from '@/components/TradeCalculator';
import { BestValueTracker } from '@/components/BestValueTracker';
import { LeagueImporter } from '@/components/LeagueImporter';
import { LeagueAnalyzer } from '@/components/LeagueAnalyzer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  BarChart3,
  Zap,
  Target,
  Download
} from 'lucide-react';

const Index = () => {
  const [importedLeague, setImportedLeague] = useState<any>(null);

  const handleLeagueImported = (leagueData: any) => {
    setImportedLeague(leagueData);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-hero text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Calculator className="h-12 w-12" />
              <h1 className="text-5xl font-bold">Fantasy Deal Finder</h1>
            </div>
            <p className="text-xl opacity-90 mb-8">
              Advanced fantasy football trade calculator with multi-team analysis, 
              player valuations, and intelligent trade recommendations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Zap className="h-4 w-4 mr-2" />
                Multi-Team Trades
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Value Analysis
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                <Target className="h-4 w-4 mr-2" />
                Best Value Tracking
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Trade Calculator
            </TabsTrigger>
            <TabsTrigger value="values" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Best Values
            </TabsTrigger>
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Import League
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              League Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator">
            <TradeCalculator />
          </TabsContent>

          <TabsContent value="values">
            <BestValueTracker />
          </TabsContent>

          <TabsContent value="import">
            <LeagueImporter onLeagueImported={handleLeagueImported} />
          </TabsContent>

          <TabsContent value="analysis">
            <LeagueAnalyzer leagueData={importedLeague} />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Calculator className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Multi-Team Trades</h3>
            </div>
            <p className="text-muted-foreground">
              Calculate complex trades involving multiple teams. Add up to any number of teams 
              and analyze fairness across all parties.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Advanced Analysis</h3>
            </div>
            <p className="text-muted-foreground">
              Our algorithm considers ADP, projections, and current performance to 
              provide accurate trade valuations and fairness scores.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">Value Tracking</h3>
            </div>
            <p className="text-muted-foreground">
              Track the best value players across all positions. Identify 
              undervalued assets and potential trade targets.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-card shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Download className="h-8 w-8 text-primary" />
              <h3 className="text-lg font-semibold">League Import</h3>
            </div>
            <p className="text-muted-foreground">
              Import your league from Sleeper, ESPN Fantasy, and other platforms. 
              Get personalized trade recommendations based on your team's needs.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;