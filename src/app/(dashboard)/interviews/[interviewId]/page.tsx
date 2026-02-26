import { notFound } from "next/navigation";
import { createSearchParamsCache, parseAsInteger, parseAsString } from "nuqs/server";
import InterviewDetailClient from "@/components/dashboard/interview/detail/interview-detail-client";
import { getAllInterviewers } from "@/lib/data/interviewers";
import { getInterviewById } from "@/lib/data/interviews";
import { getResponsesForStats, getResponsesPaginated, PAGE_SIZE } from "@/lib/data/responses";
import { CandidateStatus } from "@/lib/enum";
import type { Interview } from "@/types/interview";
import type { InterviewDetailTableResponse, Response } from "@/types/response";

const searchParamsCache = createSearchParamsCache({
  page: parseAsInteger.withDefault(0),
  search: parseAsString.withDefault(""),
  status: parseAsString.withDefault("ALL"),
});

interface Props {
  params: Promise<{
    interviewId: string;
  }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

function computeStats(responses: Pick<Response, "duration" | "candidateStatus" | "details">[]) {
  let totalDuration = 0;
  let completedCount = 0;
  const sentimentCount = { positive: 0, negative: 0, neutral: 0 };
  const candidateStatusCount: Record<string, number> = {
    [CandidateStatus.NO_STATUS]: 0,
    [CandidateStatus.NOT_SELECTED]: 0,
    [CandidateStatus.POTENTIAL]: 0,
    [CandidateStatus.SELECTED]: 0,
  };

  for (const r of responses) {
    const sentiment = r.details?.call_analysis?.user_sentiment;
    if (sentiment === "Positive") sentimentCount.positive += 1;
    else if (sentiment === "Negative") sentimentCount.negative += 1;
    else if (sentiment === "Neutral") sentimentCount.neutral += 1;

    const agentCompletion = r.details?.call_analysis?.agent_task_completion_rating;
    if (agentCompletion === "Complete" || agentCompletion === "Partial") completedCount += 1;

    totalDuration += r.duration || 0;

    const status = r.candidateStatus as CandidateStatus;
    if (Object.values(CandidateStatus).includes(status)) {
      candidateStatusCount[status]++;
    }
  }

  const avgDuration = responses.length > 0 ? totalDuration / responses.length : 0;
  const completionRate = responses.length > 0 ? (completedCount / responses.length) * 100 : 0;

  return { avgDuration, completionRate, sentimentCount, candidateStatusCount };
}

export default async function InterviewPage({ params, searchParams }: Props) {
  const { interviewId } = await params;
  const { page, search, status } = await searchParamsCache.parse(searchParams);

  const [interview, { data: responses, total }, statsData, interviewers] = await Promise.all([
    getInterviewById(interviewId),
    getResponsesPaginated({ interviewId, page, pageSize: PAGE_SIZE, search, status }),
    getResponsesForStats(interviewId),
    getAllInterviewers(),
  ]);

  if (!interview) {
    notFound();
  }

  const stats = computeStats(
    statsData as Pick<Response, "duration" | "candidateStatus" | "details">[],
  );

  return (
    <InterviewDetailClient
      interview={interview as unknown as Interview}
      data={responses as unknown as InterviewDetailTableResponse[]}
      stats={stats}
      interviewers={interviewers}
      totalCount={total}
      statsTotal={statsData.length}
    />
  );
}
