import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import type {
  user,
  interviewer,
  interview,
  response,
  feedback,
} from "@/lib/db/schema";

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
