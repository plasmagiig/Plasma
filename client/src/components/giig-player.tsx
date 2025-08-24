import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Heart, MessageCircle, Share2, Volume2, VolumeX } from "lucide-react";

interface GiigPlayerProps {
  src: string;
  onClose: () => void;
}

export default function GiigPlayer({ src, onClose }: GiigPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play when component mounts
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
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden" data-testid="giig-player">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={false}
        loop
        muted
        playsInline
        autoPlay
      >
        <source src={src} type="video/mp4" />
        {/* Fallback for demo */}
        <div className="w-full h-full bg-gradient-to-br from-plasma-purple/20 to-plasma-pink/20 flex items-center justify-center">
          <p className="text-white text-center px-4">Short video content would play here</p>
        </div>
      </video>

      {/* Giig Controls - TikTok style */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white"
          data-testid="button-close-giig"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Right side actions */}
      <div className="absolute right-4 bottom-20 flex flex-col gap-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white p-0"
          data-testid="button-like-giig"
        >
          <Heart className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white p-0"
          data-testid="button-comment-giig"
        >
          <MessageCircle className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white p-0"
          data-testid="button-share-giig"
        >
          <Share2 className="h-5 w-5" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70 text-white p-0"
          data-testid="button-toggle-sound"
        >
          <Volume2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-4 left-4 right-20">
        <div className="text-white">
          <p className="font-semibold mb-1">@creator</p>
          <p className="text-sm opacity-90">Amazing short content! #plasma #creator</p>
        </div>
      </div>
    </div>
  );
}
