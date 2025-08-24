import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: "video" | "giig" | "post";
}

export default function UploadModal({ isOpen, onClose, contentType }: UploadModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle upload logic here
    console.log({ title, description, file, contentType });
    onClose();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFile(null);
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
              data-testid="button-upload"
            >
              Upload Content
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
