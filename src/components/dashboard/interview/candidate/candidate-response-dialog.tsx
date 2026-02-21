"use client";

import CallInfo from "@/components/call/callInfo";
import LoaderWithText from "@/components/loaders/loader-with-text/loaderWithText";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Analytics, CallData, InterviewDetailTableResponse } from "@/types/response";

interface CandidateResponseDialogProps {
  open: boolean;
  onClose: () => void;
  isLoading: boolean;
  callId: string;
  callData: CallData | null;
  analytics: Analytics | null;
  responseData: InterviewDetailTableResponse | null;
  interviewId: string;
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
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
