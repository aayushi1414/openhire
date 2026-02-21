import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { response } from "@/lib/db/schema";

export const getAllResponses = async (interviewId: string) => {
  try {
    const data = await db
      .select()
      .from(response)
      .where(and(eq(response.interviewId, interviewId), eq(response.isEnded, true)))
      .orderBy(desc(response.createdAt));

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllEmails = async (interviewId: string) => {
  try {
    const data = await db
      .select({ email: response.email })
      .from(response)
      .where(eq(response.interviewId, interviewId));

    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getResponseByCallId = async (id: string) => {
  try {
    const data = await db.select().from(response).where(eq(response.callId, id));
    return data ? data[0] : null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
