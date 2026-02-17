"use server";

import { db } from "@/lib/db";
import { response } from "@/lib/db/schema";
import { and, desc, eq } from "drizzle-orm";

export const createResponse = async (payload: any) => {
  try {
    const [created] = await db.insert(response).values(payload).returning({ id: response.id });
    return created?.id ?? null;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const saveResponse = async (payload: any, call_id: string) => {
  try {
    const updated = await db
      .update(response)
      .set(payload)
      .where(eq(response.callId, call_id))
      .returning();
    return updated;
  } catch (error) {
    console.log(error);
    return [];
  }
};

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
    return [];
  }
};

export const deleteResponse = async (id: string) => {
  try {
    const deleted = await db.delete(response).where(eq(response.callId, id)).returning();
    return deleted;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const updateResponse = async (payload: any, call_id: string) => {
  try {
    const updated = await db
      .update(response)
      .set(payload)
      .where(eq(response.callId, call_id))
      .returning();
    return updated;
  } catch (error) {
    console.log(error);
    return [];
  }
};
