"use client";

import { Check, SlidersHorizontal } from "lucide-react";
import AppSearch from "@/components/ui/app-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CandidateStatus } from "@/lib/enum";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: CandidateStatus.NO_STATUS, label: "No Status" },
  { value: CandidateStatus.NOT_SELECTED, label: "Not Selected" },
  { value: CandidateStatus.POTENTIAL, label: "Potential" },
  { value: CandidateStatus.SELECTED, label: "Selected" },
];

interface InterviewDetailSearchProps {
  filterStatus: string;
  onFilterStatusChange: (value: string) => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
}

export default function InterviewDetailSearch(props: InterviewDetailSearchProps) {
  const {
    filterStatus,
    onFilterStatusChange,
    searchValue,
    onSearchValueChange,
    onSearch,
    onClearSearch,
  } = props;
  const hasActiveFilter = filterStatus !== "ALL" || searchValue;
  const selectedLabel = STATUS_OPTIONS.find((o) => o.value === filterStatus)?.label ?? "All";

  return (
    <div className="mb-3 flex w-full items-center gap-2">
      {/* Status filter dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={filterStatus !== "ALL" ? "default" : "outline"}
            className="flex w-30 shrink-0 items-center justify-between text-xs"
          >
            {selectedLabel}
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-35 p-2">
          {STATUS_OPTIONS.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              className="flex items-center gap-2 text-xs"
              onSelect={() => onFilterStatusChange(opt.value)}
            >
              <Check
                className={cn("h-4 w-4", filterStatus === opt.value ? "opacity-100" : "opacity-0")}
              />
              {opt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <AppSearch
        placeholder="Search candidate..."
        searchValue={searchValue}
        onChangeSearchValue={onSearchValueChange}
        onSearch={onSearch}
        onClearSearch={onClearSearch}
        isDisabledButton={!searchValue}
      />
      {hasActiveFilter && (
        <Button variant="outline" onClick={onClearSearch} className="shrink-0 text-xs">
          Reset
        </Button>
      )}
    </div>
  );
}
