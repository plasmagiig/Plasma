import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Calendar, Link as LinkIcon, Users, Zap, TrendingUp, Settings, Edit3 } from "lucide-react";
import ContentCard from "@/components/content-card";
import UserAvatar from "@/components/user-avatar";

export default function Profile() {
  const { username } = useParams();

  const { data: users, isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const user = users?.find((u: any) => u.username === username);

  const { data: userContent, isLoading: contentLoading } = useQuery<any[]>({
    queryKey: ["/api/users", user?.id, "content"],
    enabled: !!user?.id,
  });

  if (usersLoading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-plasma-blue" />
        <span className="ml-2 text-gray-400">Loading profile...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Profile Not Found</h2>
          <p className="text-gray-400">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Profile Header */}
        <Card className="glass-morphism mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar and Basic Info */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <UserAvatar 
                    user={user}
                    size="xl"
                    className="border-4 border-plasma-blue/50"
                    data-testid="profile-avatar"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-plasma-blue rounded-full flex items-center justify-center animate-plasma-pulse">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold mb-2" data-testid="text-display-name">{user.displayName}</h1>
                  <p className="text-plasma-blue text-lg mb-2" data-testid="text-username">@{user.username}</p>
                  {user.bio && (
                    <p className="text-gray-400 max-w-md" data-testid="text-bio">{user.bio}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="md:ml-auto flex gap-3">
                <Button 
                  className="bg-gradient-to-r from-plasma-blue to-plasma-purple hover:scale-105 transition-transform"
                  data-testid="button-follow"
                >
                  Follow
                </Button>
                <Button 
                  variant="outline" 
                  className="border-plasma-pink text-plasma-pink hover:bg-plasma-pink hover:text-white"
                  data-testid="button-message"
                >
                  Message
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                  onClick={() => window.location.href = '/profile/settings'}
                  data-testid="button-edit-profile"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 pt-6 border-t border-gray-700">
              <div className="text-center">
                <div className="text-2xl font-bold text-plasma-blue mb-1" data-testid="text-followers-count">
                  {user.followersCount?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-plasma-purple mb-1" data-testid="text-following-count">
                  {user.followingCount?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-400">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-plasma-pink mb-1" data-testid="text-energy-level">
                  {user.energyLevel?.toLocaleString() || "0"}
                </div>
                <div className="text-sm text-gray-400">Energy Level</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1" data-testid="text-total-earnings">
                  ${parseFloat(user.totalEarnings || "0").toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total Earnings</div>
              </div>
            </div>

            {/* Creator Achievements */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Badge variant="secondary" className="bg-plasma-blue/20 text-plasma-blue">
                🏆 Top Creator
              </Badge>
              <Badge variant="secondary" className="bg-plasma-purple/20 text-plasma-purple">
                ⚡ Energy Master
              </Badge>
              <Badge variant="secondary" className="bg-plasma-pink/20 text-plasma-pink">
                🚀 Viral Content
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-plasma-surface/50 p-1 rounded-lg w-fit">
            <button className="px-4 py-2 rounded-md bg-plasma-blue text-white font-medium" data-testid="tab-all-content">
              All Content
            </button>
            <button className="px-4 py-2 rounded-md text-gray-400 hover:text-white" data-testid="tab-videos">
              Videos
            </button>
            <button className="px-4 py-2 rounded-md text-gray-400 hover:text-white" data-testid="tab-giigs">
              Giigs
            </button>
            <button className="px-4 py-2 rounded-md text-gray-400 hover:text-white" data-testid="tab-posts">
              Posts
            </button>
          </div>
        </div>

        {/* Content Grid */}
        {contentLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-plasma-blue" />
            <span className="ml-2 text-gray-400">Loading content...</span>
          </div>
        ) : userContent && userContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userContent.map((content: any) => (
              <ContentCard 
                key={content.id} 
                content={{
                  ...content,
                  user: {
                    id: user.id,
                    username: user.username,
                    displayName: user.displayName,
                    avatar: user.avatar,
                  }
                }} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-plasma-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Content Yet</h3>
            <p className="text-gray-400">This creator hasn't shared any content yet.</p>
          </div>
        )}
      </div>
    </main>
  );
}
