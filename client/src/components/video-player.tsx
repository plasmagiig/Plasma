import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  onClose: () => void;
}

export default function VideoPlayer({ src, onClose }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play when component mounts
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden group" data-testid="video-player">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        controls={false}
        loop
        playsInline
      >
        <source src={src} type="video/mp4" />
        {/* Fallback for demo */}
        <div className="w-full h-full bg-gradient-to-br from-plasma-blue/20 to-plasma-purple/20 flex items-center justify-center">
          <p className="text-white">Video content would play here</p>
        </div>
      </video>

      {/* Video Controls Overlay */}
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white"
            data-testid="button-close-video"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePlay}
            className="bg-black/50 hover:bg-black/70 text-white"
            data-testid="button-toggle-play"
          >
            <Play className="h-4 w-4" />
          </Button>

          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div className="bg-plasma-blue rounded-full h-2 w-1/3"></div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMute}
            className="bg-black/50 hover:bg-black/70 text-white"
            data-testid="button-toggle-mute"
          >
            <Volume2 className="h-4 w-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="bg-black/50 hover:bg-black/70 text-white"
            data-testid="button-fullscreen"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
