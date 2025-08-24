import { useState } from "react";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    id?: string;
    username?: string;
    displayName?: string;
    avatar?: string | null;
  };
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const AVATAR_COLORS = [
  "bg-red-500",
  "bg-orange-500", 
  "bg-amber-500",
  "bg-yellow-500",
  "bg-lime-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-rose-500"
];

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm", 
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-2xl"
};

const generateColorFromString = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
};

const getInitials = (displayName: string, username: string): string => {
  if (displayName && displayName.trim()) {
    const words = displayName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[1][0]}`.toUpperCase();
    }
    return displayName[0].toUpperCase();
  }
  
  if (username && username.trim()) {
    return username[0].toUpperCase();
  }
  
  return "U";
};

export default function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // If user has uploaded avatar and it hasn't failed to load
  if (user.avatar && !imageError) {
    return (
      <img
        src={user.avatar}
        alt={user.displayName || user.username || "User"}
        className={cn("rounded-full object-cover", SIZE_CLASSES[size], className)}
        onError={() => setImageError(true)}
        data-testid="img-user-avatar"
      />
    );
  }

  // Generate initials and color
  const displayName = user.displayName || "";
  const username = user.username || "";
  const initials = getInitials(displayName, username);
  const colorClass = generateColorFromString(user.id || username || displayName || "default");

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white",
        SIZE_CLASSES[size],
        colorClass,
        className
      )}
      data-testid="div-user-avatar-initials"
    >
      {initials}
    </div>
  );
}