import CreateInterviewCard from "@/components/dashboard/interview/list/create-interview-card";
import InterviewCard from "@/components/dashboard/interview/list/interview-card";
import { auth } from "@/lib/auth";
import { getAllInterviewers } from "@/lib/data/interviewers";
import { getInterviewsWithDetails } from "@/lib/data/interviews";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const [interviews, interviewers] = await Promise.all([
    session?.user.id ? getInterviewsWithDetails(session.user.id) : Promise.resolve([]),
    getAllInterviewers(),
  ]);

  return (
    <div className="flex flex-col">
      <div>
        <h2 className="text-2xl font-semibold">Interviews</h2>
        <h3 className="text-sm text-muted-foreground">{interviews.length} Interviews created</h3>
      </div>

      <div className="relative grid xl:grid-cols-4 md:grid-cols-2 grid-cols-1 items-center mt-5 gap-4 overflow-x-auto">
        <CreateInterviewCard interviewers={interviewers} />

        {interviews.map((item) => (
          <InterviewCard
            id={item.id}
            key={item.id}
            name={item.name}
            readableSlug={item.readableSlug}
            interviewerImage={item.interviewerImage ?? null}
            responseCount={item.responseCount ?? 0}
            isActive={item.isActive ?? true}
          />
        ))}
      </div>
    </div>
  );
}
