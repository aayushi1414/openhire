"use server";

import { and, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { sessionToken } from "@/lib/db/schema";

export const generateSessionToken = async (interviewId: string): Promise<{ token: string }> => {
  const token = nanoid();
  await db.insert(sessionToken).values({ token, interviewId, status: "unused" });
  return { token };
};

export const validateSessionToken = async (
  token: string,
  interviewId: string,
): Promise<"unused" | "used" | "invalid"> => {
  const [row] = await db
    .select({ status: sessionToken.status })
    .from(sessionToken)
    .where(and(eq(sessionToken.token, token), eq(sessionToken.interviewId, interviewId)));

  if (!row) return "invalid";
  return row.status as "unused" | "used";
};

export const consumeSessionToken = async (token: string): Promise<boolean> => {
  const result = await db
    .update(sessionToken)
    .set({ status: "used", usedAt: sql`now()` })
    .where(and(eq(sessionToken.token, token), eq(sessionToken.status, "unused")))
    .returning({ id: sessionToken.id });

  return result.length > 0;
};
