"use server";

import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";
import type { FeedbackData } from "@/types/response";

export const submitFeedback = async (feedbackData: FeedbackData) => {
  const [created] = await db
    .insert(feedback)
    .values({
      interviewId: feedbackData.interview_id,
      satisfaction: feedbackData.satisfaction,
      feedbackText: feedbackData.feedback,
      email: feedbackData.email,
    })
    .returning();

  if (!created) {
    throw new Error("Failed to submit feedback");
  }

  return created;
};

export const getFeedbackByInterviewIdAndEmail = async (
  interviewId: string,
  email: string,
): Promise<FeedbackData | null> => {
  const [row] = await db
    .select()
    .from(feedback)
    .where(
      and(
        eq(feedback.interviewId, interviewId),
        eq(feedback.email, email),
      ),
    )
    .limit(1);

  if (!row) return null;

  return {
    interview_id: row.interviewId ?? "",
    satisfaction: row.satisfaction,
    feedback: row.feedbackText,
    email: row.email,
  };
};
