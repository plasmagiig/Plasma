import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Users, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import UserAvatar from "./user-avatar";

interface CreatorTokenWidgetProps {
  creatorId: string;
  creator: {
    username: string;
    displayName: string;
    avatar?: string;
  };
}

export default function CreatorTokenWidget({ creatorId, creator }: CreatorTokenWidgetProps) {
  const [buyAmount, setBuyAmount] = useState(10);
  const [sellAmount, setSellAmount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  // Mock data - would come from API in real app
  const tokenData = {
    id: "token-1",
    creatorId,
    tokenSymbol: `${creator.username.toUpperCase()}`,
    currentPrice: 2.45,
    priceChange24h: 12.5,
    marketCap: 24500,
    totalSupply: 10000,
    holders: 1247,
    myHoldings: 25,
    dividendYield: 8.2,
    performance30d: 34.7
  };

  const buyMutation = useMutation({
    mutationFn: async (data: { shares: number; price: number }) => {
      return apiRequest("POST", "/api/tokens/buy", {
        creatorTokenId: tokenData.id,
        shares: data.shares,
        purchasePrice: data.price,
        userId: "user-1"
      });
    },
    onSuccess: () => {
      toast({
        title: "Purchase Successful! 🎉",
        description: `You now own ${buyAmount} ${tokenData.tokenSymbol} tokens`,
      });
      setIsDialogOpen(false);
      setBuyAmount(10);
      queryClient.invalidateQueries({ queryKey: ["/api/tokens"] });
    },
  });

  const handleBuyTokens = () => {
    buyMutation.mutate({
      shares: buyAmount,
      price: tokenData.currentPrice
    });
  };

  const totalCost = buyAmount * tokenData.currentPrice;
  const priceChangeColor = tokenData.priceChange24h >= 0 ? "text-green-500" : "text-red-500";
  const priceChangeIcon = tokenData.priceChange24h >= 0 ? ArrowUpRight : ArrowDownRight;
  const PriceIcon = priceChangeIcon;

  return (
    <Card className="glass-morphism border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar user={creator} size="sm" />
            <div>
              <CardTitle className="text-lg">{tokenData.tokenSymbol} Token</CardTitle>
              <p className="text-sm text-gray-400">Creator Equity Share</p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            Live Trading
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Info */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold">${tokenData.currentPrice}</span>
              <div className={`flex items-center space-x-1 ${priceChangeColor}`}>
                <PriceIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {tokenData.priceChange24h > 0 ? '+' : ''}{tokenData.priceChange24h}%
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400">24h change</p>
          </div>
          
          <div className="text-right">
            <p className="font-medium">{tokenData.myHoldings} tokens</p>
            <p className="text-xs text-gray-400">Your holdings</p>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-plasma-surface/30 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-green-400 mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="font-bold">{tokenData.dividendYield}%</span>
            </div>
            <p className="text-xs text-gray-400">Dividend Yield</p>
          </div>
          
          <div className="text-center p-3 bg-plasma-surface/30 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-blue-400 mb-1">
              <Users className="h-4 w-4" />
              <span className="font-bold">{tokenData.holders}</span>
            </div>
            <p className="text-xs text-gray-400">Holders</p>
          </div>
        </div>

        {/* Investment Performance */}
        <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">30-Day Performance</span>
            <span className="text-green-400 font-bold">+{tokenData.performance30d}%</span>
          </div>
          <Progress value={Math.min(tokenData.performance30d, 100)} className="h-2" />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                data-testid="buy-creator-tokens"
              >
                <Coins className="h-4 w-4 mr-2" />
                Invest
              </Button>
            </DialogTrigger>
            
            <DialogContent className="glass-morphism border-blue-500/20 max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-blue-500" />
                  <span>Invest in {creator.displayName}</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h4 className="font-medium mb-2">Why invest in {creator.displayName}?</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Get dividends from all creator earnings</li>
                    <li>• Token value grows with creator popularity</li>
                    <li>• Support your favorite creator directly</li>
                    <li>• Trade tokens on the marketplace</li>
                  </ul>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Number of tokens</label>
                  <Input
                    type="number"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(Number(e.target.value))}
                    min="1"
                    max="1000"
                    className="mb-2"
                    data-testid="token-buy-amount"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Price per token: ${tokenData.currentPrice}</span>
                    <span className="font-medium">Total: ${totalCost.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handleBuyTokens}
                  disabled={buyMutation.isPending || buyAmount <= 0}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500"
                  data-testid="confirm-token-purchase"
                >
                  {buyMutation.isPending ? "Processing..." : `Buy ${buyAmount} Tokens for $${totalCost.toFixed(2)}`}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600"
            data-testid="view-token-chart"
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}