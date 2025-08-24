import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Award,
  DollarSign,
  CheckCircle,
  PlayCircle
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import UserAvatar from "./user-avatar";

interface SkillMarketplaceCardProps {
  skill: {
    id: string;
    creatorId: string;
    title: string;
    description: string;
    category: string;
    duration: number;
    price: number;
    difficulty: string;
    thumbnailUrl?: string;
    enrollmentCount: number;
    rating: number;
    creator: {
      username: string;
      displayName: string;
      avatar?: string;
    };
  };
  isEnrolled?: boolean;
  progress?: number;
}

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-400", 
  advanced: "bg-red-500/20 text-red-400"
};

const CATEGORY_ICONS = {
  design: "🎨",
  coding: "💻",
  music: "🎵",
  business: "💼",
  fitness: "💪",
  cooking: "👨‍🍳",
  photography: "📸",
  writing: "✍️"
};

export default function SkillMarketplaceCard({ skill, isEnrolled = false, progress = 0 }: SkillMarketplaceCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/skills/enroll", {
        skillId: skill.id,
        userId: "user-1"
      });
    },
    onSuccess: () => {
      toast({
        title: "Successfully Enrolled! 🎓",
        description: `You can now access "${skill.title}"`,
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/skills"] });
    },
  });

  const handleEnroll = () => {
    enrollMutation.mutate();
  };

  const difficultyClass = DIFFICULTY_COLORS[skill.difficulty as keyof typeof DIFFICULTY_COLORS] || DIFFICULTY_COLORS.beginner;
  const categoryIcon = CATEGORY_ICONS[skill.category.toLowerCase() as keyof typeof CATEGORY_ICONS] || "📚";

  return (
    <Card className="glass-morphism overflow-hidden hover:scale-105 transition-all duration-300 group">
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-plasma-blue/20 to-plasma-purple/20 flex items-center justify-center">
        {skill.thumbnailUrl ? (
          <img 
            src={skill.thumbnailUrl} 
            alt={skill.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-6xl">{categoryIcon}</div>
        )}
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <PlayCircle className="h-16 w-16 text-white" />
        </div>

        {/* Duration Badge */}
        <Badge className="absolute top-2 right-2 bg-black/70 text-white">
          <Clock className="h-3 w-3 mr-1" />
          {skill.duration}min
        </Badge>

        {/* Enrolled Badge */}
        {isEnrolled && (
          <Badge className="absolute top-2 left-2 bg-green-500/90 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Enrolled
          </Badge>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2" data-testid={`skill-title-${skill.id}`}>
              {skill.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-1">
              <UserAvatar user={skill.creator} size="sm" />
              <span className="text-sm text-gray-400">{skill.creator.displayName}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-400">${skill.price}</p>
            <Badge className={`text-xs ${difficultyClass}`}>
              {skill.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400 line-clamp-2">{skill.description}</p>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4 text-plasma-blue" />
              <span>{skill.enrollmentCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span>{skill.rating}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-plasma-purple border-plasma-purple/30">
            {skill.category}
          </Badge>
        </div>

        {/* Progress for enrolled users */}
        {isEnrolled && progress > 0 && (
          <div>
            <div className="flex items-center justify-between text-sm mb-2">
              <span>Your Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Action Button */}
        {isEnrolled ? (
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            data-testid={`continue-skill-${skill.id}`}
          >
            <Play className="h-4 w-4 mr-2" />
            {progress > 0 ? 'Continue Learning' : 'Start Learning'}
          </Button>
        ) : (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full bg-gradient-to-r from-plasma-blue to-plasma-purple hover:from-plasma-blue/80 hover:to-plasma-purple/80"
                data-testid={`enroll-skill-${skill.id}`}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Enroll Now - ${skill.price}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="glass-morphism border-plasma-blue/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-plasma-blue" />
                  <span>Enroll in {skill.title}</span>
                </DialogTitle>
                <DialogDescription>
                  Learn new skills and advance your creator journey with expert-led content.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-plasma-surface/30 rounded-lg">
                  <h4 className="font-medium mb-2">What you'll learn:</h4>
                  <p className="text-sm text-gray-400 mb-3">{skill.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-plasma-blue" />
                      <span>{skill.duration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4 text-plasma-purple" />
                      <span>{skill.difficulty}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{skill.rating}/5 rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-plasma-pink" />
                      <span>{skill.enrollmentCount} students</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-xl font-bold text-green-400">${skill.price}</span>
                </div>

                <Button
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  className="w-full bg-gradient-to-r from-plasma-blue to-plasma-purple"
                  data-testid={`confirm-enroll-${skill.id}`}
                >
                  {enrollMutation.isPending ? "Enrolling..." : `Enroll for $${skill.price}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}