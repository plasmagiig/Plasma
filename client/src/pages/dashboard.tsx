import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Loader2, TrendingUp, Users, Zap, DollarSign, Video, Smartphone, FileText } from "lucide-react";
import EnergyBar from "@/components/energy-bar";

export default function Dashboard() {
  const currentUserId = "user-1"; // Mock current user

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/users", currentUserId],
  });

  const { data: userContent, isLoading: contentLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "content"],
  });

  const { data: earningsSummary, isLoading: earningsLoading } = useQuery({
    queryKey: ["/api/users", currentUserId, "earnings", "summary"],
  });

  if (userLoading || contentLoading || earningsLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-plasma-blue" />
        <span className="ml-2 text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  const contentStats = userContent?.reduce((acc: any, content: any) => {
    acc.total++;
    acc[content.type] = (acc[content.type] || 0) + 1;
    acc.totalBoosts += content.energyBoosts || 0;
    acc.totalResonance += content.resonance || 0;
    acc.totalAmplify += content.amplify || 0;
    return acc;
  }, { total: 0, video: 0, giig: 0, post: 0, totalBoosts: 0, totalResonance: 0, totalAmplify: 0 }) || {};

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-orbitron font-bold mb-4 animate-glow">Creator Command Center</h1>
          <p className="text-xl text-gray-400">Real-time analytics and earnings dashboard</p>
        </div>

        {/* Energy Flow Indicator */}
        <EnergyBar />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Analytics */}
          <div className="lg:col-span-2 space-y-8">
            {/* Earnings Overview */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-plasma-blue" />
                  Energy Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-plasma-blue mb-2" data-testid="text-earnings-today">
                      ${earningsSummary?.today?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-400">Today</div>
                    <div className="text-xs text-green-400">+12.5%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-plasma-purple mb-2" data-testid="text-earnings-week">
                      ${earningsSummary?.thisWeek?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-400">This Week</div>
                    <div className="text-xs text-green-400">+8.3%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-plasma-pink mb-2" data-testid="text-earnings-month">
                      ${earningsSummary?.thisMonth?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-400">This Month</div>
                    <div className="text-xs text-green-400">+15.7%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2" data-testid="text-earnings-total">
                      ${earningsSummary?.total?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-400">All Time</div>
                    <div className="text-xs text-green-400">+23.1%</div>
                  </div>
                </div>

                {/* Revenue Sources */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold mb-4">Energy Sources</h4>
                  
                  <div className="flex items-center justify-between p-4 bg-plasma-surface/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-plasma-blue rounded-full flex items-center justify-center">
                        <Zap className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Energy Boosts</div>
                        <div className="text-sm text-gray-400">Direct support from audience</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$1,234.56</div>
                      <div className="text-sm text-gray-400">43.4%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-plasma-surface/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-plasma-purple rounded-full flex items-center justify-center">
                        <Users className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Plasma Subscriptions</div>
                        <div className="text-sm text-gray-400">Monthly recurring revenue</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$987.65</div>
                      <div className="text-sm text-gray-400">34.7%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-plasma-surface/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-plasma-pink rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Creator Store</div>
                        <div className="text-sm text-gray-400">Products and merchandise</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$625.72</div>
                      <div className="text-sm text-gray-400">21.9%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content Performance */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-plasma-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Video className="h-8 w-8 text-plasma-blue" />
                    </div>
                    <div className="text-2xl font-bold mb-2" data-testid="text-videos-count">{contentStats.video || 0}</div>
                    <div className="text-sm text-gray-400">Videos</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-plasma-purple/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Smartphone className="h-8 w-8 text-plasma-purple" />
                    </div>
                    <div className="text-2xl font-bold mb-2" data-testid="text-giigs-count">{contentStats.giig || 0}</div>
                    <div className="text-sm text-gray-400">Giigs</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-plasma-pink/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-plasma-pink" />
                    </div>
                    <div className="text-2xl font-bold mb-2" data-testid="text-posts-count">{contentStats.post || 0}</div>
                    <div className="text-sm text-gray-400">Posts</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Upload */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="h-6 w-6 text-plasma-purple" />
                  Quick Upload
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full p-4 border-2 border-dashed border-plasma-blue/30 bg-transparent hover:border-plasma-blue/60 hover:bg-plasma-blue/10"
                  data-testid="button-upload-video"
                >
                  <div className="flex flex-col items-center">
                    <Video className="h-6 w-6 text-plasma-blue mb-2" />
                    <div className="text-sm font-semibold">Upload Video</div>
                    <div className="text-xs text-gray-400">Long-form content</div>
                  </div>
                </Button>
                
                <Button 
                  className="w-full p-4 border-2 border-dashed border-plasma-purple/30 bg-transparent hover:border-plasma-purple/60 hover:bg-plasma-purple/10"
                  data-testid="button-create-giig"
                >
                  <div className="flex flex-col items-center">
                    <Smartphone className="h-6 w-6 text-plasma-purple mb-2" />
                    <div className="text-sm font-semibold">Create Giig</div>
                    <div className="text-xs text-gray-400">Short-form content</div>
                  </div>
                </Button>
                
                <Button 
                  className="w-full p-4 border-2 border-dashed border-plasma-pink/30 bg-transparent hover:border-plasma-pink/60 hover:bg-plasma-pink/10"
                  data-testid="button-write-post"
                >
                  <div className="flex flex-col items-center">
                    <FileText className="h-6 w-6 text-plasma-pink mb-2" />
                    <div className="text-sm font-semibold">Write Post</div>
                    <div className="text-xs text-gray-400">Text content</div>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-plasma-blue" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Energy Level</span>
                    <span className="font-mono" data-testid="text-energy-level">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Resonance Rate</span>
                    <span className="font-mono" data-testid="text-resonance-rate">76%</span>
                  </div>
                  <Progress value={76} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Growth Rate</span>
                    <span className="font-mono text-green-400" data-testid="text-growth-rate">+23%</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-plasma-blue rounded-full"></div>
                      <span>New boost received</span>
                    </div>
                    <span className="text-gray-400">2m ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-plasma-purple rounded-full"></div>
                      <span>Content went viral</span>
                    </div>
                    <span className="text-gray-400">1h ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-plasma-pink rounded-full"></div>
                      <span>New subscriber</span>
                    </div>
                    <span className="text-gray-400">3h ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
