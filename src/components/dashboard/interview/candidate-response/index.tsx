"use client";

import { marked } from "marked";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteResponse } from "@/actions/responses";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type {
  Analytics,
  CallData,
  FeedbackData,
  InterviewDetailTableResponse,
} from "@/types/response";
import { CandidateFeedback } from "./candidate-feedback";
import { CandidateHeader } from "./candidate-header";
import { GeneralSummary } from "./general-summary";
import { QuestionSummary } from "./question-summary";
import { TranscriptView } from "./transcript-view";

interface CandidateResponseDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  callId: string;
  callData: CallData | null;
  analytics: Analytics | null;
  responseData: InterviewDetailTableResponse | null;
  interviewId: string;
  feedbackData: FeedbackData | null;
}

export default function CandidateResponseDialog(props: CandidateResponseDialogProps) {
  const { open, onClose, isLoading, callId, callData, analytics, responseData, feedbackData } =
    props;

  const [isDeleting, startDeleteTransition] = useTransition();
  const router = useRouter();
  const [transcriptHtml, setTranscriptHtml] = useState("");

  useEffect(() => {
    async function processTranscript() {
      if (!(callData?.transcript && responseData?.name)) {
        return;
      }

      const replaceAgentAndUser = (raw: string, candidateName: string): string => {
        const agentReplacement = "**AI interviewer:**";
        const userReplacement = `**${candidateName}:**`;

        let updated = raw.replace(/Agent:/g, agentReplacement).replace(/User:/g, userReplacement);

        updated = updated.replace(/(?:\r\n|\r|\n)/g, "\n\n");

        return updated;
      };

      const processed = replaceAgentAndUser(callData.transcript as string, responseData.name);
      const rawHtml = await marked.parse(processed);
      const DOMPurify = (await import("dompurify")).default;
      setTranscriptHtml(DOMPurify.sanitize(rawHtml));
    }

    processTranscript();
  }, [callData, responseData?.name]);

  const onDeleteResponseClick = () => {
    startDeleteTransition(async () => {
      try {
        await deleteResponse(callId);
        onClose();
        router.refresh();
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
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Candidate Response</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoaderWithText />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            <CandidateHeader
              call_id={callId}
              name={responseData?.name ?? ""}
              email={responseData?.email ?? ""}
              candidateStatus={responseData?.candidateStatus ?? ""}
              recordingUrl={callData?.recording_url}
              tabSwitchCount={responseData?.tabSwitchCount ?? 0}
              isDeleting={isDeleting}
              onDeleteClick={onDeleteResponseClick}
            />
            <GeneralSummary analytics={analytics} callData={callData} />
            {analytics?.questionSummaries && (
              <QuestionSummary questionSummaries={analytics.questionSummaries} />
            )}
            <TranscriptView transcriptHtml={transcriptHtml} />
            {feedbackData && <CandidateFeedback feedbackData={feedbackData} />}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
