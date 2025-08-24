import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  User, 
  Settings, 
  Globe,
  Lock,
  Music,
  Link as LinkIcon,
  Plus,
  Trash2,
  Save,
  Upload,
  Shield,
  Eye,
  MessageCircle,
  Users,
  Hash,
  X
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UserAvatar from "@/components/user-avatar";

interface SocialLink {
  platform: string;
  url: string;
}

interface PrivacySettings {
  profileVisibility: "public" | "private" | "friends";
  allowMessages: "everyone" | "followers" | "none";
  showActivity: boolean;
}

export default function ProfileSettings() {
  const userId = "user-1"; // Current user ID - in a real app this would come from auth context
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  const queryClient = useQueryClient();

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const user = users?.find((u: any) => u.id === userId);

  // Form state for all profile sections
  const [basicData, setBasicData] = useState({
    displayName: "",
    channelName: "",
    username: "",
    bio: "",
    channelDescription: "",
    email: "",
    channelUrl: "",
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [profileMusic, setProfileMusic] = useState("");
  const [communityPosts, setCommunityPosts] = useState(true);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: "public",
    allowMessages: "everyone", 
    showActivity: true,
  });

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setBasicData({
        displayName: user.displayName || "",
        channelName: user.channelName || "",
        username: user.username || "",
        bio: user.bio || "",
        channelDescription: user.channelDescription || "",
        email: user.email || "",
        channelUrl: user.channelUrl || "",
      });

      // Parse social links
      try {
        const links = JSON.parse(user.socialLinks || "[]");
        setSocialLinks(links);
      } catch {
        setSocialLinks([]);
      }

      setProfileMusic(user.profileMusic || "");
      setCommunityPosts(user.communityPosts ?? true);

      // Parse privacy settings
      try {
        const privacy = JSON.parse(user.privacySettings || "{}");
        setPrivacySettings({
          profileVisibility: privacy.profileVisibility || "public",
          allowMessages: privacy.allowMessages || "everyone",
          showActivity: privacy.showActivity ?? true,
        });
      } catch {
        setPrivacySettings({
          profileVisibility: "public",
          allowMessages: "everyone",
          showActivity: true,
        });
      }
    }
  }, [user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      // This would typically upload to a file service
      // For now, we'll just simulate an upload
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ url: URL.createObjectURL(file) });
        }, 1000);
      });
    },
    onSuccess: (data: any) => {
      toast({
        title: "Profile Photo Updated",
        description: "Your new profile photo has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PATCH", `/api/users/${userId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveProfile = () => {
    const updateData = {
      ...basicData,
      socialLinks: JSON.stringify(socialLinks),
      profileMusic: profileMusic || null,
      communityPosts,
      privacySettings: JSON.stringify(privacySettings),
    };

    updateProfileMutation.mutate(updateData);
  };

  const handleUploadAvatar = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile);
    }
  };

  const addSocialLink = () => {
    setSocialLinks([...socialLinks, { platform: "", url: "" }]);
  };

  const removeSocialLink = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const updateSocialLink = (index: number, field: keyof SocialLink, value: string) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  if (!user) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">User Not Found</h2>
          <p className="text-gray-400">Unable to load profile settings.</p>
        </div>
      </div>
    );
  }

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-5xl px-6 py-8">
        
        {/* Profile Header */}
        <Card className="glass-morphism mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="relative">
                <UserAvatar 
                  user={{
                    ...user,
                    avatar: previewUrl || user.avatar
                  }}
                  size="xl"
                  className="border-4 border-plasma-blue/50"
                />
                <div className="absolute -bottom-2 -right-2">
                  <Button
                    size="sm"
                    className="w-10 h-10 bg-plasma-blue/20 backdrop-blur-sm rounded-full hover:bg-plasma-blue/30 p-0"
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                    data-testid="button-change-avatar"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </Button>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-2xl font-bold" data-testid="text-display-name">
                    {basicData.displayName || user.displayName}
                  </h1>
                  <Badge variant="secondary" className="bg-plasma-blue/20 text-plasma-blue">
                    @{basicData.username || user.username}
                  </Badge>
                  {user.isVerified && (
                    <Badge className="bg-blue-500/20 text-blue-400">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 mb-4">{basicData.bio || user.bio || "No bio yet"}</p>
                
                {selectedFile && (
                  <Button 
                    onClick={handleUploadAvatar}
                    disabled={uploadAvatarMutation.isPending}
                    className="bg-gradient-to-r from-plasma-blue to-plasma-purple mr-4"
                    data-testid="button-upload-avatar"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadAvatarMutation.isPending ? "Uploading..." : "Save Photo"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-plasma-surface/50">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4" />
              Social & Links
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Privacy
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Content Settings
            </TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Basic Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={basicData.displayName}
                      onChange={(e) => setBasicData(prev => ({ ...prev, displayName: e.target.value }))}
                      placeholder="Your display name"
                      data-testid="input-display-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="channelName">Channel Name</Label>
                    <Input
                      id="channelName"
                      value={basicData.channelName}
                      onChange={(e) => setBasicData(prev => ({ ...prev, channelName: e.target.value }))}
                      placeholder="Your channel or business name"
                      data-testid="input-channel-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Handle (@username)</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="username"
                        value={basicData.username}
                        onChange={(e) => setBasicData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="username"
                        className="pl-10"
                        data-testid="input-username"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="channelUrl">Channel URL</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-400">
                        plasma.app/
                      </span>
                      <Input
                        id="channelUrl"
                        value={basicData.channelUrl}
                        onChange={(e) => setBasicData(prev => ({ ...prev, channelUrl: e.target.value }))}
                        placeholder="your-channel"
                        className="pl-24"
                        data-testid="input-channel-url"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={basicData.email}
                    onChange={(e) => setBasicData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="your.email@example.com"
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={basicData.bio}
                    onChange={(e) => setBasicData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell people about yourself..."
                    className="min-h-20"
                    data-testid="textarea-bio"
                  />
                </div>

                <div>
                  <Label htmlFor="channelDescription">Channel Description</Label>
                  <Textarea
                    id="channelDescription"
                    value={basicData.channelDescription}
                    onChange={(e) => setBasicData(prev => ({ ...prev, channelDescription: e.target.value }))}
                    placeholder="Detailed description of your channel..."
                    className="min-h-24"
                    data-testid="textarea-channel-description"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social & Links Tab */}
          <TabsContent value="social">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  Social Links & Music
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Music */}
                <div>
                  <Label htmlFor="profileMusic" className="flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    Profile Music
                  </Label>
                  <Input
                    id="profileMusic"
                    value={profileMusic}
                    onChange={(e) => setProfileMusic(e.target.value)}
                    placeholder="Add background music to your profile"
                    data-testid="input-profile-music"
                  />
                  <p className="text-sm text-gray-400 mt-1">Add a music track that plays on your profile</p>
                </div>

                <Separator />

                {/* Social Links */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Label className="text-base font-medium">Social Links</Label>
                    <Button
                      onClick={addSocialLink}
                      variant="outline"
                      size="sm"
                      className="border-plasma-blue text-plasma-blue hover:bg-plasma-blue hover:text-white"
                      data-testid="button-add-social-link"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {socialLinks.map((link, index) => (
                      <div key={index} className="flex gap-4 items-center">
                        <div className="flex-1">
                          <Input
                            value={link.platform}
                            onChange={(e) => updateSocialLink(index, "platform", e.target.value)}
                            placeholder="Platform (e.g., Twitter, Instagram)"
                            data-testid={`input-social-platform-${index}`}
                          />
                        </div>
                        <div className="flex-2">
                          <Input
                            value={link.url}
                            onChange={(e) => updateSocialLink(index, "url", e.target.value)}
                            placeholder="https://example.com/yourprofile"
                            data-testid={`input-social-url-${index}`}
                          />
                        </div>
                        <Button
                          onClick={() => removeSocialLink(index)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          data-testid={`button-remove-social-${index}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    {socialLinks.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <LinkIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No social links added yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings Tab */}
          <TabsContent value="privacy">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy & Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  {/* Profile Visibility */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Eye className="h-4 w-4" />
                      Profile Visibility
                    </Label>
                    <Select
                      value={privacySettings.profileVisibility}
                      onValueChange={(value: "public" | "private" | "friends") => 
                        setPrivacySettings(prev => ({ ...prev, profileVisibility: value }))
                      }
                    >
                      <SelectTrigger data-testid="select-profile-visibility">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public - Anyone can view</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                        <SelectItem value="private">Private - Only you can view</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message Settings */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-4 w-4" />
                      Who can message you
                    </Label>
                    <Select
                      value={privacySettings.allowMessages}
                      onValueChange={(value: "everyone" | "followers" | "none") => 
                        setPrivacySettings(prev => ({ ...prev, allowMessages: value }))
                      }
                    >
                      <SelectTrigger data-testid="select-message-settings">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="everyone">Everyone</SelectItem>
                        <SelectItem value="followers">Followers only</SelectItem>
                        <SelectItem value="none">No one</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Activity Visibility */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Show Activity Status
                      </Label>
                      <p className="text-sm text-gray-400">Let others see when you're active</p>
                    </div>
                    <Switch
                      checked={privacySettings.showActivity}
                      onCheckedChange={(checked) => 
                        setPrivacySettings(prev => ({ ...prev, showActivity: checked }))
                      }
                      data-testid="switch-show-activity"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Settings Tab */}
          <TabsContent value="content">
            <Card className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Content & Community Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Community Posts */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Allow Community Posts
                    </Label>
                    <p className="text-sm text-gray-400">Let your followers create posts on your channel</p>
                  </div>
                  <Switch
                    checked={communityPosts}
                    onCheckedChange={setCommunityPosts}
                    data-testid="switch-community-posts"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <Card className="glass-morphism">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-400">
                Changes will be saved to your profile
              </p>
              <Button 
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="bg-gradient-to-r from-plasma-blue to-plasma-purple"
                data-testid="button-save-all-changes"
              >
                <Save className="h-4 w-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}