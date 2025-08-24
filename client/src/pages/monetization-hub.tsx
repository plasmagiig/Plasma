import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  Zap,
  BookOpen,
  Building,
  Coins,
  BarChart3,
  Gift,
  Star,
  Target,
  Sparkles
} from "lucide-react";
import CreatorTokenWidget from "@/components/creator-token-widget";
import SkillMarketplaceCard from "@/components/skill-marketplace-card";
import BrandPartnershipCard from "@/components/brand-partnership-card";

export default function MonetizationHub() {
  const { data: earnings } = useQuery<any>({
    queryKey: ["/api/earnings/summary"],
  });

  const { data: partnerships } = useQuery<any[]>({
    queryKey: ["/api/partnerships"],
  });

  const { data: skills } = useQuery<any[]>({
    queryKey: ["/api/skills/mine"],
  });

  // Mock data for demo
  const mockEarnings = {
    totalEarnings: 12847.65,
    monthlyGrowth: 34.2,
    tokenDividends: 2156.30,
    skillSales: 5890.20,
    brandDeals: 4801.15,
    energyRewards: 1245.80,
    collaborations: 1098.50
  };

  const mockCreator = {
    id: "user-1",
    username: "alexchen", 
    displayName: "Alex Chen",
    avatar: undefined
  };

  const mockSkills = [
    {
      id: "skill-1",
      creatorId: "user-1",
      title: "Advanced Video Editing Techniques",
      description: "Master professional video editing with advanced color grading, motion graphics, and storytelling techniques",
      category: "design",
      duration: 45,
      price: 39.99,
      difficulty: "intermediate",
      thumbnailUrl: undefined,
      enrollmentCount: 847,
      rating: 4.8,
      creator: mockCreator
    },
    {
      id: "skill-2", 
      creatorId: "user-1",
      title: "Content Strategy for Social Media",
      description: "Build a winning content strategy that drives engagement and grows your audience organically",
      category: "business",
      duration: 30,
      price: 29.99,
      difficulty: "beginner",
      thumbnailUrl: undefined,
      enrollmentCount: 1203,
      rating: 4.9,
      creator: mockCreator
    }
  ];

  const mockPartnerships = [
    {
      id: "partnership-1",
      brandName: "TechFlow",
      campaignTitle: "Creator Tools Review Series",
      description: "Create authentic review content showcasing TechFlow's creator toolkit for your audience",
      budget: 5000,
      requirements: JSON.stringify({
        contentType: "Video Review",
        platforms: ["YouTube", "Instagram", "TikTok"],
        minFollowers: 10000,
        deliverables: [
          "1 main review video (10-15 minutes)",
          "3 short-form social posts",
          "Stories showcasing features"
        ]
      }),
      status: "pending",
      matchScore: 92,
      deadline: "2025-09-15T00:00:00Z",
      createdAt: "2025-08-20T00:00:00Z"
    },
    {
      id: "partnership-2",
      brandName: "CreativePro",
      campaignTitle: "Design Software Tutorial",
      description: "Showcase CreativePro's new AI design features through educational content",
      budget: 3500,
      requirements: JSON.stringify({
        contentType: "Tutorial",
        platforms: ["YouTube", "Website"],
        minFollowers: 5000,
        deliverables: [
          "Tutorial video (20-30 minutes)",
          "Written guide with screenshots"
        ]
      }),
      status: "accepted",
      matchScore: 87,
      deadline: "2025-09-01T00:00:00Z",
      createdAt: "2025-08-15T00:00:00Z"
    }
  ];

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-7xl px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Monetization Hub</h1>
              <p className="text-gray-400">Revolutionary ways to earn from your creativity</p>
            </div>
          </div>
          
          <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            New Revenue Streams Available!
          </Badge>
        </div>

        {/* Earnings Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass-morphism border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Earnings</p>
                  <p className="text-2xl font-bold">${mockEarnings.totalEarnings.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="flex items-center space-x-1 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+{mockEarnings.monthlyGrowth}% this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Token Dividends</p>
                  <p className="text-2xl font-bold">${mockEarnings.tokenDividends.toLocaleString()}</p>
                </div>
                <Coins className="h-6 w-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-400 mt-2">From 1,247 investors</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Skill Sales</p>
                  <p className="text-2xl font-bold">${mockEarnings.skillSales.toLocaleString()}</p>
                </div>
                <BookOpen className="h-6 w-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-400 mt-2">2,050 students enrolled</p>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-l-4 border-l-pink-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Brand Partnerships</p>
                  <p className="text-2xl font-bold">${mockEarnings.brandDeals.toLocaleString()}</p>
                </div>
                <Building className="h-6 w-6 text-pink-500" />
              </div>
              <p className="text-sm text-gray-400 mt-2">5 active campaigns</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tokens" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-plasma-surface/50">
            <TabsTrigger value="tokens" className="data-[state=active]:bg-blue-500">
              <Coins className="h-4 w-4 mr-2" />
              Creator Tokens
            </TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-purple-500">
              <BookOpen className="h-4 w-4 mr-2" />
              Skill Marketplace
            </TabsTrigger>
            <TabsTrigger value="partnerships" className="data-[state=active]:bg-green-500">
              <Building className="h-4 w-4 mr-2" />
              Brand Partnerships
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-pink-500">
              <BarChart3 className="h-4 w-4 mr-2" />
              Revenue Analytics
            </TabsTrigger>
          </TabsList>

          {/* Creator Tokens */}
          <TabsContent value="tokens" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Creator Equity Tokens</h2>
                <p className="text-gray-400">Let fans invest in your success and share in your growth</p>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                <Target className="h-4 w-4 mr-2" />
                Manage Token
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CreatorTokenWidget creatorId="user-1" creator={mockCreator} />
              
              <Card className="glass-morphism">
                <CardHeader>
                  <CardTitle>Token Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Market Cap</span>
                      <span className="font-bold">$24,500</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Your Revenue Share</span>
                      <span className="font-bold text-green-400">15%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Dividends Paid</span>
                      <span className="font-bold">$2,156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Marketplace */}
          <TabsContent value="skills" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Skill Marketplace</h2>
                <p className="text-gray-400">Monetize your expertise through micro-learning experiences</p>
              </div>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500">
                <BookOpen className="h-4 w-4 mr-2" />
                Create Skill
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockSkills.map((skill) => (
                <SkillMarketplaceCard 
                  key={skill.id} 
                  skill={skill}
                  isEnrolled={false}
                />
              ))}
            </div>
          </TabsContent>

          {/* Brand Partnerships */}
          <TabsContent value="partnerships" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold mb-2">AI-Powered Brand Matching</h2>
                <p className="text-gray-400">Perfect partnerships found automatically based on your content and audience</p>
              </div>
              <Button className="bg-gradient-to-r from-green-500 to-blue-500">
                <Target className="h-4 w-4 mr-2" />
                Find Partnerships
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockPartnerships.map((partnership) => (
                <BrandPartnershipCard key={partnership.id} partnership={partnership} />
              ))}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Revenue Analytics</h2>
            
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-plasma-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h3>
              <p className="text-gray-400">Detailed revenue tracking and forecasting tools</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}