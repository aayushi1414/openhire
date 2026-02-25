"use client";

import { DownloadIcon } from "lucide-react";
import { marked } from "marked";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteResponse } from "@/actions/responses";
import QuestionAnswerCard from "@/components/dashboard/interview/candidate/question-answer-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Analytics, CallData, FeedbackData } from "@/types/response";
import { Badge } from "../ui/badge";
import { CandidateStatusDropdown } from "./reviewer/candidate-status-dropdown";
import { DeleteResponseDialog } from "./reviewer/delete-response-dialog";

interface CircularProgressProps {
  value?: number;
  maxValue?: number;
  minValue?: number;
  showValueLabel?: boolean;
  valueLabel?: ReactNode;
  classNames?: Record<string, string>;
}

function CircularProgress({
  value = 0,
  maxValue = 100,
  minValue = 0,
  showValueLabel,
  valueLabel,
}: CircularProgressProps) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const pct = ((value - minValue) / (maxValue - minValue)) * 100;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <div className="relative flex h-28 w-28 items-center justify-center text-primary">
      <svg className="h-28 w-28 -rotate-90" viewBox="0 0 100 100" fill="none">
        <title>Progress Circle</title>
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          className="opacity-10"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      {showValueLabel && (
        <span className="absolute font-semibold text-3xl text-primary">
          {valueLabel ?? `${Math.round(pct)}%`}
        </span>
      )}
    </div>
  );
}

interface CallProps {
  call_id: string;
  callData: CallData | null;
  analytics: Analytics | null;
  name: string;
  email: string;
  candidateStatus: string;
  interviewId: string;
  tabSwitchCount?: number;
  onClose?: () => void;
  feedbackData?: FeedbackData | null;
}

