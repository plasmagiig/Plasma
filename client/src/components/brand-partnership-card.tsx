import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  Building, 
  DollarSign, 
  Calendar, 
  Target, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface BrandPartnershipCardProps {
  partnership: {
    id: string;
    brandName: string;
    campaignTitle: string;
    description: string;
    budget: number;
    requirements: string; // JSON string
    status: string;
    matchScore?: number;
    deadline?: string;
    createdAt: string;
  };
}

const STATUS_COLORS = {
  pending: "bg-yellow-500/20 text-yellow-400",
  accepted: "bg-blue-500/20 text-blue-400",
  rejected: "bg-red-500/20 text-red-400",
  completed: "bg-green-500/20 text-green-400"
};

const STATUS_ICONS = {
  pending: Clock,
  accepted: CheckCircle,
  rejected: AlertCircle,
  completed: Star
};

export default function BrandPartnershipCard({ partnership }: BrandPartnershipCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const respondMutation = useMutation({
    mutationFn: async (action: "accept" | "reject") => {
      return apiRequest("POST", "/api/partnerships/respond", {
        partnershipId: partnership.id,
        action,
        userId: "user-1"
      });
    },
    onSuccess: (_, action) => {
      toast({
        title: action === "accept" ? "Partnership Accepted! 🤝" : "Partnership Declined",
        description: action === "accept" 
          ? `You've accepted the ${partnership.brandName} campaign`
          : "The partnership has been declined",
      });
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/partnerships"] });
    },
  });

  const requirements = JSON.parse(partnership.requirements || "{}");
  const statusClass = STATUS_COLORS[partnership.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.pending;
  const StatusIcon = STATUS_ICONS[partnership.status as keyof typeof STATUS_ICONS] || Clock;
  const matchScore = partnership.matchScore || 85;

  return (
    <Card className="glass-morphism hover:scale-105 transition-all duration-300 border-l-4 border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg" data-testid={`brand-${partnership.id}`}>
                {partnership.brandName}
              </CardTitle>
              <p className="text-sm text-gray-400">{partnership.campaignTitle}</p>
            </div>
          </div>
          <div className="text-right">
            <Badge className={statusClass}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {partnership.status}
            </Badge>
            <div className="text-2xl font-bold text-green-400 mt-1">
              ${partnership.budget.toLocaleString()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-400 line-clamp-2">{partnership.description}</p>

        {/* Match Score */}
        <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">AI Match Score</span>
            <span className="text-blue-400 font-bold">{matchScore}%</span>
          </div>
          <Progress value={matchScore} className="h-2 mb-2" />
          <p className="text-xs text-gray-400">
            {matchScore >= 90 ? "Perfect match for your audience!" :
             matchScore >= 70 ? "Great compatibility with your content" :
             "Good potential partnership opportunity"}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-plasma-surface/30 rounded-lg">
            <div className="flex items-center justify-center space-x-1 text-green-400 mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="font-bold">${partnership.budget/1000}K</span>
            </div>
            <p className="text-xs text-gray-400">Budget</p>
          </div>
          
          {partnership.deadline && (
            <div className="text-center p-2 bg-plasma-surface/30 rounded-lg">
              <div className="flex items-center justify-center space-x-1 text-orange-400 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="font-bold text-xs">
                  {formatDistanceToNow(new Date(partnership.deadline), { addSuffix: true })}
                </span>
              </div>
              <p className="text-xs text-gray-400">Deadline</p>
            </div>
          )}
        </div>

        {/* Key Requirements Preview */}
        {requirements.platforms && (
          <div className="flex flex-wrap gap-2">
            {requirements.platforms.slice(0, 3).map((platform: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {platform}
              </Badge>
            ))}
            {requirements.platforms.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{requirements.platforms.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                disabled={partnership.status !== "pending"}
                data-testid={`view-partnership-${partnership.id}`}
              >
                {partnership.status === "pending" ? "View Details" : 
                 partnership.status === "accepted" ? "In Progress" : "Completed"}
              </Button>
            </DialogTrigger>
            
            <DialogContent className="glass-morphism border-green-500/20 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-green-500" />
                  <span>{partnership.brandName} Partnership</span>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Campaign Overview */}
                <div className="p-4 bg-plasma-surface/30 rounded-lg">
                  <h4 className="font-medium mb-2">{partnership.campaignTitle}</h4>
                  <p className="text-sm text-gray-400 mb-4">{partnership.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-green-500" />
                      <span className="font-medium">${partnership.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                      <span>{matchScore}% Match</span>
                    </div>
                  </div>
                </div>

                {/* Detailed Requirements */}
                <div>
                  <h4 className="font-medium mb-3">Campaign Requirements</h4>
                  <div className="space-y-3">
                    {requirements.contentType && (
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-plasma-blue" />
                        <span className="text-sm">Content Type: {requirements.contentType}</span>
                      </div>
                    )}
                    {requirements.minFollowers && (
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-plasma-purple" />
                        <span className="text-sm">Min Followers: {requirements.minFollowers.toLocaleString()}</span>
                      </div>
                    )}
                    {requirements.deliverables && (
                      <div>
                        <p className="text-sm font-medium mb-2">Deliverables:</p>
                        <ul className="text-sm text-gray-400 space-y-1 ml-4">
                          {requirements.deliverables.map((item: string, index: number) => (
                            <li key={index}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Response Buttons for Pending */}
                {partnership.status === "pending" && (
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => respondMutation.mutate("accept")}
                      disabled={respondMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500"
                      data-testid={`accept-partnership-${partnership.id}`}
                    >
                      {respondMutation.isPending ? "Processing..." : "Accept Partnership"}
                    </Button>
                    <Button
                      onClick={() => respondMutation.mutate("reject")}
                      disabled={respondMutation.isPending}
                      variant="outline"
                      className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/10"
                      data-testid={`decline-partnership-${partnership.id}`}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-gray-600"
            data-testid={`share-partnership-${partnership.id}`}
          >
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}