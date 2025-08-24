import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Bell, 
  Shield, 
  Eye, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  Globe,
  Download,
  Wifi,
  Smartphone,
  Monitor,
  Palette,
  Lock,
  UserCheck,
  AlertTriangle,
  Trash2,
  LogOut,
  Save,
  Settings as SettingsIcon,
  DollarSign,
  TrendingUp,
  Zap,
  Brain,
  Target,
  BarChart3,
  Wand2,
  Sparkles
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useTheme } from "@/hooks/use-theme";

interface UserSettings {
  notifications: {
    boosts: boolean;
    comments: boolean;
    followers: boolean;
    mentions: boolean;
    collaborations: boolean;
    earnings: boolean;
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacy: {
    profileVisibility: "public" | "followers" | "private";
    showEarnings: boolean;
    showFollowers: boolean;
    allowDirectMessages: boolean;
    allowCollaborationRequests: boolean;
    contentDownloads: boolean;
  };
  content: {
    autoplay: boolean;
    defaultQuality: "auto" | "720p" | "1080p" | "4K";
    dataUsage: "low" | "medium" | "high";
    matureContent: boolean;
  };
  account: {
    twoFactorEnabled: boolean;
    emailVerified: boolean;
    phoneVerified: boolean;
  };
  display: {
    theme: "light" | "dark";
    language: string;
    timezone: string;
    animations: boolean;
  };
  audio: {
    masterVolume: number;
    soundEffects: boolean;
    notifications: boolean;
  };
  monetization: {
    earningGoals: {
      daily: number;
      monthly: number;
    };
    autoWithdraw: boolean;
    withdrawThreshold: number;
    payoutMethod: "paypal" | "bank" | "crypto";
    showEarningsPublically: boolean;
  };
  ai: {
    contentSuggestions: boolean;
    smartNotifications: boolean;
    autoTagging: boolean;
    feedOptimization: boolean;
    performanceInsights: boolean;
  };
  creator: {
    defaultWatermark: boolean;
    autoBackup: boolean;
    qualityPreset: "fast" | "balanced" | "quality";
    templateSaving: boolean;
  };
}

const defaultSettings: UserSettings = {
  notifications: {
    boosts: true,
    comments: true,
    followers: true,
    mentions: true,
    collaborations: true,
    earnings: true,
    push: true,
    email: true,
    sms: false,
  },
  privacy: {
    profileVisibility: "public",
    showEarnings: false,
    showFollowers: true,
    allowDirectMessages: true,
    allowCollaborationRequests: true,
    contentDownloads: true,
  },
  content: {
    autoplay: true,
    defaultQuality: "auto",
    dataUsage: "medium",
    matureContent: false,
  },
  account: {
    twoFactorEnabled: false,
    emailVerified: true,
    phoneVerified: false,
  },
  display: {
    theme: "dark",
    language: "en",
    timezone: "UTC",
    animations: true,
  },
  audio: {
    masterVolume: 75,
    soundEffects: true,
    notifications: true,
  },
  monetization: {
    earningGoals: {
      daily: 50,
      monthly: 1000,
    },
    autoWithdraw: false,
    withdrawThreshold: 100,
    payoutMethod: "paypal",
    showEarningsPublically: false,
  },
  ai: {
    contentSuggestions: true,
    smartNotifications: true,
    autoTagging: true,
    feedOptimization: true,
    performanceInsights: true,
  },
  creator: {
    defaultWatermark: true,
    autoBackup: true,
    qualityPreset: "balanced",
    templateSaving: true,
  },
};

export default function Settings() {
  const userId = "user-1"; // Current user ID - in a real app this would come from auth context
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const user = users?.find((u: any) => u.id === userId);

  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: UserSettings) => {
      // This would typically update user settings in the backend
      return apiRequest("PATCH", `/api/users/${userId}/settings`, newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Settings Updated",
        description: "Your preferences have been saved successfully.",
      });
      setHasChanges(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const updateSetting = (category: keyof UserSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(settings);
  };

  const handleThemeChange = (newTheme: string) => {
    if (newTheme === "light" || newTheme === "dark") {
      setTheme(newTheme);
    }
    updateSetting("display", "theme", newTheme);
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">User Not Found</h2>
          <p className="text-gray-400">Unable to load settings.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-4xl px-6 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-plasma-blue to-plasma-purple bg-clip-text text-transparent">
              Settings
            </h1>
            <p className="text-gray-400 mt-2">Customize your PLASMA experience</p>
          </div>
          
          {hasChanges && (
            <Button 
              onClick={handleSaveSettings}
              disabled={updateSettingsMutation.isPending}
              className="bg-gradient-to-r from-plasma-blue to-plasma-purple"
              data-testid="button-save-settings"
            >
              <Save className="h-4 w-4 mr-2" />
              {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </div>

        {/* Notifications Settings */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`notification-${key}`} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    id={`notification-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => updateSetting("notifications", key, checked)}
                    data-testid={`switch-notification-${key}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Privacy & Safety
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="profile-visibility">Profile Visibility</Label>
              <Select 
                value={settings.privacy.profileVisibility} 
                onValueChange={(value) => updateSetting("privacy", "profileVisibility", value)}
              >
                <SelectTrigger data-testid="select-profile-visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public - Anyone can see</SelectItem>
                  <SelectItem value="followers">Followers Only</SelectItem>
                  <SelectItem value="private">Private - Only you</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-700/50" />

            <div className="space-y-4">
              {Object.entries(settings.privacy).filter(([key]) => key !== "profileVisibility").map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={`privacy-${key}`} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <Switch
                    id={`privacy-${key}`}
                    checked={value as boolean}
                    onCheckedChange={(checked) => updateSetting("privacy", key, checked)}
                    data-testid={`switch-privacy-${key}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Settings */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Content Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="video-quality">Default Video Quality</Label>
              <Select 
                value={settings.content.defaultQuality} 
                onValueChange={(value) => updateSetting("content", "defaultQuality", value)}
              >
                <SelectTrigger data-testid="select-video-quality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto (Recommended)</SelectItem>
                  <SelectItem value="720p">720p HD</SelectItem>
                  <SelectItem value="1080p">1080p Full HD</SelectItem>
                  <SelectItem value="4K">4K Ultra HD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="data-usage">Data Usage</Label>
              <Select 
                value={settings.content.dataUsage} 
                onValueChange={(value) => updateSetting("content", "dataUsage", value)}
              >
                <SelectTrigger data-testid="select-data-usage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low - Save data</SelectItem>
                  <SelectItem value="medium">Medium - Balanced</SelectItem>
                  <SelectItem value="high">High - Best quality</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-700/50" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay">Autoplay Videos</Label>
                <Switch
                  id="autoplay"
                  checked={settings.content.autoplay}
                  onCheckedChange={(checked) => updateSetting("content", "autoplay", checked)}
                  data-testid="switch-autoplay"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="mature-content">Mature Content</Label>
                  <p className="text-sm text-gray-400">Show age-restricted content</p>
                </div>
                <Switch
                  id="mature-content"
                  checked={settings.content.matureContent}
                  onCheckedChange={(checked) => updateSetting("content", "matureContent", checked)}
                  data-testid="switch-mature-content"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Display Settings */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Display & Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={theme} onValueChange={handleThemeChange}>
                <SelectTrigger data-testid="select-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select 
                value={settings.display.language} 
                onValueChange={(value) => updateSetting("display", "language", value)}
              >
                <SelectTrigger data-testid="select-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Smooth Animations</Label>
              <Switch
                id="animations"
                checked={settings.display.animations}
                onCheckedChange={(checked) => updateSetting("display", "animations", checked)}
                data-testid="switch-animations"
              />
            </div>
          </CardContent>
        </Card>

        {/* Audio Settings */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="master-volume">Master Volume</Label>
                <span className="text-sm text-gray-400">{settings.audio.masterVolume}%</span>
              </div>
              <Slider
                id="master-volume"
                value={[settings.audio.masterVolume]}
                onValueChange={(value) => updateSetting("audio", "masterVolume", value[0])}
                max={100}
                step={5}
                className="w-full"
                data-testid="slider-master-volume"
              />
            </div>

            <Separator className="bg-gray-700/50" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="sound-effects">Sound Effects</Label>
                <Switch
                  id="sound-effects"
                  checked={settings.audio.soundEffects}
                  onCheckedChange={(checked) => updateSetting("audio", "soundEffects", checked)}
                  data-testid="switch-sound-effects"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notification-sounds">Notification Sounds</Label>
                <Switch
                  id="notification-sounds"
                  checked={settings.audio.notifications}
                  onCheckedChange={(checked) => updateSetting("audio", "notifications", checked)}
                  data-testid="switch-notification-sounds"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Creator Economy & Monetization */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              Creator Economy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="daily-goal">Daily Earning Goal ($)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    id="daily-goal"
                    value={settings.monetization.earningGoals.daily}
                    onChange={(e) => updateSetting("monetization", "earningGoals", {
                      ...settings.monetization.earningGoals,
                      daily: Number(e.target.value)
                    })}
                    className="w-full px-3 py-2 bg-plasma-surface/50 border border-plasma-blue/30 rounded-md text-white"
                    min="0"
                    data-testid="input-daily-goal"
                  />
                  <Target className="h-4 w-4 text-green-400" />
                </div>
              </div>
              
              <div>
                <Label htmlFor="monthly-goal">Monthly Earning Goal ($)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    id="monthly-goal"
                    value={settings.monetization.earningGoals.monthly}
                    onChange={(e) => updateSetting("monetization", "earningGoals", {
                      ...settings.monetization.earningGoals,
                      monthly: Number(e.target.value)
                    })}
                    className="w-full px-3 py-2 bg-plasma-surface/50 border border-plasma-blue/30 rounded-md text-white"
                    min="0"
                    data-testid="input-monthly-goal"
                  />
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
              </div>
            </div>

            <Separator className="bg-gray-700/50" />

            <div>
              <Label htmlFor="payout-method">Payout Method</Label>
              <Select 
                value={settings.monetization.payoutMethod} 
                onValueChange={(value) => updateSetting("monetization", "payoutMethod", value)}
              >
                <SelectTrigger data-testid="select-payout-method">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="withdraw-threshold">Auto-Withdraw Threshold ($)</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="withdraw-threshold"
                  value={settings.monetization.withdrawThreshold}
                  onChange={(e) => updateSetting("monetization", "withdrawThreshold", Number(e.target.value))}
                  className="w-full px-3 py-2 bg-plasma-surface/50 border border-plasma-blue/30 rounded-md text-white"
                  min="10"
                  step="10"
                  data-testid="input-withdraw-threshold"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-withdraw">Auto-Withdraw Earnings</Label>
                  <p className="text-sm text-gray-400">Automatically withdraw when threshold is reached</p>
                </div>
                <Switch
                  id="auto-withdraw"
                  checked={settings.monetization.autoWithdraw}
                  onCheckedChange={(checked) => updateSetting("monetization", "autoWithdraw", checked)}
                  data-testid="switch-auto-withdraw"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-earnings">Show Earnings Publicly</Label>
                  <p className="text-sm text-gray-400">Display your earnings on your profile</p>
                </div>
                <Switch
                  id="show-earnings"
                  checked={settings.monetization.showEarningsPublically}
                  onCheckedChange={(checked) => updateSetting("monetization", "showEarningsPublically", checked)}
                  data-testid="switch-show-earnings"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI & Smart Features */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              AI & Smart Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(settings.ai).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div>
                    <Label htmlFor={`ai-${key}`} className="capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <p className="text-sm text-gray-400">
                      {key === 'contentSuggestions' && 'AI suggests content ideas'}
                      {key === 'smartNotifications' && 'Prioritize important notifications'}
                      {key === 'autoTagging' && 'Automatically tag your content'}
                      {key === 'feedOptimization' && 'Optimize your home feed'}
                      {key === 'performanceInsights' && 'Get AI-powered analytics'}
                    </p>
                  </div>
                  <Switch
                    id={`ai-${key}`}
                    checked={value}
                    onCheckedChange={(checked) => updateSetting("ai", key, checked)}
                    data-testid={`switch-ai-${key}`}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Creator Tools */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-blue-400" />
              Creator Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="quality-preset">Content Quality Preset</Label>
              <Select 
                value={settings.creator.qualityPreset} 
                onValueChange={(value) => updateSetting("creator", "qualityPreset", value)}
              >
                <SelectTrigger data-testid="select-quality-preset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast Upload - Lower quality, faster processing</SelectItem>
                  <SelectItem value="balanced">Balanced - Good quality, moderate processing</SelectItem>
                  <SelectItem value="quality">High Quality - Best quality, slower processing</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator className="bg-gray-700/50" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="default-watermark">Default Watermark</Label>
                  <p className="text-sm text-gray-400">Automatically add your watermark to content</p>
                </div>
                <Switch
                  id="default-watermark"
                  checked={settings.creator.defaultWatermark}
                  onCheckedChange={(checked) => updateSetting("creator", "defaultWatermark", checked)}
                  data-testid="switch-default-watermark"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Auto-Backup Content</Label>
                  <p className="text-sm text-gray-400">Automatically backup your content to cloud</p>
                </div>
                <Switch
                  id="auto-backup"
                  checked={settings.creator.autoBackup}
                  onCheckedChange={(checked) => updateSetting("creator", "autoBackup", checked)}
                  data-testid="switch-auto-backup"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="template-saving">Save Content Templates</Label>
                  <p className="text-sm text-gray-400">Save your content settings as reusable templates</p>
                </div>
                <Switch
                  id="template-saving"
                  checked={settings.creator.templateSaving}
                  onCheckedChange={(checked) => updateSetting("creator", "templateSaving", checked)}
                  data-testid="switch-template-saving"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="glass-morphism mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Account Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-400">Add an extra layer of security</p>
                </div>
                <div className="flex items-center gap-2">
                  {settings.account.twoFactorEnabled && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      Enabled
                    </Badge>
                  )}
                  <Switch
                    id="two-factor"
                    checked={settings.account.twoFactorEnabled}
                    onCheckedChange={(checked) => updateSetting("account", "twoFactorEnabled", checked)}
                    data-testid="switch-two-factor"
                  />
                </div>
              </div>

              <Separator className="bg-gray-700/50" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-green-400" />
                    <span>Email Verified</span>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                    Verified
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                    <span>Phone Number</span>
                  </div>
                  <Button variant="outline" size="sm" data-testid="button-verify-phone">
                    Verify Phone
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="glass-morphism border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                data-testid="button-logout-all-devices"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log Out from All Devices
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
                data-testid="button-delete-account"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}