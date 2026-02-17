"use server";

import { generateInterviewAnalytics } from "@/services/analytics.service";
import { getInterviewer } from "@/services/interviewers.service";
import { getResponseByCallId, saveResponse } from "@/services/responses.service";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export const registerCall = async (
  interviewerId: number,
  dynamicData: Record<string, any>,
) => {
  if (!process.env.RETELL_API_KEY) {
    console.error("Missing required environment variable: RETELL_API_KEY");
    return { success: false as const, error: "Retell API key is not configured" };
  }

  try {
    const interviewer = await getInterviewer(interviewerId);

    if (!interviewer?.agentId) {
      return { success: false as const, error: "Interviewer or agent not found" };
    }

    const registerCallResponse = await retellClient.call.createWebCall({
      agent_id: interviewer.agentId,
      retell_llm_dynamic_variables: dynamicData,
    });

    return { success: true as const, data: registerCallResponse };
  } catch (error) {
    console.error("Error registering call:", error);
    return { success: false as const, error: "Failed to register call" };
  }
};

export const analyzeCall = async (callId: string) => {
  if (!process.env.RETELL_API_KEY) {
    console.error("Missing required environment variable: RETELL_API_KEY");
    return { success: false as const, error: "Retell API key is not configured" };
  }

  try {
    const callDetails = await getResponseByCallId(callId);

    if (!callDetails) {
      return { success: false as const, error: "Call not found" };
    }

    let callResponse = callDetails.details;

    if (callDetails.isAnalysed) {
      return {
        success: true as const,
        data: { callResponse, analytics: callDetails.analytics },
      };
    }

    const callOutput = await retellClient.call.retrieve(callId);
    const interviewId = callDetails?.interviewId;
    callResponse = callOutput;

    const duration = Math.round(
      callResponse.end_timestamp / 1000 - callResponse.start_timestamp / 1000,
    );

    const payload = {
      callId: callId,
      interviewId: interviewId,
      transcript: callResponse.transcript,
    };

    const result = await generateInterviewAnalytics(payload);
    const analytics = result.analytics;

    await saveResponse(
      {
        details: callResponse,
        isAnalysed: true,
        duration: duration,
        analytics: analytics,
      },
      callId,
    );

    return { success: true as const, data: { callResponse, analytics } };
  } catch (error) {
    console.error("Error analyzing call:", error);
    return { success: false as const, error: "Failed to analyze call" };
  }
};
