"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Clock, Pencil, Trash2, UserCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { analyzeCall, getCallData } from "@/actions/call";
import { updateInterview } from "@/actions/interviews";
import { getResponseByCallIdAction, updateResponse } from "@/actions/responses";
import CandidateResponseDialog from "@/components/dashboard/interview/candidate/candidate-response-dialog";
import MainInterviewDialog from "@/components/dashboard/interview/create/main-interview-dialog";
import DeleteInterviewDialog from "@/components/dashboard/interview/detail/delete-interview-dialog";
import InterviewDetailSearch from "@/components/dashboard/interview/detail/interview-detail-search";
import StatusCard from "@/components/dashboard/interview/detail/status-card";
import type { BreadcrumbOptions } from "@/components/ui/app-breadcrumbs";
import AppBreadcrumbs from "@/components/ui/app-breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { CandidateStatus } from "@/lib/enum";
import { convertSecondstoMMSS, formatTimestampToDateHHMM } from "@/lib/utils";
import type { Interview } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import type { Analytics, CallData, InterviewDetailTableResponse } from "@/types/response";

interface Stats {
  avgDuration: number;
  completionRate: number;
  sentimentCount: { positive: number; negative: number; neutral: number };
  candidateStatusCount: Record<string, number>;
}

interface InterviewDetailsClientsProps {
  interview: Interview;
  data: InterviewDetailTableResponse[];
  stats: Stats;
  interviewers: Interviewer[];
}

