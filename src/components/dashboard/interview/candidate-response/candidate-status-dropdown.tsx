"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateResponse } from "@/actions/responses";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CANDIDATE_STATUS_OPTIONS } from "@/lib/constants";

interface CandidateStatusDropdownProps {
  call_id: string;
  initialStatus: string;
}

export default function CandidateStatusDropdown(props: CandidateStatusDropdownProps) {
  const { call_id, initialStatus } = props;
  const [candidateStatus, setCandidateStatus] = useState(initialStatus ?? "");
  const [isStatusUpdating, startStatusTransition] = useTransition();
  const router = useRouter();

  return (
    <Select
      value={candidateStatus}
      disabled={isStatusUpdating}
      onValueChange={(value) => {
        startStatusTransition(async () => {
          setCandidateStatus(value);
          await updateResponse({ candidateStatus: value }, call_id);
          router.refresh();
        });
      }}
    >
      <SelectTrigger className="w-45">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CANDIDATE_STATUS_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            <div className={`h-3 w-3 shrink-0 rounded-full ${opt.dot}`} />
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
