import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Radio, Share2, Play, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import VideoPlayer from "./video-player";
import GiigPlayer from "./giig-player";

interface ContentCardProps {
  content: {
    id: string;
    type: string;
    title: string;
    description?: string;
    fileUrl?: string;
    thumbnailUrl?: string;
    duration?: number;
    energyBoosts: number;
    resonance: number;
    amplify: number;
    earnings: string;
    createdAt: string;
    user?: {
      id: string;
      username: string;
      displayName: string;
      avatar?: string;
    };
  };
}

export default function ContentCard({ content }: ContentCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [userInteractions, setUserInteractions] = useState<Record<string, boolean>>({});
  const queryClient = useQueryClient();

  const currentUserId = "user-1"; // Mock current user

  const interactionMutation = useMutation({
    mutationFn: async (type: string) => {
      const response = await apiRequest("POST", "/api/interactions", {
        userId: currentUserId,
        contentId: content.id,
        type,
        energyValue: 1,
      });
      return response.json();
    },
    onSuccess: (data, type) => {
      setUserInteractions(prev => ({ ...prev, [type]: true }));
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Energy Sent!",
        description: `Your ${type} has been added to the plasma stream.`,
      });
    },
    onError: (error: any) => {
      if (error.message.includes("Already interacted")) {
        toast({
          title: "Already Energized",
          description: "You've already interacted with this content.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to send energy. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleInteraction = (type: string) => {
    if (userInteractions[type]) return;
    interactionMutation.mutate(type);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMedia = () => {
    if (content.type === "video") {
      return (
        <div className="relative mb-4 rounded-xl overflow-hidden group aspect-video">
          {isPlaying ? (
            <VideoPlayer
              src={content.fileUrl || ""}
              onClose={() => setIsPlaying(false)}
            />
          ) : (
            <>
              <img 
                src={content.thumbnailUrl || "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&w=400&h=225&fit=crop"} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Button
                  size="lg"
                  className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full hover:scale-110 transition-transform p-0"
                  onClick={() => setIsPlaying(true)}
                  data-testid="button-play-video"
                >
                  <Play className="h-6 w-6 text-white ml-1" />
                </Button>
              </div>
              {content.duration && (
                <Badge className="absolute top-3 right-3 bg-plasma-purple/80 backdrop-blur-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(content.duration)}
                </Badge>
              )}
            </>
          )}
        </div>
      );
    }

    if (content.type === "giig") {
      return (
        <div className="relative mb-4 rounded-xl overflow-hidden group aspect-[9/16] max-h-80">
          {isPlaying ? (
            <GiigPlayer
              src={content.fileUrl || ""}
              onClose={() => setIsPlaying(false)}
            />
          ) : (
            <>
              <img 
                src={content.thumbnailUrl || "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&w=300&h=533&fit=crop"} 
                alt={content.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <Button
                  size="sm"
                  className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full hover:scale-110 transition-transform p-0"
                  onClick={() => setIsPlaying(true)}
                  data-testid="button-play-giig"
                >
                  <Play className="h-4 w-4 text-white ml-1" />
                </Button>
              </div>
              {content.duration && (
                <Badge className="absolute top-3 right-3 bg-plasma-blue/80 backdrop-blur-sm">
                  <Clock className="h-3 w-3 mr-1" />
                  0:{content.duration}
                </Badge>
              )}
              <Badge className="absolute bottom-3 left-3 bg-plasma-pink/80 backdrop-blur-sm">
                GIIG
              </Badge>
            </>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <Card className="content-card glass-morphism rounded-2xl p-6 animate-float hover:animate-plasma-pulse" data-testid={`content-card-${content.id}`}>
      <CardContent className="p-0">
        {/* Creator Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img 
              src={content.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=40&h=40&fit=crop"} 
              alt={content.user?.displayName}
              className="w-10 h-10 rounded-full"
              data-testid="img-creator-avatar"
            />
            <div>
              <p className="font-semibold" data-testid="text-creator-name">{content.user?.displayName || "Creator"}</p>
              <p className="text-sm text-gray-400" data-testid="text-creator-category">Creator</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-plasma-blue rounded-full animate-pulse"></div>
            <span className="text-sm font-mono" data-testid="text-energy-count">{content.energyBoosts}⚡</span>
          </div>
        </div>

        {/* Media Content */}
        {renderMedia()}

        {/* Content Details */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg" data-testid="text-content-title">{content.title}</h3>
          
          {content.description && (
            <p className="text-sm text-gray-400 line-clamp-2" data-testid="text-content-description">
              {content.description}
            </p>
          )}

          {/* Post-specific content */}
          {content.type === "post" && (
            <div className="grid grid-cols-3 gap-4 bg-plasma-surface/50 rounded-xl p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-plasma-blue">12.4k</div>
                <div className="text-xs text-gray-400">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-plasma-purple">87%</div>
                <div className="text-xs text-gray-400">Resonance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-plasma-pink">${content.earnings}</div>
                <div className="text-xs text-gray-400">Earned</div>
              </div>
            </div>
          )}

          {/* Interaction Bar */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 hover:scale-110 transition-transform ${userInteractions.boost ? 'text-plasma-blue' : 'text-gray-400 hover:text-plasma-blue'}`}
                onClick={() => handleInteraction("boost")}
                disabled={interactionMutation.isPending || userInteractions.boost}
                data-testid="button-boost"
              >
                <Zap className="h-4 w-4" />
                <span className="text-sm" data-testid="text-boosts-count">{content.energyBoosts}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 hover:scale-110 transition-transform ${userInteractions.resonance ? 'text-plasma-purple' : 'text-gray-400 hover:text-plasma-purple'}`}
                onClick={() => handleInteraction("resonance")}
                disabled={interactionMutation.isPending || userInteractions.resonance}
                data-testid="button-resonance"
              >
                <Radio className="h-4 w-4" />
                <span className="text-sm" data-testid="text-resonance-count">{content.resonance}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center space-x-1 hover:scale-110 transition-transform ${userInteractions.amplify ? 'text-plasma-pink' : 'text-gray-400 hover:text-plasma-pink'}`}
                onClick={() => handleInteraction("amplify")}
                disabled={interactionMutation.isPending || userInteractions.amplify}
                data-testid="button-amplify"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-sm" data-testid="text-amplify-count">{content.amplify}</span>
              </Button>
            </div>
            <div className="text-sm font-mono text-gray-400" data-testid="text-earnings">${content.earnings}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
