"use server";

import type { FeedbackData } from "@/types/response";
import { db } from "@/lib/db";
import { feedback } from "@/lib/db/schema";

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
