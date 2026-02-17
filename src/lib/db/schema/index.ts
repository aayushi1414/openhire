import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  serial,
  jsonb,
} from "drizzle-orm/pg-core";

export * from "./auth";
import { user } from "./auth";

export const interviewer = pgTable("interviewer", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  agentId: text("agent_id"),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  audio: text("audio"),
  empathy: integer("empathy").notNull(),
  exploration: integer("exploration").notNull(),
  rapport: integer("rapport").notNull(),
  speed: integer("speed").notNull(),
});

export const interview = pgTable("interview", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  name: text("name"),
  description: text("description"),
  objective: text("objective"),
  userId: text("user_id").references(() => user.id),
  interviewerId: integer("interviewer_id").references(() => interviewer.id),
  isActive: boolean("is_active").default(true),
  isAnonymous: boolean("is_anonymous").default(false),
  isArchived: boolean("is_archived").default(false),
  logoUrl: text("logo_url"),
  themeColor: text("theme_color"),
  readableSlug: text("readable_slug"),
  questions: jsonb("questions"),
  quotes: jsonb("quotes").array(),
  insights: text("insights").array(),
  respondents: text("respondents").array(),
  questionCount: integer("question_count"),
  responseCount: integer("response_count"),
  timeDuration: text("time_duration"),
});

export const response = pgTable("response", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  interviewId: text("interview_id").references(() => interview.id),
  name: text("name"),
  email: text("email"),
  callId: text("call_id"),
  candidateStatus: text("candidate_status"),
  duration: integer("duration"),
  details: jsonb("details"),
  analytics: jsonb("analytics"),
  isAnalysed: boolean("is_analysed").default(false),
  isEnded: boolean("is_ended").default(false),
  isViewed: boolean("is_viewed").default(false),
  tabSwitchCount: integer("tab_switch_count"),
});

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  interviewId: text("interview_id").references(() => interview.id),
  email: text("email"),
  feedbackText: text("feedback"),
  satisfaction: integer("satisfaction"),
});
