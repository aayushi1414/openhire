"use server";

import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const getClientById = async (id: string, email?: string | null) => {
  try {
    const existing = await db.select().from(user).where(eq(user.id, id)).limit(1);
    return existing[0] ?? null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
