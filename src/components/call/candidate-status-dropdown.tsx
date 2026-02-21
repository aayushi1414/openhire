"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { updateResponse } from "@/actions/responses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateStatus } from "@/lib/enum";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: CandidateStatus.NO_STATUS, label: "No Status", dot: "bg-gray-400" },
  { value: CandidateStatus.NOT_SELECTED, label: "Not Selected", dot: "bg-red-500" },
  { value: CandidateStatus.POTENTIAL, label: "Potential", dot: "bg-yellow-500" },
  { value: CandidateStatus.SELECTED, label: "Selected", dot: "bg-green-500" },
] as const;

const STATUS_CONFIG: Record<string, { label: string; dot: string }> = {
  [CandidateStatus.SELECTED]: { label: "Selected", dot: "bg-green-500" },
  [CandidateStatus.POTENTIAL]: { label: "Potential", dot: "bg-yellow-500" },
  [CandidateStatus.NOT_SELECTED]: { label: "Not Selected", dot: "bg-red-500" },
  [CandidateStatus.NO_STATUS]: { label: "No Status", dot: "bg-gray-400" },
};

const DEFAULT_STATUS = { label: "No Status", dot: "bg-gray-400" };

type CandidateStatusDropdownProps = {
  call_id: string;
  initialStatus: string;
};

export function CandidateStatusDropdown({ call_id, initialStatus }: CandidateStatusDropdownProps) {
  const [candidateStatus, setCandidateStatus] = useState(initialStatus ?? "");
  const [isStatusUpdating, startStatusTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    setCandidateStatus(initialStatus ?? "");
  }, [initialStatus]);

  const currentStatusConfig = STATUS_CONFIG[candidateStatus] ?? DEFAULT_STATUS;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          disabled={isStatusUpdating}
          className="flex w-45 items-center gap-2 rounded-lg border border-input bg-card px-3 py-2 text-sm transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          <div className={`h-3 w-3 shrink-0 rounded-full ${currentStatusConfig.dot}`} />
          <span className="flex-1 truncate text-left">{currentStatusConfig.label}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-45 p-2">
        {STATUS_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            className="flex items-center gap-2 text-xs"
            onSelect={() => {
              startStatusTransition(async () => {
                setCandidateStatus(opt.value);
                await updateResponse({ candidateStatus: opt.value }, call_id);
                router.refresh();
              });
            }}
          >
            <Check
              className={cn(
                "h-4 w-4 shrink-0",
                candidateStatus === opt.value ? "opacity-100" : "opacity-0",
              )}
            />
            <div className={`h-3 w-3 shrink-0 rounded-full ${opt.dot}`} />
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
