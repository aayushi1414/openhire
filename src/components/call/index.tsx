"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { registerCall } from "@/actions/call";
import { submitFeedback } from "@/actions/feedback";
import { getInterviewerAction } from "@/actions/interviewers";
import { createResponse, getAllEmailsAction, updateResponse } from "@/actions/responses";
import { useCallTimer } from "@/hooks/use-call-timer";
import { useRetellClient } from "@/hooks/use-retell-client";
import type { Interview } from "@/types/interview";
import type { FeedbackData } from "@/types/response";
import { ActiveCallScreen } from "./active-call-screen";
import { EndedScreen } from "./ended-screen";
import { IneligibleScreen } from "./ineligible-screen";
import { PreCallScreen } from "./pre-call-screen";
import { TabSwitchWarning, useTabSwitchPrevention } from "./tabSwitchPrevention";

interface InterviewProps {
  interview: Interview;
}

export default function Call({ interview }: InterviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isIneligible, setIsIneligible] = useState(false);
  const [callId, setCallId] = useState("");
  const [email, setEmail] = useState("");
  const [interviewerImg, setInterviewerImg] = useState("");
  const [interviewTimeDuration, setInterviewTimeDuration] = useState("1");
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userName, setUserName] = useState("");

  const { tabSwitchCount } = useTabSwitchPrevention();

  const handleCallEnded = () => {
    setIsCalling(false);
    setIsEnded(true);
  };

  const { lastInterviewerResponse, lastUserResponse, activeTurn, startCall, stopCall } =
    useRetellClient(handleCallEnded);

  const handleTimeUp = () => {
    stopCall();
    setIsEnded(true);
  };

  const { elapsedSeconds, progressPercent } = useCallTimer(
    interviewTimeDuration,
    isCalling,
    handleTimeUp,
  );
  const remainingSeconds = Math.max(0, Number(interviewTimeDuration) * 60 - elapsedSeconds);

  useEffect(() => {
    if (interview?.timeDuration) {
      setInterviewTimeDuration(interview.timeDuration);
    }
  }, [interview]);

  useEffect(() => {
    const fetchInterviewer = async () => {
      const data = await getInterviewerAction(Number(interview.interviewerId));
      if (data?.image) setInterviewerImg(data.image);
    };
    fetchInterviewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.interviewerId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when isEnded changes
  useEffect(() => {
    if (isEnded) {
      const updateInterview = async () => {
        await updateResponse({ isEnded: true, tabSwitchCount }, callId);
      };
      updateInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded]);

  const startConversation = async (candidateEmail: string, name: string) => {
    setIsLoading(true);

    const data = {
      mins: interview?.timeDuration,
      objective: interview?.objective,
      questions: interview?.questions.map((q) => q.question).join(", "),
      name: name || "not provided",
    };

    const emailsList = await getAllEmailsAction(interview.id);
    const existingEmails: string[] = emailsList.map((item: { email: string }) => item.email);
    const ineligible =
      existingEmails.includes(candidateEmail) ||
      (interview?.respondents && !interview?.respondents.includes(candidateEmail));

    if (ineligible) {
      setIsIneligible(true);
    } else {
      const result = await registerCall(Number(interview?.interviewerId), data);

      if (!result.success) {
        console.error("Failed to register call:", result.error);
        setIsLoading(false);
        return;
      }

      const { call_id, access_token } = result.data;

      if (access_token) {
        await startCall(access_token);
        setUserName(name);
        setIsCalling(true);
        setIsStarted(true);
        setCallId(call_id);
        setEmail(candidateEmail);

        await createResponse({
          interviewId: interview.id,
          callId: call_id,
          email: candidateEmail,
          name,
        });
      } else {
        console.log("Failed to register call");
      }
    }

    setIsLoading(false);
  };

  const onEndCallClick = async () => {
    if (isStarted) {
      setIsLoading(true);
      stopCall();
      setIsEnded(true);
      setIsLoading(false);
    } else {
      setIsEnded(true);
    }
  };

  const handleFeedbackSubmit = async (formData: Omit<FeedbackData, "interview_id">) => {
    try {
      await submitFeedback({ ...formData, interview_id: interview.id });
      toast.success("Thank you for your feedback!");
      setIsFeedbackSubmitted(true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {isStarted && !isEnded && <TabSwitchWarning />}

      {!isStarted && !isEnded && !isIneligible && (
        <PreCallScreen
          interview={interview}
          isLoading={isLoading}
          interviewTimeDuration={interviewTimeDuration}
          interviewerImg={interviewerImg}
          onStart={startConversation}
          onExit={onEndCallClick}
        />
      )}

      {isStarted && !isEnded && !isIneligible && (
        <ActiveCallScreen
          interview={interview}
          isLoading={isLoading}
          interviewerImg={interviewerImg}
          lastInterviewerResponse={lastInterviewerResponse}
          lastUserResponse={lastUserResponse}
          activeTurn={activeTurn}
          progressPercent={progressPercent}
          remainingSeconds={remainingSeconds}
          userName={userName}
          onEndInterview={onEndCallClick}
        />
      )}

      {isEnded && !isIneligible && (
        <EndedScreen
          isStarted={isStarted}
          email={email}
          isFeedbackSubmitted={isFeedbackSubmitted}
          isDialogOpen={isDialogOpen}
          onDialogOpenChange={setIsDialogOpen}
          onFeedbackSubmit={handleFeedbackSubmit}
        />
      )}

      {isIneligible && <IneligibleScreen />}
    </div>
  );
}
