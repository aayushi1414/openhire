"use client";

import CallInfo from "@/components/call/reviewer/call-info";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Analytics, CallData, FeedbackData, InterviewDetailTableResponse } from "@/types/response";

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

export default function CandidateResponseDialog({
  open,
  onClose,
  isLoading,
  callId,
  callData,
  analytics,
  responseData,
  interviewId,
  feedbackData,
}: CandidateResponseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-full sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Candidate Response</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <LoaderWithText />
          </div>
        ) : (
          <CallInfo
            call_id={callId}
            callData={callData}
            analytics={analytics}
            name={responseData?.name ?? ""}
            email={responseData?.email ?? ""}
            candidateStatus={responseData?.candidateStatus ?? ""}
            interviewId={interviewId}
            tabSwitchCount={responseData?.tabSwitchCount ?? 0}
            onClose={onClose}
            feedbackData={feedbackData}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
