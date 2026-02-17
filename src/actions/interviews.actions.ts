"use server";

import {
  createInterview as createInterviewService,
  deleteInterview as deleteInterviewService,
  updateInterview as updateInterviewService,
} from "@/services/interviews.service";
import { nanoid } from "nanoid";

export const createInterview = async (payload: {
  interviewData: any;
}) => {
  try {
    const url_id = nanoid();
    const { interviewData } = payload;

    await createInterviewService({
      id: url_id,
      readableSlug: null,
      name: interviewData.name,
      description: interviewData.description,
      objective: interviewData.objective,
      userId: interviewData.userId,
      interviewerId: interviewData.interviewerId ? Number(interviewData.interviewerId) : null,
      isAnonymous: interviewData.isAnonymous,
      logoUrl: interviewData.logoUrl,
      questions: interviewData.questions,
      questionCount: interviewData.questionCount,
      responseCount: interviewData.responseCount ? Number(interviewData.responseCount) : null,
      timeDuration: interviewData.timeDuration,
    });

    return { success: true as const };
  } catch (error) {
    console.error("Error creating interview:", error);
    return { success: false as const, error: "Failed to create interview" };
  }
};

export const updateInterview = async (payload: any, id: string) => {
  try {
    await updateInterviewService(payload, id);
    return { success: true as const };
  } catch (error) {
    console.error("Error updating interview:", error);
    return { success: false as const, error: "Failed to update interview" };
  }
};

export const deleteInterview = async (id: string) => {
  try {
    await deleteInterviewService(id);
    return { success: true as const };
  } catch (error) {
    console.error("Error deleting interview:", error);
    return { success: false as const, error: "Failed to delete interview" };
  }
};
