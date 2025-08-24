import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "video" | "giig" | "post";
}

export default function UploadModal({ isOpen, onClose, contentType }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim()) {
        throw new Error("Title is required");
      }
      
      let fileUrl = "";
      let thumbnailUrl = "";
      let duration = 0;
      
      // Handle file upload for video/giig
      if (file && contentType !== "post") {
        setUploadProgress(25);
        const uploadResponse = await apiRequest("POST", "/api/upload", { filename: file.name });
        setUploadProgress(75);
        const { url } = await uploadResponse.json();
        fileUrl = url;
        
        if (contentType === "video") {
          thumbnailUrl = url.replace(/\.[^/.]+$/, "-thumb.jpg");
          duration = Math.floor(Math.random() * 600) + 60; // Random duration 1-10 minutes
        } else if (contentType === "giig") {
          duration = Math.floor(Math.random() * 60) + 15; // Random duration 15-75 seconds
        }
      }
      setUploadProgress(90);
      
      const contentData = {
        userId: "user-1", // Mock current user
        type: contentType,
        title: title.trim(),
        description: description.trim(),
        fileUrl: fileUrl || undefined,
        thumbnailUrl: thumbnailUrl || undefined,
        duration: duration || undefined,
        isPublished: true,
      };
      
      const response = await apiRequest("POST", "/api/content", contentData);
      setUploadProgress(100);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content Uploaded!",
        description: `Your ${contentType} has been published successfully.`,
      });
      resetForm();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload content. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    uploadMutation.mutate();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
    setUploadProgress(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-morphism border border-plasma-blue/20" data-testid="modal-upload">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Upload {contentType.charAt(0).toUpperCase() + contentType.slice(1)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Share your {contentType} content with the PLASMA community. Add a title, description, and upload your file.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload for Video/Giig */}
          {contentType !== "post" && (
            <div className="border-2 border-dashed border-plasma-blue/30 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto mb-4 text-plasma-blue" />
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
                data-testid="input-file"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <p className="text-lg font-semibold mb-2">Click to upload or drag and drop</p>
                <p className="text-gray-400">MP4, MOV, AVI files supported</p>
              </label>
              {file && (
                <p className="mt-2 text-sm text-plasma-blue">{file.name}</p>
              )}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-plasma-blue h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-center mt-2">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your content a compelling title..."
              required
              data-testid="input-title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your content..."
              className="min-h-[120px]"
              data-testid="textarea-description"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-plasma-blue to-plasma-purple"
              disabled={uploadMutation.isPending || (!file && contentType !== "post") || !title.trim()}
              data-testid="button-upload"
            >
              {uploadMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Content"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
