CREATE TYPE "public"."plan" AS ENUM('free', 'pro', 'free_trial_over');--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"interview_id" text,
	"email" text,
	"feedback" text,
	"satisfaction" integer
);
--> statement-breakpoint
CREATE TABLE "interview" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"name" text,
	"description" text,
	"objective" text,
	"user_id" text,
	"interviewer_id" integer,
	"is_active" boolean DEFAULT true,
	"is_anonymous" boolean DEFAULT false,
	"is_archived" boolean DEFAULT false,
	"logo_url" text,
	"theme_color" text,
	"readable_slug" text,
	"questions" jsonb,
	"quotes" jsonb[],
	"insights" text[],
	"respondents" text[],
	"question_count" integer,
	"response_count" integer,
	"time_duration" text
);
--> statement-breakpoint
CREATE TABLE "interviewer" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"agent_id" text,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"audio" text,
	"empathy" integer NOT NULL,
	"exploration" integer NOT NULL,
	"rapport" integer NOT NULL,
	"speed" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "response" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"interview_id" text,
	"name" text,
	"email" text,
	"call_id" text,
	"candidate_status" text,
	"duration" integer,
	"details" jsonb,
	"analytics" jsonb,
	"is_analysed" boolean DEFAULT false,
	"is_ended" boolean DEFAULT false,
	"is_viewed" boolean DEFAULT false,
	"tab_switch_count" integer
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_interview_id_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interview"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interview" ADD CONSTRAINT "interview_interviewer_id_interviewer_id_fk" FOREIGN KEY ("interviewer_id") REFERENCES "public"."interviewer"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "response" ADD CONSTRAINT "response_interview_id_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interview"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");