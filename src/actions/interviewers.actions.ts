"use server";

import { INTERVIEWERS, RETELL_AGENT_GENERAL_PROMPT } from "@/lib/constants";
import { createInterviewer } from "@/services/interviewers.service";
import Retell from "retell-sdk";

const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || "",
});

export const createDefaultInterviewers = async () => {
  try {
    const newModel = await retellClient.llm.create({
      model: "gpt-4o",
      general_prompt: RETELL_AGENT_GENERAL_PROMPT,
      general_tools: [
        {
          type: "end_call",
          name: "end_call_1",
          description:
            "End the call if the user uses goodbye phrases such as 'bye,' 'goodbye,' or 'have a nice day.' ",
        },
      ],
    });

    const newFirstAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Chloe",
      agent_name: "Lisa",
    });

    const lisa = await createInterviewer({
      agentId: newFirstAgent.agent_id,
      ...INTERVIEWERS.LISA,
    });

    const newSecondAgent = await retellClient.agent.create({
      response_engine: { llm_id: newModel.llm_id, type: "retell-llm" },
      voice_id: "11labs-Brian",
      agent_name: "Bob",
    });

    const bob = await createInterviewer({
      agentId: newSecondAgent.agent_id,
      ...INTERVIEWERS.BOB,
    });

    return { success: true as const, data: { lisa, bob } };
  } catch (error) {
    console.error("Error creating default interviewers:", error);
    return { success: false as const, error: "Failed to create interviewers" };
  }
};
