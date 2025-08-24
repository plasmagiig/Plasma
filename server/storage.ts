import { type User, type InsertUser, type Content, type InsertContent, type Interaction, type InsertInteraction, type Subscription, type InsertSubscription, type Earning, type InsertEarning } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;

  // Content
  getContent(id: string): Promise<Content | undefined>;
  getContentByUser(userId: string): Promise<Content[]>;
  getAllContent(): Promise<Content[]>;
  createContent(content: InsertContent): Promise<Content>;
  updateContent(id: string, updates: Partial<Content>): Promise<Content | undefined>;
  deleteContent(id: string): Promise<boolean>;

  // Interactions
  getInteractionsByContent(contentId: string): Promise<Interaction[]>;
  getInteractionsByUser(userId: string): Promise<Interaction[]>;
  createInteraction(interaction: InsertInteraction): Promise<Interaction>;
  getUserInteractionForContent(userId: string, contentId: string, type: string): Promise<Interaction | undefined>;

  // Subscriptions
  getSubscriptionsByCreator(creatorId: string): Promise<Subscription[]>;
  getSubscriptionsBySubscriber(subscriberId: string): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined>;

  // Earnings
  getEarningsByUser(userId: string): Promise<Earning[]>;
  createEarning(earning: InsertEarning): Promise<Earning>;
  getUserEarningsSummary(userId: string): Promise<{ total: number; today: number; thisWeek: number; thisMonth: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private content: Map<string, Content> = new Map();
  private interactions: Map<string, Interaction> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private earnings: Map<string, Earning> = new Map();

  constructor() {
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo users
    const demoUsers = [
      {
        id: "user-1",
        username: "alexchen",
        email: "alex@plasma.com",
        displayName: "Alex Chen",
        bio: "Tech creator exploring the future of Web3 and decentralized technology",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&w=150&h=150&fit=crop",
        energyLevel: 1247,
        totalEarnings: "2847.93",
        followersCount: 12400,
        followingCount: 234,
        createdAt: new Date(),
      },
      {
        id: "user-2",
        username: "mayarodriguez",
        email: "maya@plasma.com",
        displayName: "Maya Rodriguez",
        bio: "Digital artist creating immersive experiences and NFT collections",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&w=150&h=150&fit=crop",
        energyLevel: 2876,
        totalEarnings: "4523.67",
        followersCount: 18600,
        followingCount: 156,
        createdAt: new Date(),
      },
      {
        id: "user-3",
        username: "davidkim",
        email: "david@plasma.com",
        displayName: "David Kim",
        bio: "Entrepreneur building the creator economy of tomorrow",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=150&h=150&fit=crop",
        energyLevel: 945,
        totalEarnings: "12456.78",
        followersCount: 9800,
        followingCount: 89,
        createdAt: new Date(),
      },
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    // Create demo content
    const demoContent = [
      {
        id: "content-1",
        userId: "user-1",
        type: "video",
        title: "Building the Future of Web3",
        description: "Exploring the latest developments in decentralized technology and what it means for creators...",
        fileUrl: "/api/content/video-1.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1547082299-de196ea013d6?ixlib=rb-4.0.3&w=400&h=225&fit=crop",
        duration: 754,
        energyBoosts: 847,
        resonance: 234,
        amplify: 89,
        earnings: "43.20",
        isPublished: true,
        createdAt: new Date(),
      },
      {
        id: "content-2",
        userId: "user-2",
        type: "giig",
        title: "60 Second Art Challenge",
        description: "Creating a masterpiece in under a minute using only digital brushes...",
        fileUrl: "/api/content/giig-1.mp4",
        thumbnailUrl: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?ixlib=rb-4.0.3&w=300&h=533&fit=crop",
        duration: 45,
        energyBoosts: 1200,
        resonance: 456,
        amplify: 178,
        earnings: "67.80",
        isPublished: true,
        createdAt: new Date(),
      },
      {
        id: "content-3",
        userId: "user-3",
        type: "post",
        title: "The Creator Economy Revolution",
        description: "Just hit my first $10k month on Plasma! 🚀 Here's what I learned about building a sustainable creator business in the new economy...",
        energyBoosts: 567,
        resonance: 123,
        amplify: 45,
        earnings: "23.45",
        isPublished: true,
        createdAt: new Date(),
      },
    ];

    demoContent.forEach(content => this.content.set(content.id, content));
  }

  // Users
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      energyLevel: 0,
      totalEarnings: "0.00",
      followersCount: 0,
      followingCount: 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Content
  async getContent(id: string): Promise<Content | undefined> {
    return this.content.get(id);
  }

  async getContentByUser(userId: string): Promise<Content[]> {
    return Array.from(this.content.values()).filter(content => content.userId === userId);
  }

  async getAllContent(): Promise<Content[]> {
    return Array.from(this.content.values()).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createContent(insertContent: InsertContent): Promise<Content> {
    const id = randomUUID();
    const content: Content = {
      ...insertContent,
      id,
      energyBoosts: 0,
      resonance: 0,
      amplify: 0,
      earnings: "0.00",
      createdAt: new Date(),
    };
    this.content.set(id, content);
    return content;
  }

  async updateContent(id: string, updates: Partial<Content>): Promise<Content | undefined> {
    const content = this.content.get(id);
    if (!content) return undefined;
    
    const updatedContent = { ...content, ...updates };
    this.content.set(id, updatedContent);
    return updatedContent;
  }

  async deleteContent(id: string): Promise<boolean> {
    return this.content.delete(id);
  }

  // Interactions
  async getInteractionsByContent(contentId: string): Promise<Interaction[]> {
    return Array.from(this.interactions.values()).filter(interaction => interaction.contentId === contentId);
  }

  async getInteractionsByUser(userId: string): Promise<Interaction[]> {
    return Array.from(this.interactions.values()).filter(interaction => interaction.userId === userId);
  }

  async createInteraction(insertInteraction: InsertInteraction): Promise<Interaction> {
    const id = randomUUID();
    const interaction: Interaction = {
      ...insertInteraction,
      id,
      createdAt: new Date(),
    };
    this.interactions.set(id, interaction);

    // Update content interaction counts
    const content = this.content.get(insertInteraction.contentId);
    if (content) {
      const updates: Partial<Content> = {};
      if (insertInteraction.type === "boost") {
        updates.energyBoosts = (content.energyBoosts || 0) + 1;
      } else if (insertInteraction.type === "resonance") {
        updates.resonance = (content.resonance || 0) + 1;
      } else if (insertInteraction.type === "amplify") {
        updates.amplify = (content.amplify || 0) + 1;
      }
      await this.updateContent(content.id, updates);
    }

    return interaction;
  }

  async getUserInteractionForContent(userId: string, contentId: string, type: string): Promise<Interaction | undefined> {
    return Array.from(this.interactions.values()).find(
      interaction => interaction.userId === userId && interaction.contentId === contentId && interaction.type === type
    );
  }

  // Subscriptions
  async getSubscriptionsByCreator(creatorId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.creatorId === creatorId);
  }

  async getSubscriptionsBySubscriber(subscriberId: string): Promise<Subscription[]> {
    return Array.from(this.subscriptions.values()).filter(sub => sub.subscriberId === subscriberId);
  }

  async createSubscription(insertSubscription: InsertSubscription): Promise<Subscription> {
    const id = randomUUID();
    const subscription: Subscription = {
      ...insertSubscription,
      id,
      createdAt: new Date(),
    };
    this.subscriptions.set(id, subscription);
    return subscription;
  }

  async updateSubscription(id: string, updates: Partial<Subscription>): Promise<Subscription | undefined> {
    const subscription = this.subscriptions.get(id);
    if (!subscription) return undefined;
    
    const updatedSubscription = { ...subscription, ...updates };
    this.subscriptions.set(id, updatedSubscription);
    return updatedSubscription;
  }

  // Earnings
  async getEarningsByUser(userId: string): Promise<Earning[]> {
    return Array.from(this.earnings.values()).filter(earning => earning.userId === userId);
  }

  async createEarning(insertEarning: InsertEarning): Promise<Earning> {
    const id = randomUUID();
    const earning: Earning = {
      ...insertEarning,
      id,
      createdAt: new Date(),
    };
    this.earnings.set(id, earning);
    return earning;
  }

  async getUserEarningsSummary(userId: string): Promise<{ total: number; today: number; thisWeek: number; thisMonth: number }> {
    const userEarnings = await this.getEarningsByUser(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (7 * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const total = userEarnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
    const todayEarnings = userEarnings.filter(e => e.createdAt >= today).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
    const weekEarnings = userEarnings.filter(e => e.createdAt >= thisWeek).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
    const monthEarnings = userEarnings.filter(e => e.createdAt >= thisMonth).reduce((sum, earning) => sum + parseFloat(earning.amount), 0);

    return {
      total,
      today: todayEarnings,
      thisWeek: weekEarnings,
      thisMonth: monthEarnings,
    };
  }
}

export const storage = new MemStorage();
