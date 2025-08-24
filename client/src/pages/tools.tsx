import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Palette, 
  Video, 
  Music, 
  Image, 
  Type, 
  Zap, 
  Sparkles,
  Download,
  Share2,
  Edit3,
  Crop
} from "lucide-react";

export default function Tools() {
  const toolCategories = [
    {
      title: "Video Tools",
      icon: Video,
      tools: [
        { name: "Video Editor", icon: Edit3, description: "Edit and enhance your videos" },
        { name: "Video Cropper", icon: Crop, description: "Crop videos to perfect size" },
        { name: "Video Converter", icon: Zap, description: "Convert video formats" },
      ]
    },
    {
      title: "Audio Tools", 
      icon: Music,
      tools: [
        { name: "Audio Editor", icon: Music, description: "Edit and mix audio" },
        { name: "Sound Effects", icon: Sparkles, description: "Add sound effects" },
        { name: "Voice Recorder", icon: Zap, description: "Record voice overs" },
      ]
    },
    {
      title: "Design Tools",
      icon: Palette,
      tools: [
        { name: "Thumbnail Maker", icon: Image, description: "Create eye-catching thumbnails" },
        { name: "Text Overlay", icon: Type, description: "Add text to your content" },
        { name: "Color Palette", icon: Palette, description: "Choose perfect colors" },
      ]
    },
    {
      title: "Sharing Tools",
      icon: Share2,
      tools: [
        { name: "Content Scheduler", icon: Share2, description: "Schedule your posts" },
        { name: "Download Manager", icon: Download, description: "Download your content" },
        { name: "Link Shortener", icon: Zap, description: "Create short links" },
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark pb-20">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-plasma-blue to-plasma-purple bg-clip-text text-transparent mb-2">
            New Tools
          </h1>
          <p className="text-gray-400">Powerful tools to enhance your content creation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toolCategories.map((category, index) => (
            <Card key={index} className="glass-morphism">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-plasma-blue" />
                  {category.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.tools.map((tool, toolIndex) => (
                  <div 
                    key={toolIndex}
                    className="flex items-center justify-between p-3 bg-plasma-surface/30 rounded-lg hover:bg-plasma-surface/50 transition-colors cursor-pointer"
                    data-testid={`tool-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-plasma-surface rounded-full flex items-center justify-center">
                        <tool.icon className="h-5 w-5 text-gray-300" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{tool.name}</h3>
                        <p className="text-sm text-gray-400">{tool.description}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="border-plasma-blue text-plasma-blue hover:bg-plasma-blue hover:text-white">
                      Use Tool
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Access Section */}
        <Card className="glass-morphism mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-plasma-purple" />
              Quick Access
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-plasma-blue/50 hover:bg-plasma-blue/10"
                data-testid="quick-video-editor"
              >
                <Video className="h-6 w-6" />
                <span className="text-sm">Video Editor</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-plasma-purple/50 hover:bg-plasma-purple/10"
                data-testid="quick-audio-editor"
              >
                <Music className="h-6 w-6" />
                <span className="text-sm">Audio Editor</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-plasma-pink/50 hover:bg-plasma-pink/10"
                data-testid="quick-thumbnail-maker"
              >
                <Image className="h-6 w-6" />
                <span className="text-sm">Thumbnails</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2 border-plasma-blue/50 hover:bg-plasma-blue/10"
                data-testid="quick-share"
              >
                <Share2 className="h-6 w-6" />
                <span className="text-sm">Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}