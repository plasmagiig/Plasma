import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Volume2, VolumeX, Users, MessageCircle, Share2, Heart } from "lucide-react";

interface LiveStreamPlayerProps {
  src: string;
  onClose: () => void;
  streamTitle: string;
  streamerName: string;
  viewersCount: number;
}

export default function LiveStreamPlayer({ src, onClose, streamTitle, streamerName, viewersCount }: LiveStreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play live stream when component mounts
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden group" data-testid="live-stream-player">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={false}
        autoPlay
        muted
        playsInline
      >
        <source src={src} type="application/x-mpegURL" />
        {/* Fallback for demo */}
        <div className="w-full h-full bg-gradient-to-br from-red-500/20 to-plasma-purple/20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-red-500 text-2xl mb-4">🔴 LIVE</div>
            <p className="text-white text-lg">{streamTitle}</p>
            <p className="text-gray-300">by {streamerName}</p>
          </div>
        </div>
      </video>

      {/* Live Stream Status */}
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <Badge className="bg-red-500 hover:bg-red-500 animate-pulse">
          🔴 LIVE
        </Badge>
        <Badge className="bg-black/50 backdrop-blur-sm flex items-center space-x-1">
          <Users className="h-3 w-3" />
          <span data-testid="text-viewers-count">{viewersCount.toLocaleString()}</span>
        </Badge>
      </div>

      {/* Close Button */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white"
          data-testid="button-close-live-stream"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Live Stream Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-end justify-between">
          {/* Stream Info */}
          <div className="flex-1 mr-4">
            <h3 className="text-white font-semibold text-lg mb-1" data-testid="text-stream-title">{streamTitle}</h3>
            <p className="text-gray-300 text-sm" data-testid="text-streamer-name">by {streamerName}</p>
          </div>

          {/* Interaction Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              data-testid="button-like-stream"
            >
              <Heart className="h-4 w-4 mr-1" />
              <span className="text-xs">987</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              data-testid="button-chat-stream"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="bg-black/50 hover:bg-black/70 text-white"
              data-testid="button-share-stream"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="bg-black/50 hover:bg-black/70 text-white"
              data-testid="button-toggle-stream-mute"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Live Chat Overlay */}
      <div className="absolute right-4 top-20 bottom-20 w-80 bg-black/70 backdrop-blur-sm rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-semibold">Live Chat</h4>
          <Badge className="bg-plasma-blue/20 text-plasma-blue text-xs">
            {viewersCount} viewers
          </Badge>
        </div>
        
        {/* Chat Messages */}
        <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
          <div className="text-sm">
            <span className="text-plasma-blue font-semibold">@maya_art:</span>
            <span className="text-gray-300 ml-2">Amazing stream! ⚡</span>
          </div>
          <div className="text-sm">
            <span className="text-plasma-purple font-semibold">@tech_dave:</span>
            <span className="text-gray-300 ml-2">This is the future of streaming 🚀</span>
          </div>
          <div className="text-sm">
            <span className="text-plasma-pink font-semibold">@creator_sarah:</span>
            <span className="text-gray-300 ml-2">Energy levels are off the charts!</span>
          </div>
        </div>
        
        {/* Chat Input */}
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder="Send energy..." 
            className="flex-1 px-3 py-2 bg-plasma-surface/50 border border-plasma-blue/30 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-plasma-blue"
            data-testid="input-chat-message"
          />
          <Button size="sm" className="bg-plasma-blue hover:bg-plasma-blue/80" data-testid="button-send-chat">
            ⚡
          </Button>
        </div>
      </div>
    </div>
  );
}