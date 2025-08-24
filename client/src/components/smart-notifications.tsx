import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, BellOff, User, Heart, Zap, MessageCircle, Gift, Trophy, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import UserAvatar from "./user-avatar";

interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "gift" | "achievement" | "mention";
  title: string;
  message: string;
  user?: {
    id: string;
    username: string;
    displayName: string;
    avatar?: string;
  };
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

interface SmartNotificationsProps {
  isOpen: boolean;
  onClose: () => void;
}

const NOTIFICATION_ICONS = {
  like: Heart,
  comment: MessageCircle,
  follow: User,
  gift: Gift,
  achievement: Trophy,
  mention: Bell,
};

const NOTIFICATION_COLORS = {
  like: "text-red-500",
  comment: "text-blue-500",
  follow: "text-green-500",
  gift: "text-yellow-500",
  achievement: "text-purple-500",
  mention: "text-orange-500",
};

export default function SmartNotifications({ isOpen, onClose }: SmartNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState({
    push: true,
    email: false,
    likes: true,
    comments: true,
    follows: true,
    gifts: true,
    achievements: true,
    mentions: true,
  });

  // Mock notifications
  const mockNotifications: Notification[] = [
    {
      id: "notif-1",
      type: "gift",
      title: "Virtual Gift Received!",
      message: "Sarah sent you a Diamond 💎 on your latest video",
      user: {
        id: "user-2",
        username: "sarahdesign",
        displayName: "Sarah Design",
        avatar: undefined
      },
      timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      isRead: false,
      actionUrl: "/dashboard"
    },
    {
      id: "notif-2", 
      type: "achievement",
      title: "Achievement Unlocked!",
      message: "You've earned the 'Energy Master' badge for collecting 10,000 energy points!",
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
    },
    {
      id: "notif-3",
      type: "comment",
      title: "New Comment",
      message: "Alex commented: 'This is amazing! How did you create this effect?'",
      user: {
        id: "user-3",
        username: "alexchen",
        displayName: "Alex Chen",
        avatar: undefined
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    },
    {
      id: "notif-4",
      type: "follow",
      title: "New Follower",
      message: "Maya started following you",
      user: {
        id: "user-4",
        username: "mayacreates",
        displayName: "Maya Creates",
        avatar: undefined
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
    }
  ];

  useEffect(() => {
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
      <Card className="glass-morphism w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-plasma-blue" />
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2"
              data-testid="close-notifications"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-plasma-blue hover:text-plasma-blue/80 justify-start p-0"
            >
              Mark all as read
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto space-y-1">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <BellOff className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const IconComponent = NOTIFICATION_ICONS[notification.type];
                const iconColor = NOTIFICATION_COLORS[notification.type];
                
                return (
                  <div
                    key={notification.id}
                    className={`
                      p-4 hover:bg-plasma-surface/30 cursor-pointer transition-colors
                      ${!notification.isRead ? 'bg-plasma-surface/20 border-l-2 border-plasma-blue' : ''}
                    `}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                    data-testid={`notification-${notification.id}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        {notification.user ? (
                          <div className="relative">
                            <UserAvatar user={notification.user} size="sm" />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${iconColor.replace('text-', 'bg-')} rounded-full flex items-center justify-center`}>
                              <IconComponent className="h-2 w-2 text-white" />
                            </div>
                          </div>
                        ) : (
                          <div className="w-8 h-8 bg-plasma-surface rounded-full flex items-center justify-center">
                            <IconComponent className={`h-4 w-4 ${iconColor}`} />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notification.isRead ? 'text-white' : 'text-gray-300'}`}>
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-plasma-blue rounded-full flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Notification Settings */}
          <div className="border-t border-gray-700 p-4">
            <h4 className="text-sm font-medium mb-3">Notification Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Push Notifications</span>
                <Switch 
                  checked={settings.push}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, push: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Email Notifications</span>
                <Switch 
                  checked={settings.email}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email: checked }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}