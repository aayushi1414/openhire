import { getAllInterviewers } from "@/services/interviewers.service";
import InterviewersClient from "./InterviewersClient";

export default async function InterviewersPage() {
  const interviewers = await getAllInterviewers();
  return <InterviewersClient interviewers={interviewers as any} />;
}
