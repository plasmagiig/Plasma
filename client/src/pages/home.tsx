import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ContentCard from "@/components/content-card";
import EnergyBar from "@/components/energy-bar";
import DailyChallengeBanner from "@/components/daily-challenge-banner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp, Clock, Zap, Loader2 } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("trending");
  const [filterType, setFilterType] = useState("all");
  
  const { data: content, isLoading, error } = useQuery({
    queryKey: ["/api/content"],
  });

  // Filter and sort content based on user selections
  const filteredContent = content?.filter((item: any) => {
    const matchesSearch = searchQuery === "" || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === "all" || item.type === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Content</h2>
          <p className="text-gray-400">Unable to load the plasma stream. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark pb-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
          <div className="absolute inset-0 opacity-30">
            <div className="w-96 h-96 bg-plasma-blue/20 rounded-full blur-3xl absolute top-20 left-10 animate-float"></div>
            <div className="w-80 h-80 bg-plasma-purple/20 rounded-full blur-3xl absolute bottom-20 right-20 animate-float" style={{animationDelay: '1s'}}></div>
            <div className="w-64 h-64 bg-plasma-pink/20 rounded-full blur-3xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float" style={{animationDelay: '2s'}}></div>
          </div>
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-8xl font-orbitron font-black mb-6 animate-glow">
            PLASMA
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Where Creativity Meets <span className="text-plasma-blue">Energy</span> and <span className="text-plasma-pink">Earnings</span>
          </p>
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
            Break free from traditional social media. Create, share, and monetize your content in the most innovative creator economy platform.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="px-8 py-4 bg-gradient-to-r from-plasma-blue to-plasma-purple hover:scale-105 transition-transform animate-plasma-pulse font-semibold"
              data-testid="button-start-creating"
            >
              Start Creating
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 border-2 border-plasma-pink text-plasma-pink hover:bg-plasma-pink hover:text-white transition-colors font-semibold"
              data-testid="button-explore-stream"
            >
              Explore Stream
            </Button>
          </div>
        </div>
      </section>

      {/* Plasma Stream Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold mb-4">The Plasma Stream</h2>
            <p className="text-xl text-gray-400">Content discovery reimagined with energy-based algorithms</p>
          </div>
          
          {/* Daily Challenge Banner */}
          <DailyChallengeBanner />

          {/* Energy Flow Indicator */}
          <EnergyBar />
          
          {/* Search and Filter Tools */}
          <div className="glass-morphism rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search creators, content, or hashtags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-plasma-surface/50 border-plasma-blue/30 focus:border-plasma-blue text-white placeholder-gray-400"
                  data-testid="input-search-content"
                />
              </div>
              
              {/* Filter by Type */}
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 bg-plasma-surface/50 border-plasma-blue/30" data-testid="select-content-type">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Content</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="giig">Giigs</SelectItem>
                  <SelectItem value="post">Posts</SelectItem>
                  <SelectItem value="livestream">Live Streams</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Sort Options */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-plasma-surface/50 border-plasma-blue/30" data-testid="select-sort-by">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trending">Trending</SelectItem>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="energy">Most Energy</SelectItem>
                  <SelectItem value="earnings">Top Earning</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Quick Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-plasma-blue/20 border-plasma-blue/50 text-plasma-blue"
                onClick={() => setFilterType("video")}
                data-testid="filter-videos"
              >
                <Zap className="h-3 w-3 mr-1" />
                Videos
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-plasma-purple/20 border-plasma-purple/50 text-plasma-purple"
                onClick={() => setFilterType("giig")}
                data-testid="filter-giigs"
              >
                <Clock className="h-3 w-3 mr-1" />
                Giigs
              </Badge>
              <Badge 
                variant="outline" 
                className="cursor-pointer hover:bg-plasma-pink/20 border-plasma-pink/50 text-plasma-pink"
                onClick={() => setSortBy("trending")}
                data-testid="filter-trending"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending Now
              </Badge>
            </div>
          </div>
          
          {/* Content Grid */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-plasma-blue" />
              <span className="ml-2 text-gray-400">Loading plasma stream...</span>
            </div>
          ) : (
            <>
              {/* Results Info */}
              {searchQuery && (
                <div className="text-center mb-6">
                  <p className="text-gray-400">
                    Found {filteredContent?.length || 0} results for "<span className="text-plasma-blue">{searchQuery}</span>"
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto mb-12">
                {filteredContent?.length > 0 ? (
                  filteredContent.map((item: any) => (
                    <ContentCard key={item.id} content={item} />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="w-20 h-20 bg-plasma-surface rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-400 mb-2">No content found</h3>
                    <p className="text-gray-500">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Load More */}
          <div className="text-center">
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-3 bg-gradient-to-r from-plasma-blue/20 to-plasma-purple/20 border border-plasma-blue/30 hover:scale-105 transition-transform"
              data-testid="button-load-more"
            >
              Charge More Content
            </Button>
          </div>
        </div>
      </section>

      {/* Unique Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-orbitron font-bold mb-4">Beyond Social Media</h2>
            <p className="text-xl text-gray-400">Revolutionary features that redefine creator interaction</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Energy Resonance",
                description: "Instead of likes, content builds energy through genuine audience resonance, creating deeper connections.",
                tags: ["Real Engagement", "Quality Focus"]
              },
              {
                icon: "🌊",
                title: "Plasma Streams",
                description: "AI-powered content discovery that flows like energy, connecting creators and audiences organically.",
                tags: ["Smart Discovery", "Organic Growth"]
              },
              {
                icon: "⚛️",
                title: "Creator Fusion",
                description: "Collaborate seamlessly with other creators, sharing energy and building compound content experiences.",
                tags: ["Collaboration", "Shared Success"]
              },
              {
                icon: "🏪",
                title: "Energy Marketplace",
                description: "Buy, sell, and trade creative assets using energy tokens, creating a true creator economy.",
                tags: ["Asset Trading", "Fair Value"]
              },
              {
                icon: "🔮",
                title: "Holographic Profiles",
                description: "3D creator profiles that showcase personality, skills, and energy in immersive experiences.",
                tags: ["3D Experience", "Immersive"]
              },
              {
                icon: "📊",
                title: "Quantum Analytics",
                description: "Advanced multi-dimensional analytics that predict content performance and audience behavior.",
                tags: ["Predictive", "Multi-dimensional"]
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass-morphism rounded-3xl p-8 text-center hover:scale-105 transition-transform"
                data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="w-20 h-20 plasma-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-plasma-pulse text-2xl">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <div className="flex items-center justify-center space-x-2 text-sm">
                  {feature.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="font-mono text-plasma-blue">
                      {tag}
                      {tagIndex < feature.tags.length - 1 && <span className="text-gray-500 ml-2">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-plasma-dark via-plasma-surface to-plasma-dark">
          <div className="absolute inset-0 bg-gradient-to-r from-plasma-blue/20 via-transparent to-plasma-pink/20"></div>
        </div>
        
        <div className="relative z-10 container mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-orbitron font-bold mb-6 animate-glow">
            Ready to Charge Up?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Join the evolution of social media. Create, earn, and connect like never before.
          </p>
          <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
            Be among the first creators to experience the future of content creation and monetization.
          </p>
          
          {/* Email Signup */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-6 py-4 bg-plasma-surface/50 border border-plasma-blue/30 rounded-full focus:outline-none focus:border-plasma-blue text-white placeholder-gray-400"
              data-testid="input-email-signup"
            />
            <Button 
              className="px-8 py-4 bg-gradient-to-r from-plasma-blue to-plasma-purple hover:scale-105 transition-transform animate-plasma-pulse font-semibold"
              data-testid="button-early-access"
            >
              Get Early Access
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <span>👥</span>
              <span data-testid="text-waitlist-count">12,847</span>
              <span>creators waiting</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>⭐</span>
              <span>Invite-only beta</span>
            </div>
            <div className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Launching Q2 2024</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
