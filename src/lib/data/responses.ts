import "server-only";

import { and, count, desc, eq, ilike, isNull, or } from "drizzle-orm";
import { PAGE_SIZE } from "@/lib/constants";
import { db } from "@/lib/db";
import { response } from "@/lib/db/schema";

export { PAGE_SIZE };

export const getResponsesPaginated = async ({
  interviewId,
  page = 0,
  pageSize = PAGE_SIZE,
  search,
  status,
}: {
  interviewId: string;
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}) => {
  const conditions: ReturnType<typeof eq>[] = [
    eq(response.interviewId, interviewId),
    eq(response.isEnded, true),
  ];
  if (search) conditions.push(ilike(response.name, `%${search}%`) as ReturnType<typeof eq>);
  if (status && status !== "ALL") {
    if (status === "NO_STATUS") {
      conditions.push(
        or(isNull(response.candidateStatus), eq(response.candidateStatus, status)) as ReturnType<
          typeof eq
        >,
      );
    } else {
      conditions.push(eq(response.candidateStatus, status));
    }
  }
  const where = and(...conditions);
  const [data, countResult] = await Promise.all([
    db
      .select()
      .from(response)
      .where(where)
      .orderBy(desc(response.createdAt))
      .limit(pageSize)
      .offset(page * pageSize),
    db.select({ count: count() }).from(response).where(where),
  ]);
  return { data: data ?? [], total: Number(countResult[0]?.count ?? 0) };
};

export const getResponsesForStats = async (interviewId: string) => {
  return db
    .select({
      duration: response.duration,
      candidateStatus: response.candidateStatus,
      details: response.details,
    })
    .from(response)
    .where(and(eq(response.interviewId, interviewId), eq(response.isEnded, true)));
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
    return null;
  }
};
