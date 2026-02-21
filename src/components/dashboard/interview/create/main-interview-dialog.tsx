"use client";

import { useCallback, useState } from "react";
import { CustomSpinner } from "@/components/loaders/custom-spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { InterviewBase, Question } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import BasicInterviewInfo from "./basic-interview-info";
import CreateInterviewQuestions from "./create-interview-questions";

interface MainInterviewDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  interviewers: Interviewer[];
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    objective: string;
    description: string;
    questions: Question[];
    questionCount: number;
    timeDuration: string;
    interviewerId: number;
    isAnonymous: boolean;
  };
}

const createEmptyInterviewData = (): InterviewBase => ({
  userId: "",
  name: "",
  interviewerId: 0,
  objective: "",
  questionCount: 0,
  timeDuration: "",
  isAnonymous: false,
  questions: [],
  description: "",
  responseCount: 0,
});

export default function MainInterviewDialog(props: MainInterviewDialogProps) {
  const { interviewers, mode = "create", initialData, open, setOpen } = props;
  const [loading, setLoading] = useState(false);
  const [proceed, setProceed] = useState(false);

  const getInitialData = useCallback((): InterviewBase => {
    if (mode === "edit" && initialData) {
      return {
        userId: "",
        name: initialData.name,
        interviewerId: Number(initialData.interviewerId),
        objective: initialData.objective,
        questionCount: initialData.questionCount,
        timeDuration: initialData.timeDuration,
        isAnonymous: initialData.isAnonymous,
        questions: initialData.questions,
        description: initialData.description,
        responseCount: 0,
      };
    }
    return createEmptyInterviewData();
  }, [mode, initialData]);

  const [interviewData, setInterviewData] = useState<InterviewBase>(getInitialData());

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Interview" : "Create an Interview"}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <CustomSpinner />
        ) : proceed ? (
          <CreateInterviewQuestions
            interviewData={interviewData}
            setProceed={setProceed}
            setOpen={setOpen}
            mode={mode}
            interviewId={mode === "edit" ? initialData?.id : undefined}
          />
        ) : (
          <BasicInterviewInfo
            setLoading={setLoading}
            setProceed={setProceed}
            interviewData={interviewData}
            setInterviewData={setInterviewData}
            interviewers={interviewers}
            mode={mode}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
