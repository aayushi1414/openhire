import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { interviewer } from "@/lib/db/schema";

export const getAllInterviewers = async () => {
  try {
    const data = await db.select().from(interviewer);
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getInterviewer = async (interviewerId: number | bigint) => {
  try {
    const [data] = await db
      .select()
      .from(interviewer)
      .where(eq(interviewer.id, Number(interviewerId)))
      .limit(1);

    return data ?? null;
  } catch (error) {
    console.error("Error fetching interviewer:", error);
    return null;
  }
};
