import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Zap, Crown, Medal, Award } from "lucide-react";

interface AchievementBadgeProps {
  achievement: {
    name: string;
    description: string;
    icon: string;
    points: number;
    category: string;
  };
  isNew?: boolean;
  size?: "sm" | "md" | "lg";
}

const ACHIEVEMENT_ICONS = {
  trophy: Trophy,
  star: Star,
  zap: Zap,
  crown: Crown,
  medal: Medal,
  award: Award,
};

const CATEGORY_COLORS = {
  content: "bg-gradient-to-r from-plasma-blue to-plasma-purple",
  engagement: "bg-gradient-to-r from-plasma-purple to-plasma-pink", 
  milestone: "bg-gradient-to-r from-plasma-pink to-plasma-blue",
};

export default function AchievementBadge({ 
  achievement, 
  isNew = false, 
  size = "md" 
}: AchievementBadgeProps) {
  const IconComponent = ACHIEVEMENT_ICONS[achievement.icon as keyof typeof ACHIEVEMENT_ICONS] || Trophy;
  const colorClass = CATEGORY_COLORS[achievement.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.content;
  
  const sizeClasses = {
    sm: "w-12 h-12 text-xs",
    md: "w-16 h-16 text-sm", 
    lg: "w-20 h-20 text-base"
  };

  return (
    <div className="relative group">
      <div className={`
        ${sizeClasses[size]} 
        ${colorClass}
        rounded-full flex items-center justify-center
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:scale-110 cursor-pointer
        ${isNew ? 'animate-pulse ring-4 ring-yellow-400/50' : ''}
      `}>
        <IconComponent className={`${size === 'sm' ? 'h-5 w-5' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'} text-white`} />
      </div>
      
      {isNew && (
        <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs px-1 py-0.5">
          NEW!
        </Badge>
      )}
      
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap">
        <div className="font-semibold">{achievement.name}</div>
        <div className="text-gray-300">{achievement.description}</div>
        <div className="text-yellow-400 font-medium">{achievement.points} points</div>
        
        {/* Tooltip arrow */}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
      </div>
    </div>
  );
}