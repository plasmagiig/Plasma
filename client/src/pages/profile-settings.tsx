import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  User, 
  Settings, 
  Video, 
  Download, 
  Film, 
  Star,
  Clock,
  HelpCircle,
  ChevronRight,
  Upload,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import UserAvatar from "@/components/user-avatar";

export default function ProfileSettings() {
  const userId = "user-1"; // Current user ID - in a real app this would come from auth context
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();

  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  const user = users?.find((u: any) => u.id === userId);

  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    email: user?.email || "",
  });

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
      // This would typically update the user profile
      return apiRequest("PATCH", `/api/users/${userId}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(formData);
  };

  const handleUploadAvatar = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile);
    }
  };

  const menuItems = [
    {
      icon: Video,
      label: "Your videos",
      description: `${user?.totalVideos || 0} videos`,
      action: () => console.log("Navigate to videos")
    },
    {
      icon: Download,
      label: "Downloads",
      description: "Your offline videos",
      action: () => console.log("Navigate to downloads")
    },
    {
      icon: Film,
      label: "Your movies",
      description: "Movies you've purchased",
      action: () => console.log("Navigate to movies")
    },
    {
      icon: Star,
      label: "Get Premium",
      description: "Upgrade your experience",
      action: () => console.log("Navigate to premium")
    },
    {
      icon: Clock,
      label: "Time watched",
      description: "Your viewing history",
      action: () => console.log("Navigate to watch time")
    },
    {
      icon: HelpCircle,
      label: "Help & feedback",
      description: "Get support",
      action: () => console.log("Navigate to help")
    },
  ];

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
      <div className="container mx-auto max-w-4xl px-6 py-8">
        
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
                    {user.displayName}
                  </h1>
                  <Badge variant="secondary" className="bg-plasma-blue/20 text-plasma-blue">
                    @{user.username}
                  </Badge>
                </div>
                <p className="text-gray-400 mb-4">{user.bio || "No bio yet"}</p>
                
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
                
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-plasma-pink text-plasma-pink hover:bg-plasma-pink hover:text-white"
                  data-testid="button-edit-profile"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Edit Form */}
        {isEditing && (
          <Card className="glass-morphism mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Edit Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Your display name"
                    data-testid="input-display-name"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Your username"
                    data-testid="input-username"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                  data-testid="input-email"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  className="min-h-24"
                  data-testid="textarea-bio"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={updateProfileMutation.isPending}
                  className="bg-gradient-to-r from-plasma-blue to-plasma-purple"
                  data-testid="button-save-profile"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(false)}
                  data-testid="button-cancel-edit"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <Card className="glass-morphism">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Account & Settings</h2>
            <div className="space-y-1">
              {menuItems.map((item, index) => (
                <div key={index}>
                  <button
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 hover:bg-plasma-surface/50 rounded-lg transition-colors group"
                    data-testid={`menu-item-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-plasma-surface rounded-full flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-gray-300" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-white">{item.label}</p>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                  </button>
                  {index < menuItems.length - 1 && (
                    <Separator className="bg-gray-700/50" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}