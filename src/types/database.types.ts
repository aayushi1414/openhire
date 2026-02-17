import type { feedback, interview, interviewer, response, user } from "@/lib/db/schema";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

export type UserRow = InferSelectModel<typeof user>;
export type InterviewerRow = InferSelectModel<typeof interviewer>;
export type InterviewRow = InferSelectModel<typeof interview>;
export type ResponseRow = InferSelectModel<typeof response>;
export type FeedbackRow = InferSelectModel<typeof feedback>;

export type NewUser = InferInsertModel<typeof user>;
export type NewInterviewer = InferInsertModel<typeof interviewer>;
export type NewInterview = InferInsertModel<typeof interview>;
export type NewResponse = InferInsertModel<typeof response>;
export type NewFeedback = InferInsertModel<typeof feedback>;
