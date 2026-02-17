import { auth } from "@/lib/auth";
import { getAllInterviews } from "@/services/interviews.service";
import { headers } from "next/headers";
import InterviewsClient from "./InterviewsClient";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  const [interviews] = await Promise.all([getAllInterviews(userId ?? "")]);

  return <InterviewsClient interviews={interviews as any} currentPlan={"free"} />;
}
