import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContentSchema, insertInteractionSchema, insertUserSchema } from "@shared/schema";
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

  // Mock file upload endpoint (for demo purposes)
  app.post("/api/upload", async (req, res) => {
    try {
      // In a real implementation, this would handle file uploads
      // For now, return a mock URL
      const mockUrl = `/api/files/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      res.json({ url: mockUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
