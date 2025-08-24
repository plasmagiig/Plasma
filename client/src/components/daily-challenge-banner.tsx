import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, Users, Zap, X } from "lucide-react";

interface DailyChallengeBannerProps {
  onDismiss?: () => void;
}

export default function DailyChallengeBanner({ onDismiss }: DailyChallengeBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  const challenge = {
    title: "60-Second Creativity",
    description: "Create something amazing in just 60 seconds!",
    hashtag: "#Create60",
    reward: 500,
    participants: 12847,
    timeLeft: "18h 42m",
    progress: 23, // user progress percentage
    isParticipating: false,
  };

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  const handleJoin = () => {
    // Navigate to create page with challenge context
    window.location.href = `/create?challenge=${encodeURIComponent(challenge.hashtag)}`;
  };

  if (!isVisible) return null;

  return (
    <Card className="glass-morphism border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-bold text-lg">Daily Challenge</h3>
                  <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">
                    🔥 Trending
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{challenge.title}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 mb-3">{challenge.description}</p>
            
            <div className="flex items-center space-x-4 mb-3">
              <div className="flex items-center space-x-1 text-sm">
                <Users className="h-4 w-4 text-plasma-blue" />
                <span>{challenge.participants.toLocaleString()} joined</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Clock className="h-4 w-4 text-plasma-pink" />
                <span>{challenge.timeLeft} left</span>
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span>{challenge.reward} points</span>
              </div>
            </div>

            {challenge.isParticipating && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Your Progress</span>
                  <span>{challenge.progress}%</span>
                </div>
                <Progress value={challenge.progress} className="h-2" />
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <Button
              onClick={handleJoin}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
              data-testid="join-challenge"
            >
              {challenge.isParticipating ? "Continue" : "Join Challenge"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white p-2"
              data-testid="dismiss-challenge"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}