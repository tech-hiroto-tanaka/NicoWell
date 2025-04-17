import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for storing optional email signups
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User profile data
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  ageRange: text("age_range").notNull(),
  lifestyle: text("lifestyle").notNull(),
  sleepDuration: text("sleep_duration").notNull(),
  exerciseFrequency: text("exercise_frequency").notNull(),
  wellnessGoals: text("wellness_goals").array().notNull(),
  healthConcerns: text("health_concerns").array().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Analysis results
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id),
  focusArea: text("focus_area").notNull(),
  insightSummary: text("insight_summary").notNull(),
  recommendedAction: text("recommended_action").notNull(),
  benefitExplanation: text("benefit_explanation").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Feedback survey responses
export const surveyResponses = pgTable("survey_responses", {
  id: serial("id").primaryKey(),
  satisfaction: text("satisfaction").notNull(),
  feasibility: text("feasibility").notNull(),
  email: text("email"),
  profileData: jsonb("profile_data"),
  analysisData: jsonb("analysis_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Chat messages
export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id),
  message: text("message").notNull(),
  isUser: boolean("is_user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Define Zod schemas for inserts
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProfileSchema = createInsertSchema(profiles).omit({ id: true, createdAt: true });
export const insertAnalysisResultSchema = createInsertSchema(analysisResults).omit({ id: true, createdAt: true });
export const insertSurveyResponseSchema = createInsertSchema(surveyResponses).omit({ id: true, createdAt: true });
export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({ id: true, createdAt: true });

// Define types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;
export type AnalysisResult = typeof analysisResults.$inferSelect;

export type InsertSurveyResponse = z.infer<typeof insertSurveyResponseSchema>;
export type SurveyResponse = typeof surveyResponses.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
