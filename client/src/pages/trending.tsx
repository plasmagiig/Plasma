import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Flame, 
  Clock, 
  Users, 
  Play, 
  Eye,
  Hash,
  Calendar,
  Filter,
  ArrowUp
} from "lucide-react";
import ContentCard from "@/components/content-card";
import { useState } from "react";

export default function Trending() {
  const [timeFilter, setTimeFilter] = useState("today");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const { data: trendingContent, isLoading } = useQuery<any[]>({
    queryKey: ["/api/content/trending", timeFilter, categoryFilter],
  });

  const { data: challenges } = useQuery<any[]>({
    queryKey: ["/api/challenges/active"],
  });

  const { data: trendingHashtags } = useQuery<any[]>({
    queryKey: ["/api/hashtags/trending"],
  });

  const mockChallenges = [
    {
      id: "challenge-1",
      title: "60-Second Creativity",
      hashtag: "#Create60",
      description: "Create something amazing in just 60 seconds!",
      reward: 500,
      participants: 12500,
      endDate: "2025-08-31",
      trending: true
    },
    {
      id: "challenge-2", 
      title: "Eco Warriors",
      hashtag: "#EcoWarrior",
      description: "Show us your green lifestyle tips",
      reward: 750,
      participants: 8300,
      endDate: "2025-09-05",
      trending: false
    }
  ];

  const mockTrendingHashtags = [
    { hashtag: "#TechTips", count: 45200, trend: "+127%" },
    { hashtag: "#CreatorLife", count: 32100, trend: "+89%" },
    { hashtag: "#PlasmaVibes", count: 28900, trend: "+203%" },
    { hashtag: "#Tutorial", count: 19800, trend: "+45%" },
    { hashtag: "#BehindScenes", count: 15600, trend: "+67%" },
  ];

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-plasma-pink to-plasma-purple rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Trending</h1>
              <p className="text-gray-400">What's hot right now</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="text-plasma-blue border-plasma-blue">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-plasma-surface/50">
            <TabsTrigger value="content" className="data-[state=active]:bg-plasma-blue">
              <Flame className="h-4 w-4 mr-2" />
              Hot Content
            </TabsTrigger>
            <TabsTrigger value="challenges" className="data-[state=active]:bg-plasma-purple">
              <Calendar className="h-4 w-4 mr-2" />
              Challenges
            </TabsTrigger>
            <TabsTrigger value="hashtags" className="data-[state=active]:bg-plasma-pink">
              <Hash className="h-4 w-4 mr-2" />
              Hashtags
            </TabsTrigger>
            <TabsTrigger value="creators" className="data-[state=active]:bg-plasma-blue">
              <Users className="h-4 w-4 mr-2" />
              Creators
            </TabsTrigger>
          </TabsList>

          {/* Hot Content */}
          <TabsContent value="content" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Trending Content</h2>
              <div className="flex space-x-2">
                <Button
                  variant={timeFilter === "today" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeFilter("today")}
                  className={timeFilter === "today" ? "bg-plasma-blue" : ""}
                >
                  Today
                </Button>
                <Button
                  variant={timeFilter === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeFilter("week")}
                  className={timeFilter === "week" ? "bg-plasma-blue" : ""}
                >
                  This Week
                </Button>
                <Button
                  variant={timeFilter === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeFilter("month")}
                  className={timeFilter === "month" ? "bg-plasma-blue" : ""}
                >
                  This Month
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-plasma-surface/50 rounded-xl h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingContent?.map((content: any, index: number) => (
                  <div key={content.id} className="relative">
                    <Badge className="absolute -top-2 -left-2 z-10 bg-gradient-to-r from-plasma-pink to-plasma-purple">
                      #{index + 1} Trending
                    </Badge>
                    <ContentCard content={content} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Challenges */}
          <TabsContent value="challenges" className="space-y-6">
            <h2 className="text-xl font-semibold">Active Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockChallenges.map((challenge) => (
                <Card key={challenge.id} className="glass-morphism overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      {challenge.trending && (
                        <Badge className="bg-gradient-to-r from-plasma-pink to-plasma-purple">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Hot
                        </Badge>
                      )}
                    </div>
                    <Badge variant="outline" className="w-fit text-plasma-blue border-plasma-blue">
                      {challenge.hashtag}
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm">{challenge.description}</p>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4 text-plasma-purple" />
                          <span>{challenge.participants.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-plasma-pink" />
                          <span>Ends {challenge.endDate}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-yellow-500 font-semibold">
                        🏆 {challenge.reward} points reward
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-plasma-blue to-plasma-purple">
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hashtags */}
          <TabsContent value="hashtags" className="space-y-6">
            <h2 className="text-xl font-semibold">Trending Hashtags</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockTrendingHashtags.map((tag, index) => (
                <Card key={tag.hashtag} className="glass-morphism hover:scale-105 transition-transform cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-lg font-semibold text-plasma-blue">{tag.hashtag}</span>
                      <Badge className="bg-green-500/20 text-green-400">
                        <ArrowUp className="h-3 w-3 mr-1" />
                        {tag.trend}
                      </Badge>
                    </div>
                    <div className="text-2xl font-bold mb-1">{tag.count.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">posts today</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Top Creators */}
          <TabsContent value="creators" className="space-y-6">
            <h2 className="text-xl font-semibold">Rising Creators</h2>
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-plasma-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
              <p className="text-gray-400">Creator leaderboard is being developed</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}