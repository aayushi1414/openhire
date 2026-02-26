"use client";

import type { PaginationState, Updater } from "@tanstack/react-table";
import { Clock, Pencil, Trash2, UserCheck, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useCallback, useReducer, useState } from "react";
import { toast } from "sonner";
import { analyzeCall, getCallData } from "@/actions/call";
import { getFeedbackByInterviewIdAndEmail } from "@/actions/feedback";
import { updateInterview } from "@/actions/interviews";
import { getResponseByCallIdAction, updateResponse } from "@/actions/responses";
import CandidateResponseDialog from "@/components/dashboard/interview/candidate-response";
import MainInterviewDialog from "@/components/dashboard/interview/create/main-interview-dialog";
import DeleteInterviewDialog from "@/components/dashboard/interview/detail/delete-interview-dialog";
import InterviewDetailSearch from "@/components/dashboard/interview/detail/interview-detail-search";
import StatusCard from "@/components/dashboard/interview/detail/status-card";
import { useInterviewDetailColumns } from "@/components/dashboard/interview/detail/use-interview-detail-columns";
import type { BreadcrumbOptions } from "@/components/ui/app-breadcrumbs";
import AppBreadcrumbs from "@/components/ui/app-breadcrumbs";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Switch } from "@/components/ui/switch";
import { PAGE_SIZE } from "@/lib/constants";
import { convertSecondstoMMSS } from "@/lib/utils";
import type { Interview } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import type {
  Analytics,
  CallData,
  FeedbackData,
  InterviewDetailTableResponse,
} from "@/types/response";

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
  totalCount: number;
  statsTotal: number;
}

type ResponseDialogState = {
  isOpen: boolean;
  isLoading: boolean;
  callId: string | null;
  callData: CallData | null;
  analytics: Analytics | null;
  response: InterviewDetailTableResponse | null;
  feedback: FeedbackData | null;
};

type ResponseDialogAction =
  | { type: "OPEN"; callId: string }
  | { type: "CLOSE" }
  | {
      type: "SET_DATA";
      callData: CallData | null;
      analytics: Analytics | null;
      response: InterviewDetailTableResponse | null;
      feedback: FeedbackData | null;
    };

const initialResponseDialogState: ResponseDialogState = {
  isOpen: false,
  isLoading: false,
  callId: null,
  callData: null,
  analytics: null,
  response: null,
  feedback: null,
};

function responseDialogReducer(
  state: ResponseDialogState,
  action: ResponseDialogAction,
): ResponseDialogState {
  switch (action.type) {
    case "OPEN":
      return {
        isOpen: true,
        isLoading: true,
        callId: action.callId,
        callData: null,
        analytics: null,
        response: null,
        feedback: null,
      };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "SET_DATA":
      return {
        ...state,
        isLoading: false,
        callData: action.callData,
        analytics: action.analytics,
        response: action.response,
        feedback: action.feedback,
      };
    default:
      return state;
  }
}

export default function InterviewDetailClient(props: InterviewDetailsClientsProps) {
  const { interview, data, stats, interviewers, totalCount, statsTotal } = props;
  const router = useRouter();
  const [modals, setModals] = useState({ editOpen: false, deleteOpen: false });
  const [isActive, setIsActive] = useState<boolean>(interview.isActive ?? true);

  const [page, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(0).withOptions({ shallow: false }),
  );

  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withDefault("ALL").withOptions({ shallow: false }),
  );

  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );

  const [searchValue, setSearchValue] = useState<string>(search ?? "");
  const [analyzingCallId, setAnalyzingCallId] = useState<string | null>(null);

  const [responseDialog, dispatchResponseDialog] = useReducer(
    responseDialogReducer,
    initialResponseDialogState,
  );

  const pagination: PaginationState = { pageIndex: page ?? 0, pageSize: PAGE_SIZE };

  const setPagination = useCallback(
    (updater: Updater<PaginationState>) => {
      const current: PaginationState = { pageIndex: page ?? 0, pageSize: PAGE_SIZE };
      const next = typeof updater === "function" ? updater(current) : updater;
      setPage(next.pageIndex);
    },
    [page, setPage],
  );

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
      dispatchResponseDialog({ type: "OPEN", callId: response.callId });

      if (!response.isViewed) {
        updateResponse({ isViewed: true }, response.callId).then(() => router.refresh());
      }

      const [callResult, respData, feedbackResult] = await Promise.all([
        getCallData(response.callId),
        getResponseByCallIdAction(response.callId),
        getFeedbackByInterviewIdAndEmail(interview.id, response.email),
      ]);

      dispatchResponseDialog({
        type: "SET_DATA",
        callData: callResult.success ? (callResult.data?.callResponse ?? null) : null,
        analytics: callResult.success ? (callResult.data?.analytics ?? null) : null,
        response: respData,
        feedback: feedbackResult ?? null,
      });
    },
    [router, interview.id],
  );

  const handleFilterChange = (newStatus: string) => {
    setStatus(newStatus);
    setPage(0);
  };

  const handleSearch = () => {
    setSearch(searchValue);
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSearch(null);
    setStatus(null);
    setPage(null);
  };

  const columns = useInterviewDetailColumns({
    analyzingCallId,
    handleViewResponse,
    handleAnalyzeResponse,
  });

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
            onClick={() => setModals((m) => ({ ...m, editOpen: true }))}
            title="Edit interview"
            className="border-primary bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
          >
            <span>Edit</span>
            <Pencil className="text-primary" />
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setModals((m) => ({ ...m, deleteOpen: true }))}
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
            value={statsTotal}
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
          filterStatus={status ?? "ALL"}
          onFilterStatusChange={handleFilterChange}
          searchValue={searchValue}
          onSearchValueChange={(val) => {
            setSearchValue(val);
            if (!val) handleClearSearch();
          }}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />

        <DataTable
          columns={columns}
          data={data}
          emptyMessage="No responses to display"
          pagination={pagination}
          setPagination={setPagination}
          rowCount={totalCount}
          manualPagination={true}
        />
      </div>

      {responseDialog.isOpen && (
        <CandidateResponseDialog
          open={responseDialog.isOpen}
          onClose={() => dispatchResponseDialog({ type: "CLOSE" })}
          isLoading={responseDialog.isLoading}
          callId={responseDialog.callId ?? ""}
          callData={responseDialog.callData}
          analytics={responseDialog.analytics}
          responseData={responseDialog.response}
          interviewId={interview.id}
          feedbackData={responseDialog.feedback}
        />
      )}

      {modals.deleteOpen && (
        <DeleteInterviewDialog
          open={modals.deleteOpen}
          onClose={() => setModals((m) => ({ ...m, deleteOpen: false }))}
          interviewId={interview.id}
          interviewName={interview.name}
          onDeleted={() => router.push("/")}
        />
      )}

      {/* Edit interview modal */}
      {modals.editOpen && (
        <MainInterviewDialog
          open={modals.editOpen}
          setOpen={(val) => setModals((m) => ({ ...m, editOpen: val }))}
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
