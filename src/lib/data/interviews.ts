import "server-only";

import { desc, eq, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { interview, interviewer, response } from "@/lib/db/schema";

type InterviewWithDetails = {
  id: string;
  name: string | null;
  readableSlug: string | null;
  interviewerImage: string | null;
  responseCount: number | null;
  isActive: boolean | null;
};

export const getInterviewsWithDetails = async (userId: string): Promise<InterviewWithDetails[]> => {
  try {
    const responseCountSubquery = db
      .select({
        interviewId: response.interviewId,
        count: sql<number>`count(${response.id})::int`.as("count"),
      })
      .from(response)
      .where(eq(response.isEnded, true))
      .groupBy(response.interviewId)
      .as("rcs");

    const data = await db
      .select({
        id: interview.id,
        name: interview.name,
        readableSlug: interview.readableSlug,
        interviewerImage: interviewer.image,
        responseCount: responseCountSubquery.count,
        isActive: interview.isActive,
      })
      .from(interview)
      .leftJoin(interviewer, eq(interview.interviewerId, interviewer.id))
      .leftJoin(responseCountSubquery, eq(interview.id, responseCountSubquery.interviewId))
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
    return null;
  }
};
