"use server";

import { db } from "@/lib/db";
import { interviewer } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export const getAllInterviewers = async (clientId = "") => {
  try {
    const data = await db.select().from(interviewer);
    return data || [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createInterviewer = async (payload: any) => {
  try {
    // Check for existing interviewer with the same name AND agent_id
    const existing = await db
      .select()
      .from(interviewer)
      .where(and(eq(interviewer.name, payload.name), eq(interviewer.agentId, payload.agentId)))
      .limit(1);

    if (existing.length > 0) {
      console.error("An interviewer with this name already exists");
      return null;
    }

    const [created] = await db.insert(interviewer).values(payload).returning();
    return created ?? null;
  } catch (error) {
    console.error("Error creating interviewer:", error);
    return null;
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