const STATUS_BADGE: Record<string, string> = {
  [CandidateStatus.SELECTED]: "bg-green-100 text-green-700 border-green-200",
  [CandidateStatus.POTENTIAL]: "bg-yellow-100 text-yellow-700 border-yellow-200",
  [CandidateStatus.NOT_SELECTED]: "bg-red-100 text-red-700 border-red-200",
  [CandidateStatus.NO_STATUS]: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function InterviewDetailClient(Props: InterviewDetailsClientsProps) {
  const { interview, data, stats, interviewers } = Props;
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isActive, setIsActive] = useState<boolean>(interview.isActive ?? true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchValue, setSearchValue] = useState<string>("");
  const [activeSearch, setActiveSearch] = useState<string>("");

  const [analyzingCallId, setAnalyzingCallId] = useState<string | null>(null);

  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [isResponseLoading, setIsResponseLoading] = useState(false);
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null);
  const [selectedCallData, setSelectedCallData] = useState<CallData | null>(null);
  const [selectedAnalytics, setSelectedAnalytics] = useState<Analytics | null>(null);
  const [selectedResponse, setSelectedResponse] = useState<InterviewDetailTableResponse | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const breadcrumbs: BreadcrumbOptions[] = [
    {
      href: "/",
      label: "Interviews",
    },
    {
      label: interview.name,
    },
  ];

  const handleToggle = async () => {
    const updatedIsActive = !isActive;
    setIsActive(updatedIsActive);

    const result = await updateInterview(interview.id, { isActive: updatedIsActive });

    if (result.success) {
      toast.success("Interview status updated", {
        description: `The interview is now ${updatedIsActive ? "active" : "inactive"}.`,
        position: "bottom-right",
        duration: 3000,
      });
      router.refresh();
    } else {
      setIsActive(!updatedIsActive);
      toast.error("Error", {
        description: "Failed to update the interview status.",
        duration: 3000,
      });
    }
  };

  const handleAnalyzeResponse = useCallback(
    async (response: InterviewDetailTableResponse) => {
      setAnalyzingCallId(response.callId);
      await analyzeCall(response.callId);
      setAnalyzingCallId(null);
      router.refresh();
    },
    [router],
  );

  const handleViewResponse = useCallback(
    async (response: InterviewDetailTableResponse) => {
      setSelectedCallId(response.callId);
      setIsResponseOpen(true);
      setIsResponseLoading(true);
      setSelectedCallData(null);
      setSelectedAnalytics(null);
      setSelectedResponse(null);

      if (!response.isViewed) {
        updateResponse({ isViewed: true }, response.callId).then(() => router.refresh());
      }

      const [callResult, respData] = await Promise.all([
        getCallData(response.callId),
        getResponseByCallIdAction(response.callId),
      ]);

      if (callResult.success) {
        setSelectedCallData(callResult.data?.callResponse ?? null);
        setSelectedAnalytics(callResult.data?.analytics ?? null);
      }
      setSelectedResponse(respData);
      setIsResponseLoading(false);
    },
    [router],
  );

  const filteredResponses = data
    .filter((r) => {
      if (filterStatus === "ALL") return true;
      if (filterStatus === CandidateStatus.NO_STATUS) {
        return !r.candidateStatus || r.candidateStatus === CandidateStatus.NO_STATUS;
      }
      return r.candidateStatus === filterStatus;
    })
    .filter((r) => {
      if (!activeSearch) {
        return true;
      }
      return r.name?.toLowerCase().includes(activeSearch.toLowerCase());
    });

  const columns = useMemo<ColumnDef<InterviewDetailTableResponse>[]>(() => {
    return [
      {
        header: "Name",
        accessorKey: "name",
        size: 150,
      },
      {
        header: "Email",
        accessorKey: "email",
        size: 200,
      },
      {
        header: "Overall Score",
        accessorKey: "analytics.overallScore",
        cell: ({ row }) => {
          const score = row.original.analytics?.overallScore;
          return score != null ? (
            <Badge className="size-7 bg-primary/20 text-primary">{score}</Badge>
          ) : (
            "—"
          );
        },
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Communication",
        accessorKey: "analytics.communication.score",
        cell: ({ row }) => {
          const score = row.original.analytics?.communication?.score;
          return score != null ? (
            <Badge className="size-7 bg-muted-foreground/30 text-foreground">{score}</Badge>
          ) : (
            "—"
          );
        },
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },

      {
        header: "Date",
        accessorKey: "createdAt",
        cell: ({ row }) => formatTimestampToDateHHMM(String(row.original.createdAt)),
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Duration",
        accessorKey: "duration",
        cell: ({ row }) => convertSecondstoMMSS(row.original.duration ?? 0),
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        header: "Status",
        accessorKey: "candidateStatus",
        size: 100,
        cell: ({ row }) => {
          const status = row.original.candidateStatus ?? CandidateStatus.NO_STATUS;
          const label =
            status === CandidateStatus.NO_STATUS
              ? "No Status"
              : status === CandidateStatus.NOT_SELECTED
                ? "Not Selected"
                : status === CandidateStatus.POTENTIAL
                  ? "Potential"
                  : status === CandidateStatus.SELECTED
                    ? "Selected"
                    : status;
          return (
            <Badge
              variant="outline"
              className={STATUS_BADGE[status] ?? "border-gray-200 bg-gray-100 text-gray-500"}
            >
              {label}
            </Badge>
          );
        },
        meta: {
          headerAlign: "center",
          bodyAlign: "center",
        },
      },
      {
        id: "actions",
        header: "Details",
        cell: ({ row }) => (
          <div className="flex justify-center gap-2">
            <Button
              size="xs"
              variant="outline"
              className="border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
              onClick={() => handleViewResponse(row.original)}
            >
              View
            </Button>
            {!row.original.isAnalysed && (
              <Button
                size="xs"
                variant="outline"
                className="border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-50 hover:text-orange-600"
                onClick={() => handleAnalyzeResponse(row.original)}
                disabled={analyzingCallId === row.original.callId}
              >
                {analyzingCallId === row.original.callId ? "Analyzing..." : "Analyze"}
              </Button>
            )}
          </div>
        ),
        meta: {
          headerAlign: "center",
        },
      },
    ];
  }, [analyzingCallId, handleViewResponse, handleAnalyzeResponse]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <AppBreadcrumbs items={breadcrumbs} />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{isActive ? "Active" : "Inactive"}</span>
            <Switch
              checked={isActive}
              className={`${isActive ? "bg-primary" : "bg-input"}`}
              onCheckedChange={handleToggle}
            />
          </div>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsEditModalOpen(true)}
            title="Edit interview"
            className="border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <span>Edit</span>
            <Pencil className="text-primary" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setIsDeleteModalOpen(true)}
            title="Delete interview"
            className="border-destructive bg-destructive/10 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <span>Delete</span>
            <Trash2 className="text-destructive" />
          </Button>
          {/*  */}
        </div>
      </div>

      {/* Status Row */}
      <div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatusCard
            value={data.length}
            icon={<Users size={20} className="text-primary" />}
            label="Total Candidates"
          />
          <StatusCard
            value={convertSecondstoMMSS(stats.avgDuration)}
            icon={<Clock size={20} className="text-primary" />}
            label="Average Duration"
          />
          <StatusCard
            value={`${Math.round(stats.completionRate * 100) / 100}%`}
            icon={<UserCheck size={20} className="text-primary" />}
            label="Interview Completion Rate"
          />
        </div>
      </div>

      {/* Response table */}
      <div className="flex w-full flex-col gap-2 pb-4">
        <InterviewDetailSearch
          filterStatus={filterStatus}
          onFilterStatusChange={setFilterStatus}
          searchValue={searchValue}
          onSearchValueChange={(val) => {
            setSearchValue(val);
            if (!val) {
              setActiveSearch("");
            }
          }}
          onSearch={() => {
            setActiveSearch(searchValue);
          }}
          onClearSearch={() => {
            setSearchValue("");
            setActiveSearch("");
            setFilterStatus("ALL");
          }}
        />

        <DataTable
          columns={columns}
          data={filteredResponses}
          emptyMessage="No responses to display"
        />
      </div>

      {isResponseOpen && (
        <CandidateResponseDialog
          open={isResponseOpen}
          onClose={() => setIsResponseOpen(false)}
          isLoading={isResponseLoading}
          callId={selectedCallId ?? ""}
          callData={selectedCallData}
          analytics={selectedAnalytics}
          responseData={selectedResponse}
          interviewId={interview.id}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteInterviewDialog
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          interviewId={interview.id}
          interviewName={interview.name}
          onDeleted={() => router.push("/")}
        />
      )}

      {/* Edit interview modal */}
      {isEditModalOpen && (
        <MainInterviewDialog
          open={isEditModalOpen}
          setOpen={setIsEditModalOpen}
          interviewers={interviewers}
          mode="edit"
          initialData={{
            id: interview.id,
            name: interview.name,
            objective: interview.objective,
            description: interview.description,
            questions: interview.questions,
            questionCount: interview.questionCount,
            timeDuration: interview.timeDuration,
            interviewerId: interview.interviewerId,
            isAnonymous: interview.isAnonymous,
          }}
        />
      )}
    </div>
  );
}
