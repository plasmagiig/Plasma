import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  displayName: text("display_name").notNull(),
  bio: text("bio"),
  avatar: text("avatar"),
  energyLevel: integer("energy_level").default(0),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  followersCount: integer("followers_count").default(0),
  followingCount: integer("following_count").default(0),
  creatorLevel: text("creator_level").default("bronze"), // bronze, silver, gold, platinum
  achievementPoints: integer("achievement_points").default(0),
  theme: text("theme").default("dark"), // dark, light
  notificationSettings: text("notification_settings").default("{}"), // JSON string
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const content = pgTable("content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // "post", "video", "giig", "livestream"
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  thumbnailUrl: text("thumbnail_url"),
  duration: integer("duration"), // in seconds for videos
  energyBoosts: integer("energy_boosts").default(0),
  resonance: integer("resonance").default(0),
  amplify: integer("amplify").default(0),
  earnings: decimal("earnings", { precision: 10, scale: 2 }).default("0.00"),
  isPublished: boolean("is_published").default(true),
  isLive: boolean("is_live").default(false),
  viewersCount: integer("viewers_count").default(0),
  streamKey: text("stream_key"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const interactions = pgTable("interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentId: varchar("content_id").references(() => content.id).notNull(),
  type: text("type").notNull(), // "boost", "resonance", "amplify"
  energyValue: integer("energy_value").default(1),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  subscriberId: varchar("subscriber_id").references(() => users.id).notNull(),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  tier: text("tier").notNull(), // "basic", "premium", "plasma"
  monthlyAmount: decimal("monthly_amount", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const earnings = pgTable("earnings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  source: text("source").notNull(), // "boosts", "subscriptions", "store", "tips"
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const comments = pgTable("comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentId: varchar("content_id").references(() => content.id).notNull(),
  parentId: varchar("parent_id"), // For nested replies
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  points: integer("points").notNull(),
  category: text("category").notNull(), // content, engagement, milestone
  requirement: text("requirement").notNull(), // JSON string with conditions
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementId: varchar("achievement_id").references(() => achievements.id).notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  isNew: boolean("is_new").default(true),
});

export const reactions = pgTable("reactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  contentId: varchar("content_id").references(() => content.id).notNull(),
  emoji: text("emoji").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const virtualGifts = pgTable("virtual_gifts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  senderId: varchar("sender_id").references(() => users.id).notNull(),
  receiverId: varchar("receiver_id").references(() => users.id).notNull(),
  contentId: varchar("content_id").references(() => content.id),
  giftType: text("gift_type").notNull(), // heart, star, fire, etc.
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const stories = pgTable("stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  fileUrl: text("file_url").notNull(),
  caption: text("caption"),
  viewsCount: integer("views_count").default(0),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const storyViews = pgTable("story_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").references(() => stories.id).notNull(),
  viewerId: varchar("viewer_id").references(() => users.id).notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  hashtag: text("hashtag").notNull(),
  reward: integer("reward").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const creatorTokens = pgTable("creator_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  tokenSymbol: text("token_symbol").notNull().unique(),
  totalSupply: integer("total_supply").default(10000),
  currentPrice: decimal("current_price", { precision: 10, scale: 6 }).default("1.00"),
  marketCap: decimal("market_cap", { precision: 15, scale: 2 }).default("0.00"),
  dividendPool: decimal("dividend_pool", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tokenHoldings = pgTable("token_holdings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  creatorTokenId: varchar("creator_token_id").references(() => creatorTokens.id).notNull(),
  shares: integer("shares").notNull(),
  purchasePrice: decimal("purchase_price", { precision: 10, scale: 6 }).notNull(),
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

export const collaborativeContent = pgTable("collaborative_content", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  contentId: varchar("content_id").references(() => content.id).notNull(),
  collaborators: text("collaborators").array().notNull(), // JSON array of user IDs with contribution %
  profitSplits: text("profit_splits").notNull(), // JSON object with userId: percentage
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillMarketplace = pgTable("skill_marketplace", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  duration: integer("duration").notNull(), // in minutes
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  videoUrl: text("video_url"),
  thumbnailUrl: text("thumbnail_url"),
  enrollmentCount: integer("enrollment_count").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const skillEnrollments = pgTable("skill_enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  skillId: varchar("skill_id").references(() => skillMarketplace.id).notNull(),
  completed: boolean("completed").default(false),
  rating: integer("rating"), // 1-5 stars
  review: text("review"),
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const brandPartnerships = pgTable("brand_partnerships", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  creatorId: varchar("creator_id").references(() => users.id).notNull(),
  brandName: text("brand_name").notNull(),
  campaignTitle: text("campaign_title").notNull(),
  description: text("description").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  requirements: text("requirements").notNull(), // JSON string
  status: text("status").default("pending"), // pending, accepted, rejected, completed
  matchScore: integer("match_score"), // AI-generated 1-100 compatibility score
  deadline: timestamp("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
  energyBoosts: true,
  resonance: true,
  amplify: true,
  earnings: true,
});

export const insertInteractionSchema = createInsertSchema(interactions).omit({
  id: true,
  createdAt: true,
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
});

export const insertEarningSchema = createInsertSchema(earnings).omit({
  id: true,
  createdAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  createdAt: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertReactionSchema = createInsertSchema(reactions).omit({
  id: true,
  createdAt: true,
});

export const insertVirtualGiftSchema = createInsertSchema(virtualGifts).omit({
  id: true,
  createdAt: true,
});

export const insertStorySchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true,
  viewsCount: true,
});

export const insertStoryViewSchema = createInsertSchema(storyViews).omit({
  id: true,
  viewedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
});

export const insertCreatorTokenSchema = createInsertSchema(creatorTokens).omit({
  id: true,
  createdAt: true,
});

export const insertTokenHoldingSchema = createInsertSchema(tokenHoldings).omit({
  id: true,
  purchaseDate: true,
});

export const insertCollaborativeContentSchema = createInsertSchema(collaborativeContent).omit({
  id: true,
  createdAt: true,
});

export const insertSkillMarketplaceSchema = createInsertSchema(skillMarketplace).omit({
  id: true,
  createdAt: true,
  enrollmentCount: true,
  rating: true,
});

export const insertSkillEnrollmentSchema = createInsertSchema(skillEnrollments).omit({
  id: true,
  enrolledAt: true,
  completedAt: true,
});

export const insertBrandPartnershipSchema = createInsertSchema(brandPartnerships).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Earning = typeof earnings.$inferSelect;
export type InsertEarning = z.infer<typeof insertEarningSchema>;
export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type Reaction = typeof reactions.$inferSelect;
export type InsertReaction = z.infer<typeof insertReactionSchema>;
export type VirtualGift = typeof virtualGifts.$inferSelect;
export type InsertVirtualGift = z.infer<typeof insertVirtualGiftSchema>;
export type Story = typeof stories.$inferSelect;
export type InsertStory = z.infer<typeof insertStorySchema>;
export type StoryView = typeof storyViews.$inferSelect;
export type InsertStoryView = z.infer<typeof insertStoryViewSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type CreatorToken = typeof creatorTokens.$inferSelect;
export type InsertCreatorToken = z.infer<typeof insertCreatorTokenSchema>;
export type TokenHolding = typeof tokenHoldings.$inferSelect;
export type InsertTokenHolding = z.infer<typeof insertTokenHoldingSchema>;
export type CollaborativeContent = typeof collaborativeContent.$inferSelect;
export type InsertCollaborativeContent = z.infer<typeof insertCollaborativeContentSchema>;
export type SkillMarketplace = typeof skillMarketplace.$inferSelect;
export type InsertSkillMarketplace = z.infer<typeof insertSkillMarketplaceSchema>;
export type SkillEnrollment = typeof skillEnrollments.$inferSelect;
export type InsertSkillEnrollment = z.infer<typeof insertSkillEnrollmentSchema>;
export type BrandPartnership = typeof brandPartnerships.$inferSelect;
export type InsertBrandPartnership = z.infer<typeof insertBrandPartnershipSchema>;
