import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageCircle, 
  Video, 
  FileText, 
  Share2, 
  X, 
  Minimize2, 
  Maximize2,
  Phone,
  Send,
  Plus,
  Camera,
  Mic
} from "lucide-react";

interface CollaborationPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function CollaborationPanel({ isOpen, onToggle }: CollaborationPanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-plasma-blue to-plasma-purple hover:scale-110 transition-transform shadow-2xl animate-plasma-pulse"
          data-testid="button-expand-collaboration"
        >
          <Users className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50" data-testid="collaboration-panel">
      <Card className="w-96 h-[500px] glass-morphism shadow-2xl border-2 border-plasma-blue/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-plasma-blue to-plasma-purple rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span>Creator Hub</span>
            </CardTitle>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                data-testid="button-minimize-collaboration"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                data-testid="button-close-collaboration"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 h-[420px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 mx-4 mb-4">
              <TabsTrigger value="chat" className="text-xs" data-testid="tab-chat">
                <MessageCircle className="h-3 w-3 mr-1" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="call" className="text-xs" data-testid="tab-call">
                <Video className="h-3 w-3 mr-1" />
                Call
              </TabsTrigger>
              <TabsTrigger value="files" className="text-xs" data-testid="tab-files">
                <FileText className="h-3 w-3 mr-1" />
                Files
              </TabsTrigger>
              <TabsTrigger value="team" className="text-xs" data-testid="tab-team">
                <Users className="h-3 w-3 mr-1" />
                Team
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 px-4 pb-4">
              <TabsContent value="chat" className="h-full flex flex-col m-0">
                {/* Active Collaborators */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex -space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=32&h=32&fit=crop"
                      alt="Maya"
                      className="w-8 h-8 rounded-full border-2 border-plasma-purple"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=32&h=32&fit=crop"
                      alt="David"
                      className="w-8 h-8 rounded-full border-2 border-plasma-pink"
                    />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 text-xs">2 online</Badge>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                  <div className="flex items-start space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=24&h=24&fit=crop"
                      alt="Maya"
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-plasma-purple font-semibold">Maya Rodriguez</div>
                      <div className="text-sm bg-plasma-surface/50 rounded-lg px-3 py-2 mt-1">
                        Ready to start the collaboration on the Web3 project! 🚀
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=24&h=24&fit=crop"
                      alt="David"
                      className="w-6 h-6 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-plasma-pink font-semibold">David Kim</div>
                      <div className="text-sm bg-plasma-surface/50 rounded-lg px-3 py-2 mt-1">
                        I've uploaded the initial concepts to the files tab
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <Badge className="bg-plasma-blue/20 text-plasma-blue text-xs">
                      Energy sync successful ⚡
                    </Badge>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Send a message..."
                    className="flex-1 px-3 py-2 bg-plasma-surface/50 border border-plasma-blue/30 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-plasma-blue"
                    data-testid="input-collaboration-chat"
                  />
                  <Button size="sm" className="bg-plasma-blue hover:bg-plasma-blue/80" data-testid="button-send-collaboration-message">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="call" className="h-full flex flex-col m-0">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-plasma-purple to-plasma-pink rounded-full flex items-center justify-center mx-auto animate-plasma-pulse">
                    <Video className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Start Collaboration Call</h3>
                  <p className="text-sm text-gray-400">Connect with your team in real-time</p>
                  
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-plasma-blue to-plasma-purple" data-testid="button-start-video-call">
                      <Video className="h-4 w-4 mr-2" />
                      Start Video Call
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-start-audio-call">
                      <Phone className="h-4 w-4 mr-2" />
                      Audio Only
                    </Button>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2 mt-6">
                    <Button variant="ghost" className="bg-plasma-surface/30" data-testid="button-screen-share">
                      <Share2 className="h-4 w-4 mr-2" />
                      Screen Share
                    </Button>
                    <Button variant="ghost" className="bg-plasma-surface/30" data-testid="button-record-call">
                      <Camera className="h-4 w-4 mr-2" />
                      Record
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="files" className="h-full flex flex-col m-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Shared Files</h3>
                  <Button size="sm" variant="outline" data-testid="button-upload-file">
                    <Plus className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>
                
                <div className="space-y-2 flex-1 overflow-y-auto">
                  <div className="flex items-center space-x-3 p-2 bg-plasma-surface/30 rounded-lg hover:bg-plasma-surface/50 cursor-pointer" data-testid="file-web3-concepts">
                    <div className="w-8 h-8 bg-plasma-blue/20 rounded flex items-center justify-center">
                      <FileText className="h-4 w-4 text-plasma-blue" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Web3 Concepts.pdf</div>
                      <div className="text-xs text-gray-400">2.4 MB • 5 min ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-2 bg-plasma-surface/30 rounded-lg hover:bg-plasma-surface/50 cursor-pointer" data-testid="file-brand-assets">
                    <div className="w-8 h-8 bg-plasma-purple/20 rounded flex items-center justify-center">
                      <FileText className="h-4 w-4 text-plasma-purple" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Brand Assets.zip</div>
                      <div className="text-xs text-gray-400">15.7 MB • 1 hour ago</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-2 bg-plasma-surface/30 rounded-lg hover:bg-plasma-surface/50 cursor-pointer" data-testid="file-project-timeline">
                    <div className="w-8 h-8 bg-plasma-pink/20 rounded flex items-center justify-center">
                      <FileText className="h-4 w-4 text-plasma-pink" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Project Timeline.xlsx</div>
                      <div className="text-xs text-gray-400">892 KB • 2 hours ago</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="team" className="h-full flex flex-col m-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Team Members</h3>
                    <Button size="sm" variant="outline" data-testid="button-invite-member">
                      <Plus className="h-3 w-3 mr-1" />
                      Invite
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=40&h=40&fit=crop"
                          alt="Maya"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-plasma-dark"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Maya Rodriguez</div>
                        <div className="text-xs text-gray-400">Digital Artist • Online</div>
                      </div>
                      <Badge className="bg-plasma-purple/20 text-plasma-purple text-xs">Co-creator</Badge>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=40&h=40&fit=crop"
                          alt="David"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-plasma-dark"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">David Kim</div>
                        <div className="text-xs text-gray-400">Entrepreneur • Online</div>
                      </div>
                      <Badge className="bg-plasma-pink/20 text-plasma-pink text-xs">Advisor</Badge>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&w=40&h=40&fit=crop"
                          alt="Sarah"
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-plasma-dark"></div>
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">Sarah Wilson</div>
                        <div className="text-xs text-gray-400">Music Producer • Away</div>
                      </div>
                      <Badge className="bg-plasma-blue/20 text-plasma-blue text-xs">Audio Lead</Badge>
                    </div>
                  </div>

                  {/* Energy Sync Status */}
                  <div className="mt-6 p-3 bg-gradient-to-r from-plasma-blue/10 to-plasma-purple/10 rounded-lg border border-plasma-blue/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Team Energy Sync</span>
                      <span className="text-xs text-plasma-blue font-mono">87%</span>
                    </div>
                    <div className="w-full bg-plasma-surface rounded-full h-2">
                      <div className="bg-gradient-to-r from-plasma-blue to-plasma-purple h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">Collaboration energy levels optimal</div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}