function CallInfo(props: CallProps) {
  const {
    call_id,
    callData,
    analytics,
    name,
    email,
    candidateStatus: initialCandidateStatus,
    interviewId,
    tabSwitchCount,
    onClose,
    feedbackData,
  } = props;

  console.log(feedbackData);

  const [isDeleting, startDeleteTransition] = useTransition();
  const router = useRouter();
  const [transcriptHtml, setTranscriptHtml] = useState("");

  useEffect(() => {
    async function processTranscript() {
      if (!(callData?.transcript && name)) {
        return;
      }

      const replaceAgentAndUser = (raw: string, candidateName: string): string => {
        const agentReplacement = "**AI interviewer:**";
        const userReplacement = `**${candidateName}:**`;

        let updated = raw.replace(/Agent:/g, agentReplacement).replace(/User:/g, userReplacement);

        updated = updated.replace(/(?:\r\n|\r|\n)/g, "\n\n");

        return updated;
      };

      const processed = replaceAgentAndUser(callData.transcript as string, name);
      const rawHtml = await marked.parse(processed);
      const DOMPurify = (await import("dompurify")).default;
      setTranscriptHtml(DOMPurify.sanitize(rawHtml));
    }

    processTranscript();
  }, [callData, name]);

  const onDeleteResponseClick = () => {
    startDeleteTransition(async () => {
      try {
        await deleteResponse(call_id);
        if (onClose) {
          onClose();
          router.refresh();
        } else {
          router.push(`/interviews/${interviewId}`);
          router.refresh();
        }
        toast.success("Response deleted successfully.", {
          position: "bottom-right",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error deleting response:", error);
        toast.error("Failed to delete the response.", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="min-h-30 rounded-xl bg-muted p-4">
        <div className="flex w-full flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Avatar>
                <AvatarFallback className="bg-primary text-background">
                  {name ? name[0].toUpperCase() : "A"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {name && <p className="px-2 font-semibold text-sm">{name}</p>}
                {email && <p className="px-2 text-sm">{email}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-end">
                {tabSwitchCount && tabSwitchCount > 0 && (
                  <Badge
                    variant="outline"
                    className="rounded-md border-orange-300 bg-orange-50 py-2.5 text-orange-600"
                  >
                    Tab Switching Detected
                  </Badge>
                )}
              </div>

              {/*Status  */}
              <CandidateStatusDropdown call_id={call_id} initialStatus={initialCandidateStatus} />

              {/* Delete Response */}
              <DeleteResponseDialog isDeleting={isDeleting} onConfirm={onDeleteResponseClick} />
            </div>
          </div>
          <div className="mt-3 flex flex-col">
            <p className="font-semibold">Interview Recording</p>
            <div className="flex items-center gap-3">
              {callData?.recording_url ? (
                <>
                  {/* biome-ignore lint/a11y/useMediaCaption: recording playback — no captions available */}
                  <audio src={callData.recording_url} controls className="flex-1" />
                  <Button variant="ghost" size="icon" asChild>
                    <a href={callData.recording_url} download aria-label="Download recording">
                      <DownloadIcon size={20} />
                    </a>
                  </Button>
                </>
              ) : (
                <p className="text-muted-foreground text-sm">No recording available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 min-h-30 rounded-xl bg-muted p-4 px-5">
        <p className="my-2 font-semibold">General Summary</p>

        <div className="my-2 mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {analytics?.overallScore !== undefined && (
            <div className="flex flex-col gap-3 rounded-lg bg-card p-4 text-sm">
              <div className="flex flex-row gap-2 align-middle">
                <CircularProgress value={analytics?.overallScore} showValueLabel={true} />
                <p className="my-auto font-medium text-xl">Overall Hiring Score</p>
              </div>
              <div className="">
                <div className="font-medium">
                  <span className="font-normal">Feedback: </span>
                  {analytics?.overallFeedback === undefined ? (
                    <Skeleton className="h-5 w-50" />
                  ) : (
                    analytics?.overallFeedback
                  )}
                </div>
              </div>
            </div>
          )}
          {analytics?.communication && (
            <div className="flex flex-col gap-3 rounded-lg bg-card p-4 text-sm">
              <div className="flex flex-row gap-2 align-middle">
                <CircularProgress
                  value={analytics?.communication.score}
                  maxValue={10}
                  minValue={0}
                  showValueLabel={true}
                  valueLabel={
                    <div className="flex items-baseline">
                      {analytics?.communication.score ?? 0}
                      <span className="ml-0.5 text-xl">/10</span>
                    </div>
                  }
                />
                <p className="my-auto font-medium text-xl">Communication</p>
              </div>
              <div className="font-medium">
                <span className="font-normal">Feedback: </span>
                {analytics?.communication.feedback === undefined ? (
                  <Skeleton className="h-5 w-50" />
                ) : (
                  analytics?.communication.feedback
                )}
              </div>
            </div>
          )}
          {callData?.call_analysis && (
            <div className="flex flex-col gap-3 rounded-lg bg-card p-4 text-sm">
              <div className="flex flex-row gap-2 align-middle">
                <p className="my-auto">User Sentiment: </p>
                <p className="my-auto font-medium">
                  {callData?.call_analysis?.user_sentiment === undefined ? (
                    <Skeleton className="h-5 w-50" />
                  ) : (
                    callData?.call_analysis?.user_sentiment
                  )}
                </p>

                <div
                  className={`${
                    callData?.call_analysis?.user_sentiment === "Neutral"
                      ? "text-yellow-500"
                      : callData?.call_analysis?.user_sentiment === "Negative"
                        ? "text-red-500"
                        : callData?.call_analysis?.user_sentiment === "Positive"
                          ? "text-green-500"
                          : "text-transparent"
                  } text-xl`}
                >
                  ●
                </div>
              </div>
              <div className="">
                <div className="font-medium">
                  <span className="font-normal">Call Summary: </span>
                  {callData?.call_analysis?.call_summary === undefined ? (
                    <Skeleton className="h-5 w-50" />
                  ) : (
                    callData?.call_analysis?.call_summary
                  )}
                </div>
              </div>
              <p className="font-medium">
                {callData?.call_analysis?.call_completion_rating_reason}
              </p>
            </div>
          )}
        </div>
      </div>

      {analytics?.questionSummaries && analytics.questionSummaries.length > 0 && (
        <div className="my-3 min-h-30 rounded-xl bg-muted p-4 px-5">
          <p className="my-2 mb-4 font-semibold">Question Summary</p>
          <ScrollArea className="scrollbar-thin mt-3 h-72 overflow-y-scroll whitespace-pre-line rounded-md px-2 py-3 text-sm leading-6">
            {analytics?.questionSummaries.map((qs, index) => (
              <QuestionAnswerCard
                key={qs.question}
                questionNumber={index + 1}
                question={qs.question}
                answer={qs.summary}
              />
            ))}
          </ScrollArea>
        </div>
      )}
      <div className="max-h-125 min-h-37.5 rounded-xl bg-muted p-4 px-5">
        <p className="my-2 mb-4 font-semibold">Transcript</p>
        <ScrollArea className="scrollbar-thin h-96 overflow-y-auto whitespace-pre-line rounded-lg px-2 text-sm">
          <div
            className="rounded-lg bg-card p-4 text-sm leading-5"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: transcript is sanitized with DOMPurify before rendering
            dangerouslySetInnerHTML={{ __html: transcriptHtml }}
          />
        </ScrollArea>
      </div>

      {feedbackData && (feedbackData.satisfaction !== null || feedbackData.feedback) && (
        <div className="my-3 min-h-30 rounded-xl bg-muted p-4 px-5">
          <p className="my-2 font-semibold">Candidate Feedback</p>
          <div className="flex flex-col gap-2 rounded-lg bg-card p-4 text-sm">
            {feedbackData.satisfaction !== null && (
              <p className="font-semibold">
                Satisfaction:{" "}
                <span className="font-normal">
                  {feedbackData.satisfaction === 0
                    ? "😀 Positive"
                    : feedbackData.satisfaction === 1
                      ? "😐 Moderate"
                      : "😔 Negative"}
                </span>
              </p>
            )}
            {feedbackData.feedback && (
              <p className="font-semibold">
                Comment: {""}
                <span className="font-normal">{feedbackData.feedback}</span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CallInfo;
