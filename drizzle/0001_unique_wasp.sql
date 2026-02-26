CREATE TABLE "session_token" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"interview_id" text,
	"status" text DEFAULT 'unused' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"used_at" timestamp with time zone,
	CONSTRAINT "session_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "session_token" ADD CONSTRAINT "session_token_interview_id_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."interview"("id") ON DELETE no action ON UPDATE no action;