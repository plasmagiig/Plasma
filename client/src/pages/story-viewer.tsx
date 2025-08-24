import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, ChevronLeft, ChevronRight, Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import UserAvatar from "@/components/user-avatar";
import { formatDistanceToNow } from "date-fns";

interface StoryViewerProps {
  storyId?: string;
  userId?: string;
  onClose: () => void;
}

export default function StoryViewer({ storyId, userId, onClose }: StoryViewerProps) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setPaused] = useState(false);
  const queryClient = useQueryClient();

  const { data: stories, isLoading } = useQuery<any[]>({
    queryKey: ["/api/stories", userId || "all"],
    enabled: !!userId || !!storyId,
  });

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  // Mock stories data
  const mockStories = [
    {
      id: "story-1",
      userId: "user-1",
      fileUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
      caption: "Working on something exciting! 🚀",
      viewsCount: 1247,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "story-2", 
      userId: "user-1",
      fileUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&w=400&h=600&fit=crop",
      caption: "Behind the scenes of today's shoot",
      viewsCount: 892,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), 
      expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const currentStories = stories || mockStories;
  const currentStory = currentStories[currentStoryIndex];
  const storyUser = users?.find(u => u.id === currentStory?.userId) || {
    id: "user-1",
    username: "alexchen",
    displayName: "Alex Chen",
    avatar: null
  };

  const viewStoryMutation = useMutation({
    mutationFn: async (storyId: string) => {
      return apiRequest("POST", "/api/stories/view", {
        storyId,
        viewerId: "user-1" // Current user
      });
    },
  });

  // Auto-progress through story
  useEffect(() => {
    if (isPaused || !currentStory) return;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next story
          if (currentStoryIndex < currentStories.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            return 0;
          } else {
            onClose();
            return prev;
          }
        }
        return prev + (100 / 50); // 5 seconds total
      });
    }, 100);

    return () => clearInterval(timer);
  }, [currentStoryIndex, isPaused, currentStories.length, onClose, currentStory]);

  // Mark story as viewed
  useEffect(() => {
    if (currentStory) {
      viewStoryMutation.mutate(currentStory.id);
    }
  }, [currentStory?.id]);

  // Reset progress when story changes
  useEffect(() => {
    setProgress(0);
  }, [currentStoryIndex]);

  const handlePrevious = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStoryIndex < currentStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      onClose();
    }
  };

  if (isLoading || !currentStory) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onMouseDown={() => setPaused(true)}
      onMouseUp={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Progress Bars */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex space-x-1">
          {currentStories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{ 
                  width: index < currentStoryIndex ? '100%' : 
                         index === currentStoryIndex ? `${progress}%` : '0%'
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <UserAvatar user={storyUser} size="sm" />
          <div>
            <p className="text-white font-medium text-sm">{storyUser.displayName}</p>
            <p className="text-white/70 text-xs">
              {formatDistanceToNow(new Date(currentStory.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2"
            data-testid="button-close-story"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Story Content */}
      <div className="relative w-full h-full max-w-md mx-auto">
        <img
          src={currentStory.fileUrl}
          alt="Story"
          className="w-full h-full object-cover"
          data-testid="story-image"
        />
        
        {/* Navigation Areas */}
        <div className="absolute inset-0 flex">
          <div 
            className="flex-1 cursor-pointer" 
            onClick={handlePrevious}
            data-testid="story-previous"
          />
          <div 
            className="flex-1 cursor-pointer" 
            onClick={handleNext}
            data-testid="story-next"
          />
        </div>

        {/* Caption */}
        {currentStory.caption && (
          <div className="absolute bottom-20 left-4 right-4 z-10">
            <p className="text-white text-sm bg-black/50 backdrop-blur-sm rounded-lg p-3">
              {currentStory.caption}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-white/70 text-sm">
            <span>{currentStory.viewsCount} views</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              data-testid="button-like-story"
            >
              <Heart className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost" 
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              data-testid="button-comment-story"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm" 
              className="text-white hover:bg-white/20 p-2"
              data-testid="button-share-story"
            >
              <Share className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentStoryIndex > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-3"
          data-testid="button-story-prev"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      
      {currentStoryIndex < currentStories.length - 1 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 p-3"
          data-testid="button-story-next"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}