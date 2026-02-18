"use client";

import CreateInterviewerButton from "@/components/dashboard/interviewer/createInterviewerButton";
import InterviewerCard from "@/components/dashboard/interviewer/interviewerCard";
import type { Interviewer } from "@/types/interviewer";

type InterviewersClientProps = {
  interviewers: Interviewer[];
};

export default function InterviewersClient({ interviewers }: InterviewersClientProps) {
  return (
    <div className="flex flex-col items-left">
      <div className="flex flex-row">
        <div>
          <h2 className="mr-2 text-2xl font-semibold tracking-tight">Interviewers</h2>
          <h3 className=" text-sm tracking-tight text-gray-600 font-medium ">
            Get to know them by clicking the profile.
          </h3>
        </div>
      </div>
      <div className="relative flex items-center mt-6">
        {interviewers.length === 0 ? (
          <CreateInterviewerButton />
        ) : (
          interviewers.map((interviewer) => (
            <InterviewerCard key={interviewer.id} interviewer={interviewer} />
          ))
        )}
      </div>
    </div>
  );
}
