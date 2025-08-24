import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentSchema, insertInteractionSchema, insertUserSchema, updateProfileSchema, insertCommentSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const updateData = updateProfileSchema.parse(req.body);
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid profile data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Content
  app.get("/api/content", async (req, res) => {
    try {
      const allContent = await storage.getAllContent();
      const users = await storage.getAllUsers();
      
      // Enhance content with user data
      const contentWithUsers = allContent.map(content => {
        const user = users.find(u => u.id === content.userId);
        return {
          ...content,
          user: user ? {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
          } : null,
        };
      });

      res.json(contentWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/content/:id", async (req, res) => {
    try {
      const content = await storage.getContent(req.params.id);
      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      const user = await storage.getUser(content.userId);
      const contentWithUser = {
        ...content,
        user: user ? {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
        } : null,
      };

      res.json(contentWithUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.get("/api/users/:userId/content", async (req, res) => {
    try {
      const content = await storage.getContentByUser(req.params.userId);
      res.json(content);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user content" });
    }
  });

  app.post("/api/content", async (req, res) => {
    try {
      const contentData = insertContentSchema.parse(req.body);
      const content = await storage.createContent(contentData);
      res.status(201).json(content);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid content data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.delete("/api/content/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteContent(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Content not found" });
      }
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Interactions
  app.post("/api/interactions", async (req, res) => {
    try {
      const interactionData = insertInteractionSchema.parse(req.body);
      
      // Check if user already interacted with this content in this way
      const existingInteraction = await storage.getUserInteractionForContent(
        interactionData.userId,
        interactionData.contentId,
        interactionData.type
      );

      if (existingInteraction) {
        return res.status(400).json({ message: "Already interacted with this content" });
      }

      const interaction = await storage.createInteraction(interactionData);
      res.status(201).json(interaction);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid interaction data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create interaction" });
    }
  });

  app.get("/api/content/:contentId/interactions", async (req, res) => {
    try {
      const interactions = await storage.getInteractionsByContent(req.params.contentId);
      res.json(interactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch interactions" });
    }
  });

  // User earnings
  app.get("/api/users/:userId/earnings", async (req, res) => {
    try {
      const earnings = await storage.getEarningsByUser(req.params.userId);
      res.json(earnings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch earnings" });
    }
  });

  app.get("/api/users/:userId/earnings/summary", async (req, res) => {
    try {
      const summary = await storage.getUserEarningsSummary(req.params.userId);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch earnings summary" });
    }
  });

  // Comments
  app.get("/api/content/:contentId/comments", async (req, res) => {
    try {
      const comments = await storage.getCommentsByContent(req.params.contentId);
      const users = await storage.getAllUsers();
      
      // Enhance comments with user data
      const commentsWithUsers = comments.map(comment => {
        const user = users.find(u => u.id === comment.userId);
        return {
          ...comment,
          user: user ? {
            id: user.id,
            username: user.username,
            displayName: user.displayName,
            avatar: user.avatar,
          } : null,
        };
      });

      res.json(commentsWithUsers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post("/api/comments", async (req, res) => {
    try {
      const commentData = insertCommentSchema.parse(req.body);
      const comment = await storage.createComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  app.delete("/api/comments/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteComment(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Comment not found" });
      }
      res.json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete comment" });
    }
  });

  // Mock file upload endpoint (for demo purposes)
  app.post("/api/upload", async (req, res) => {
    try {
      const { filename } = req.body;
      
      if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ message: "Filename is required" });
      }
      
      // Validate file extension
      const allowedExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
      const fileExtension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
      
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({ 
          message: "Invalid file type. Only video files are allowed." 
        });
      }
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // In a real implementation, this would handle file uploads
      // For now, return a mock URL with proper filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substr(2, 9);
      const mockUrl = `/api/files/${timestamp}-${randomId}${fileExtension}`;
      
      res.json({ 
        url: mockUrl,
        filename: filename,
        uploadedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
