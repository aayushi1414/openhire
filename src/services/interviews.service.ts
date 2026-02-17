"use server";

import { db } from "@/lib/db";
import { interview } from "@/lib/db/schema";
import { desc, eq, or } from "drizzle-orm";

export const getAllInterviews = async (userId: string) => {
  try {
    const data = await db
      .select()
      .from(interview)
      .where(eq(interview.userId, userId))
      .orderBy(desc(interview.createdAt));

    return data ?? [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getInterviewById = async (id: string) => {
  try {
    const data = await db
      .select()
      .from(interview)
      .where(or(eq(interview.id, id), eq(interview.readableSlug, id)));

    return data ? data[0] : null;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateInterview = async (payload: any, id: string) => {
  try {
    const [updated] = await db
      .update(interview)
      .set(payload)
      .where(eq(interview.id, id))
      .returning();
    return updated ?? null;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const deleteInterview = async (id: string) => {
  try {
    const deleted = await db.delete(interview).where(eq(interview.id, id)).returning();
    return deleted;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllRespondents = async (interviewId: string) => {
  try {
    const data = await db
      .select({ respondents: interview.respondents })
      .from(interview)
      .where(eq(interview.id, interviewId));

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createInterview = async (payload: any) => {
  try {
    const [created] = await db.insert(interview).values(payload).returning();
    return created ?? null;
  } catch (error) {
    console.log(error);
    return [];
  }
};
