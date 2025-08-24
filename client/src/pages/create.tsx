import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContentSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Video, Smartphone, FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const createContentSchema = insertContentSchema.extend({
  file: z.any().optional(),
});

type CreateContentForm = z.infer<typeof createContentSchema>;

export default function Create() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const form = useForm<CreateContentForm>({
    resolver: zodResolver(createContentSchema),
    defaultValues: {
      userId: "user-1", // Mock current user
      type: "",
      title: "",
      description: "",
      isPublished: true,
    },
  });

  const createContentMutation = useMutation({
    mutationFn: async (data: CreateContentForm) => {
      // Mock file upload
      if (data.file && data.type !== "post") {
        setUploadProgress(25);
        const uploadResponse = await apiRequest("POST", "/api/upload", { filename: data.file.name });
        setUploadProgress(75);
        const { url } = await uploadResponse.json();
        data.fileUrl = url;
        if (data.type === "video") {
          data.thumbnailUrl = url.replace(/\.[^/.]+$/, "-thumb.jpg");
          data.duration = Math.floor(Math.random() * 600) + 60; // Random duration 1-10 minutes
        } else if (data.type === "giig") {
          data.duration = Math.floor(Math.random() * 60) + 15; // Random duration 15-75 seconds
        }
      }
      setUploadProgress(100);

      const response = await apiRequest("POST", "/api/content", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/content"] });
      toast({
        title: "Content Created!",
        description: "Your content has been published to the plasma stream.",
      });
      form.reset();
      setSelectedType("");
      setUploadProgress(0);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive",
      });
      setUploadProgress(0);
    },
  });

  const contentTypes = [
    {
      id: "video",
      title: "Long Video",
      description: "Upload long-form video content",
      icon: Video,
      color: "plasma-blue",
    },
    {
      id: "giig",
      title: "Giig (Short Video)",
      description: "Create short-form vertical content",
      icon: Smartphone,
      color: "plasma-purple",
    },
    {
      id: "post",
      title: "Text Post",
      description: "Share thoughts and updates",
      icon: FileText,
      color: "plasma-pink",
    },
  ];

  const onSubmit = (data: CreateContentForm) => {
    createContentMutation.mutate(data);
  };

  return (
    <main className="pt-24 min-h-screen bg-gradient-to-br from-plasma-dark via-plasma-surface to-plasma-dark">
      <div className="container mx-auto max-w-4xl px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold mb-4 animate-glow">Create Content</h1>
          <p className="text-xl text-gray-400">Share your creativity with the plasma stream</p>
        </div>

        {!selectedType ? (
          /* Content Type Selection */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contentTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <Card
                  key={type.id}
                  className="glass-morphism border-2 border-dashed border-gray-600 hover:border-plasma-blue/60 transition-colors cursor-pointer group"
                  onClick={() => {
                    setSelectedType(type.id);
                    form.setValue("type", type.id);
                  }}
                  data-testid={`card-content-type-${type.id}`}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${type.color}/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <IconComponent className={`h-8 w-8 text-${type.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                    <p className="text-gray-400">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          /* Content Creation Form */
          <Card className="glass-morphism">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                {(() => {
                  const selectedTypeData = contentTypes.find(t => t.id === selectedType);
                  const IconComponent = selectedTypeData?.icon || Upload;
                  return (
                    <>
                      <IconComponent className={`h-6 w-6 text-${selectedTypeData?.color}`} />
                      Create {selectedTypeData?.title}
                    </>
                  );
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* File Upload for Video/Giig */}
                  {selectedType !== "post" && (
                    <FormField
                      control={form.control}
                      name="file"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload {selectedType === "video" ? "Video" : "Giig"} File</FormLabel>
                          <FormControl>
                            <div className="border-2 border-dashed border-plasma-blue/30 rounded-lg p-8 text-center hover:border-plasma-blue/60 transition-colors">
                              <Upload className="h-12 w-12 mx-auto mb-4 text-plasma-blue" />
                              <Input
                                type="file"
                                accept={selectedType === "video" ? "video/*" : "video/*"}
                                onChange={(e) => field.onChange(e.target.files?.[0])}
                                className="hidden"
                                id="file-upload"
                                data-testid="input-file-upload"
                              />
                              <label htmlFor="file-upload" className="cursor-pointer">
                                <p className="text-lg font-semibold mb-2">Click to upload or drag and drop</p>
                                <p className="text-gray-400">MP4, MOV, AVI files supported</p>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Give your content a compelling title..." 
                            {...field} 
                            data-testid="input-title"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your content..."
                            className="min-h-[120px]"
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Publishing Options */}
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Publishing Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value ? "published" : "draft"}
                            onValueChange={(value) => field.onChange(value === "published")}
                          >
                            <SelectTrigger data-testid="select-publishing-status">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="published">Publish immediately</SelectItem>
                              <SelectItem value="draft">Save as draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-plasma-surface rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-plasma-blue to-plasma-purple h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Form Actions */}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedType("");
                        form.reset();
                        setUploadProgress(0);
                      }}
                      data-testid="button-back"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={createContentMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-plasma-blue to-plasma-purple hover:scale-105 transition-transform"
                      data-testid="button-create-content"
                    >
                      {createContentMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create Content"
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
