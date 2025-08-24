import { Badge } from "@/components/ui/badge";
import { Crown, Star, Award, Gem } from "lucide-react";

interface CreatorLevelBadgeProps {
  level: string;
  size?: "sm" | "md" | "lg";
}

const LEVEL_CONFIG = {
  bronze: {
    icon: Award,
    color: "bg-gradient-to-r from-amber-600 to-amber-700",
    textColor: "text-amber-100",
    label: "Bronze Creator"
  },
  silver: {
    icon: Star,
    color: "bg-gradient-to-r from-gray-400 to-gray-500", 
    textColor: "text-gray-100",
    label: "Silver Creator"
  },
  gold: {
    icon: Crown,
    color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    textColor: "text-yellow-900", 
    label: "Gold Creator"
  },
  platinum: {
    icon: Gem,
    color: "bg-gradient-to-r from-purple-400 to-pink-500",
    textColor: "text-purple-100",
    label: "Platinum Creator"
  }
};

export default function CreatorLevelBadge({ level, size = "md" }: CreatorLevelBadgeProps) {
  const config = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.bronze;
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1 gap-1",
    md: "text-sm px-3 py-1.5 gap-2",
    lg: "text-base px-4 py-2 gap-2"
  };
  
  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <Badge 
      className={`
        ${config.color} ${config.textColor} 
        ${sizeClasses[size]}
        flex items-center font-semibold
        shadow-lg hover:shadow-xl transition-all duration-300
        hover:scale-105 border-0
      `}
      data-testid={`creator-level-${level}`}
    >
      <IconComponent className={iconSizes[size]} />
      {size !== 'sm' && <span>{config.label}</span>}
    </Badge>
  );
}