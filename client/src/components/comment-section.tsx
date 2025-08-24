import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, Send, Reply, Heart } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  userId: string;
  contentId: string;
  parentId: string | null;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatar: string | null;
  } | null;
}

interface CommentSectionProps {
  contentId: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function CommentSection({ contentId, isOpen, onToggle }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Fetch comments
  const { data: comments = [], isLoading } = useQuery({
    queryKey: [`/api/content/${contentId}/comments`],
    enabled: isOpen,
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (data: { content: string; parentId?: string }) => {
      return apiRequest(`/api/comments`, "POST", {
        userId: "user-1", // Mock current user
        contentId,
        content: data.content,
        parentId: data.parentId || null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/content/${contentId}/comments`] });
      setNewComment("");
      setReplyText("");
      setReplyingTo(null);
      toast({
        title: "Comment posted!",
        description: "Your comment has been added to the conversation.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post comment. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      createCommentMutation.mutate({ content: newComment });
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyText.trim()) {
      createCommentMutation.mutate({ content: replyText, parentId });
    }
  };

  // Separate parent comments and replies
  const parentComments = (comments as Comment[]).filter((comment: Comment) => !comment.parentId);
  const replies = (comments as Comment[]).filter((comment: Comment) => comment.parentId);

  const getRepliesForComment = (commentId: string) => 
    replies.filter((reply: Comment) => reply.parentId === commentId);

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="text-gray-400 hover:text-plasma-blue transition-colors"
        data-testid="button-toggle-comments"
      >
        <MessageCircle className="h-4 w-4 mr-2" />
        <span>{(comments as Comment[]).length}</span>
      </Button>
    );
  }

  return (
    <div className="mt-4 space-y-4" data-testid="comment-section">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-white flex items-center">
          <MessageCircle className="h-4 w-4 mr-2 text-plasma-blue" />
          Comments ({(comments as Comment[]).length})
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-300"
          data-testid="button-close-comments"
        >
          ✕
        </Button>
      </div>

      {/* Add Comment */}
      <div className="space-y-3">
        <div className="flex space-x-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=32&h=32&fit=crop"
            alt="Your avatar"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Share your thoughts on this content..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] bg-plasma-surface/50 border-plasma-blue/30 text-white placeholder-gray-400 resize-none"
              data-testid="textarea-new-comment"
            />
            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || createCommentMutation.isPending}
                className="bg-plasma-blue hover:bg-plasma-blue/80"
                size="sm"
                data-testid="button-submit-comment"
              >
                <Send className="h-3 w-3 mr-2" />
                {createCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="text-gray-400">Loading comments...</div>
          </div>
        ) : parentComments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 mx-auto mb-3 text-gray-600" />
            <p className="text-gray-400 mb-2">No comments yet</p>
            <p className="text-sm text-gray-500">Be the first to share your thoughts!</p>
          </div>
        ) : (
          parentComments.map((comment: Comment) => (
            <Card key={comment.id} className="bg-plasma-surface/20 border-plasma-surface/30" data-testid={`comment-${comment.id}`}>
              <CardContent className="p-4">
                <div className="flex space-x-3">
                  <img
                    src={comment.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=32&h=32&fit=crop"}
                    alt={comment.user?.displayName || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-plasma-blue" data-testid="comment-author">
                        {comment.user?.displayName || "Anonymous"}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        @{comment.user?.username || "user"}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-gray-200" data-testid="comment-content">{comment.content}</p>
                    
                    {/* Comment Actions */}
                    <div className="flex items-center space-x-4 pt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-red-400 h-6 px-2"
                        data-testid="button-like-comment"
                      >
                        <Heart className="h-3 w-3 mr-1" />
                        <span className="text-xs">12</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="text-gray-400 hover:text-plasma-blue h-6 px-2"
                        data-testid="button-reply-comment"
                      >
                        <Reply className="h-3 w-3 mr-1" />
                        <span className="text-xs">Reply</span>
                      </Button>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-4 border-l-2 border-plasma-blue/30">
                        <div className="flex space-x-2">
                          <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=24&h=24&fit=crop"
                            alt="Your avatar"
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder={`Reply to ${comment.user?.displayName}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              className="min-h-[60px] bg-plasma-surface/30 border-plasma-blue/20 text-white placeholder-gray-400 resize-none text-sm"
                              data-testid="textarea-reply-comment"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                                className="text-gray-400 hover:text-gray-300 h-7 text-xs"
                                data-testid="button-cancel-reply"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={!replyText.trim() || createCommentMutation.isPending}
                                size="sm"
                                className="bg-plasma-blue hover:bg-plasma-blue/80 h-7 text-xs"
                                data-testid="button-submit-reply"
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {getRepliesForComment(comment.id).map((reply: Comment) => (
                      <div key={reply.id} className="pl-4 mt-3 border-l-2 border-plasma-purple/30" data-testid={`reply-${reply.id}`}>
                        <div className="flex space-x-2">
                          <img
                            src={reply.user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=24&h=24&fit=crop"}
                            alt={reply.user?.displayName || "User"}
                            className="w-6 h-6 rounded-full"
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-plasma-purple text-sm">
                                {reply.user?.displayName || "Anonymous"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                            <p className="text-gray-300 text-sm">{reply.content}</p>
                            <div className="flex items-center space-x-3 pt-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-500 hover:text-red-400 h-5 px-1"
                                data-testid="button-like-reply"
                              >
                                <Heart className="h-2 w-2 mr-1" />
                                <span className="text-xs">3</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}