import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  TrendingUp, 
  Flame, 
  Star, 
  Users, 
  Zap, 
  Search, 
  Hash,
  Play,
  Eye
} from "lucide-react";
import ContentCard from "@/components/content-card";

export default function Discover() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: content } = useQuery<any[]>({
    queryKey: ["/api/content"],
  });

  // Mock trending data for demonstration
  const trendingTopics = [
    { name: "#PlasmaVibes", posts: 1247, growth: "+45%" },
    { name: "#CreatorEconomy", posts: 892, growth: "+32%" },
    { name: "#EnergyBoost", posts: 756, growth: "+28%" },
    { name: "#GiigLife", posts: 645, growth: "+41%" },
    { name: "#PlasmaStudio", posts: 523, growth: "+55%" },
  ];

  const featuredCreators = [
    { name: "Alex Chen", followers: "125K", energy: "4.2M", verified: true },
    { name: "Maya Rodriguez", followers: "98K", energy: "3.8M", verified: true },
    { name: "Jordan Kim", followers: "87K", energy: "3.1M", verified: false },
    { name: "Zara Ahmed", followers: "76K", energy: "2.9M", verified: true },
  ];

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-plasma-blue to-plasma-purple bg-clip-text text-transparent mb-2">
            Discover
          </h1>
          <p className="text-gray-400">Explore trending content, creators, and topics on PLASMA</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search trending topics, creators, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-plasma-surface/50 border-plasma-blue/30 focus:border-plasma-blue text-white placeholder-gray-400"
            data-testid="input-discover-search"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Trending Topics */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-red-500" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {trendingTopics.map((topic, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-plasma-surface/30 rounded-lg hover:bg-plasma-surface/50 transition-colors cursor-pointer"
                    data-testid={`trending-topic-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold text-gray-500">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{topic.name}</h3>
                        <p className="text-sm text-gray-400">{topic.posts} posts</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      {topic.growth}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  Featured Creators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {featuredCreators.map((creator, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 bg-plasma-surface/30 rounded-lg hover:bg-plasma-surface/50 transition-colors cursor-pointer"
                    data-testid={`featured-creator-${index}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-plasma-blue to-plasma-purple rounded-full flex items-center justify-center text-white font-semibold">
                        {creator.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium text-white">{creator.name}</h3>
                          {creator.verified && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-400">{creator.followers} followers</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-plasma-blue text-sm">
                        <Zap className="h-3 w-3" />
                        {creator.energy}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Trending Content */}
          <div className="lg:col-span-2">
            <Card className="glass-morphism mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-plasma-blue" />
                  Trending Content
                </CardTitle>
              </CardHeader>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content?.slice(0, 6).map((item: any) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="glass-morphism mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-plasma-purple" />
              Quick Discover
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-red-500/50 hover:bg-red-500/10"
                data-testid="quick-trending"
              >
                <Flame className="h-6 w-6 text-red-500" />
                <span className="text-sm">Hot Now</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-plasma-blue/50 hover:bg-plasma-blue/10"
                data-testid="quick-videos"
              >
                <Play className="h-6 w-6" />
                <span className="text-sm">Top Videos</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-plasma-purple/50 hover:bg-plasma-purple/10"
                data-testid="quick-creators"
              >
                <Users className="h-6 w-6" />
                <span className="text-sm">Rising Stars</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-yellow-500/50 hover:bg-yellow-500/10"
                data-testid="quick-live"
              >
                <Eye className="h-6 w-6 text-yellow-500" />
                <span className="text-sm">Live Now</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}