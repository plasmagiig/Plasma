import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, Zap, Flame, Star, Smile } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface LiveReactionsProps {
  contentId: string;
  isLive?: boolean;
}

interface Reaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

const REACTION_EMOJIS = [
  { emoji: "❤️", icon: Heart, color: "text-red-500" },
  { emoji: "👍", icon: ThumbsUp, color: "text-blue-500" },
  { emoji: "⚡", icon: Zap, color: "text-yellow-500" },
  { emoji: "🔥", icon: Flame, color: "text-orange-500" },
  { emoji: "⭐", icon: Star, color: "text-purple-500" },
  { emoji: "😄", icon: Smile, color: "text-green-500" },
];

export default function LiveReactions({ contentId, isLive = false }: LiveReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const queryClient = useQueryClient();

  const reactionMutation = useMutation({
    mutationFn: async (emoji: string) => {
      return apiRequest("POST", "/api/reactions", {
        contentId,
        emoji,
        userId: "user-1" // Current user
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
  });

  const handleReaction = (emoji: string) => {
    // Add visual reaction animation
    const newReaction: Reaction = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 300,
      y: Math.random() * 200,
      timestamp: Date.now(),
    };
    
    setReactions(prev => [...prev, newReaction]);
    
    // Remove reaction after animation
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 3000);

    // Send to backend
    reactionMutation.mutate(emoji);
    setShowReactionPicker(false);
  };

  // Auto-remove old reactions
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReactions(prev => prev.filter(r => now - r.timestamp < 3000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Floating Reactions */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {reactions.map((reaction) => (
          <div
            key={reaction.id}
            className="absolute opacity-0 animate-pulse"
            style={{
              left: `${reaction.x}px`,
              top: `${reaction.y}px`,
              animation: `fadeInUp 3s ease-out forwards`,
            }}
          >
            <span className="text-2xl drop-shadow-lg">{reaction.emoji}</span>
          </div>
        ))}
      </div>

      {/* Reaction Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowReactionPicker(!showReactionPicker)}
          className="flex items-center space-x-2 hover:scale-110 transition-transform"
          data-testid="button-reactions"
        >
          <Heart className="h-4 w-4 text-pink-500" />
          {isLive && <span className="text-pink-500 animate-pulse">•</span>}
        </Button>

        {/* Reaction Picker */}
        {showReactionPicker && (
          <div className="absolute bottom-full left-0 mb-2 p-2 bg-black/90 backdrop-blur-sm rounded-lg flex space-x-1 z-50">
            {REACTION_EMOJIS.map((reaction, index) => {
              const IconComponent = reaction.icon;
              return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReaction(reaction.emoji)}
                  className={`p-2 hover:scale-125 transition-transform ${reaction.color}`}
                  data-testid={`reaction-${reaction.emoji}`}
                >
                  <IconComponent className="h-4 w-4" />
                </Button>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}