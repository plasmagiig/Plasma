import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Zap, Crown, Gem, Gift } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

interface VirtualGiftSenderProps {
  receiverId: string;
  contentId?: string;
  receiverName: string;
}

const GIFT_TYPES = [
  { 
    id: "heart", 
    name: "Heart", 
    icon: Heart, 
    color: "text-red-500", 
    bg: "bg-red-500/20",
    value: 1.00,
    description: "Show some love ❤️"
  },
  { 
    id: "star", 
    name: "Star", 
    icon: Star, 
    color: "text-yellow-500", 
    bg: "bg-yellow-500/20",
    value: 2.50,
    description: "You're a star! ⭐"
  },
  { 
    id: "lightning", 
    name: "Lightning", 
    icon: Zap, 
    color: "text-blue-500", 
    bg: "bg-blue-500/20",
    value: 5.00,
    description: "Electrifying content! ⚡"
  },
  { 
    id: "crown", 
    name: "Crown", 
    icon: Crown, 
    color: "text-purple-500", 
    bg: "bg-purple-500/20",
    value: 10.00,
    description: "You're royalty! 👑"
  },
  { 
    id: "diamond", 
    name: "Diamond", 
    icon: Gem, 
    color: "text-cyan-500", 
    bg: "bg-cyan-500/20",
    value: 25.00,
    description: "Precious like a diamond! 💎"
  }
];

export default function VirtualGiftSender({ receiverId, contentId, receiverName }: VirtualGiftSenderProps) {
  const [selectedGift, setSelectedGift] = useState(GIFT_TYPES[0]);
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const giftMutation = useMutation({
    mutationFn: async (giftData: any) => {
      return apiRequest("POST", "/api/virtual-gifts", giftData);
    },
    onSuccess: () => {
      toast({
        title: "Gift Sent! 🎁",
        description: `Your ${selectedGift.name} has been sent to ${receiverName}`,
      });
      setIsOpen(false);
      setMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
    },
    onError: () => {
      toast({
        title: "Failed to Send Gift",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSendGift = () => {
    giftMutation.mutate({
      senderId: "user-1", // Current user
      receiverId,
      contentId,
      giftType: selectedGift.id,
      value: selectedGift.value,
      message: message.trim() || undefined,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="flex items-center space-x-1 text-yellow-500 hover:text-yellow-400"
          data-testid="button-send-gift"
        >
          <Gift className="h-4 w-4" />
          <span>Gift</span>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="glass-morphism border-plasma-blue/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-yellow-500" />
            <span>Send Gift to {receiverName}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Gift Selection */}
          <div>
            <h3 className="text-sm font-medium mb-3">Choose a Gift</h3>
            <div className="grid grid-cols-3 gap-3">
              {GIFT_TYPES.map((gift) => {
                const IconComponent = gift.icon;
                const isSelected = selectedGift.id === gift.id;
                
                return (
                  <Card 
                    key={gift.id}
                    className={`
                      cursor-pointer transition-all duration-200 hover:scale-105
                      ${isSelected 
                        ? 'ring-2 ring-plasma-blue bg-plasma-surface/50' 
                        : 'hover:bg-plasma-surface/30'
                      }
                    `}
                    onClick={() => setSelectedGift(gift)}
                    data-testid={`gift-${gift.id}`}
                  >
                    <CardContent className="p-3 text-center">
                      <div className={`w-12 h-12 rounded-full ${gift.bg} flex items-center justify-center mx-auto mb-2`}>
                        <IconComponent className={`h-6 w-6 ${gift.color}`} />
                      </div>
                      <div className="text-xs font-medium">{gift.name}</div>
                      <div className="text-xs text-yellow-500 font-bold">${gift.value}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Selected Gift Info */}
          <Card className="bg-plasma-surface/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{selectedGift.name}</span>
                <Badge className="bg-yellow-500/20 text-yellow-400">
                  ${selectedGift.value}
                </Badge>
              </div>
              <p className="text-sm text-gray-400">{selectedGift.description}</p>
            </CardContent>
          </Card>

          {/* Optional Message */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Message (Optional)
            </label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
              className="resize-none h-20"
              maxLength={100}
              data-testid="gift-message"
            />
            <div className="text-xs text-gray-400 text-right mt-1">
              {message.length}/100
            </div>
          </div>

          {/* Send Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <div className="text-sm text-gray-400">
              Total: <span className="text-yellow-500 font-bold">${selectedGift.value}</span>
            </div>
            <Button
              onClick={handleSendGift}
              disabled={giftMutation.isPending}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              data-testid="button-confirm-gift"
            >
              {giftMutation.isPending ? "Sending..." : "Send Gift 🎁"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}