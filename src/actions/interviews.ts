"use server";

import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { interview } from "@/lib/db/schema";
import type { Question } from "@/types/interview";

interface CreateInterviewPayload {
  name: string;
  description: string;
  objective: string;
  interviewerId: string | null;
  isAnonymous: boolean;
  logoUrl: string;
  questions: Question[];
  questionCount: number;
  responseCount: string;
  timeDuration: string;
}

interface UpdateInterviewPayload {
  name?: string;
  objective?: string;
  description?: string;
  questions?: Question[];
  interviewerId?: number;
  questionCount?: number;
  timeDuration?: string | number;
  isAnonymous?: boolean;
  isActive?: boolean;
}

export const createInterview = async (payload: {
  interviewData: CreateInterviewPayload;
  userId?: string;
}) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = payload.userId ?? session?.user.id;

    if (!userId) {
      return { success: false as const, error: "Unauthorized" };
    }

    const url_id = nanoid();
    const { interviewData } = payload;

    await db.insert(interview).values({
      id: url_id,
      readableSlug: null,
      name: interviewData.name,
      description: interviewData.description,
      objective: interviewData.objective,
      userId: userId,
      interviewerId: interviewData.interviewerId ? Number(interviewData.interviewerId) : null,
      isAnonymous: interviewData.isAnonymous,
      logoUrl: interviewData.logoUrl,
      questions: interviewData.questions,
      questionCount: interviewData.questionCount,
      responseCount: interviewData.responseCount ? Number(interviewData.responseCount) : null,
      timeDuration: interviewData.timeDuration,
    });

    revalidatePath("/");
    return { success: true as const };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false as const, error: "Failed to create interview" };
  }
};

export const updateInterview = async (id: string, payload: UpdateInterviewPayload) => {
  try {
    const [updated] = await db
      .update(interview)
      .set(payload)
      .where(eq(interview.id, id))
      .returning();
    revalidatePath("/");
    return { success: true as const, data: updated ?? null };
  } catch (error) {
    console.log(error);
    return { success: false as const, error: "Failed to update interview" };
  }
};

export const deleteInterview = async (id: string) => {
  try {
    await db.delete(interview).where(eq(interview.id, id)).returning();
    return { success: true as const };
  } catch (error) {
    console.log(error);
    return { success: false as const, error: "Failed to delete interview" };
  }
};
