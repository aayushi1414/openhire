"use client";

import { ArrowUpRight, Copy, CopyCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

interface Props {
  name: string | null;
  id: string;
  readableSlug: string | null;
  interviewerImage: string | null;
  responseCount: number;
  isActive: boolean;
}

function InterviewCard({
  name,
  id,
  readableSlug,
  interviewerImage,
  responseCount,
  isActive,
}: Props) {
  const [copied, setCopied] = useState(false);

  const buildInterviewUrl = () => {
    const host = window.location.host;
    const protocol = host.includes("localhost") ? "http" : "https";
    if (readableSlug) {
      return `${protocol}://${host}/call/${readableSlug}`;
    }
    return `${protocol}://${host}/call/${id}`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(buildInterviewUrl());
      setCopied(true);
      toast.success("The link to your interview has been copied to your clipboard.", {
        position: "bottom-right",
        duration: 3000,
      });
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (_err) {
      toast.error("Could not copy link. Please copy it manually.", { position: "bottom-right" });
    }
  };

  const handleJumpToInterview = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(buildInterviewUrl(), "_blank");
  };

  return (
    <Link href={`/interviews/${id}`}>
      <Card className="relative h-64 w-full shrink-0 cursor-pointer gap-4 overflow-hidden rounded-md bg-background p-3 shadow-none">
        <CardContent className="flex h-full flex-col rounded-md bg-primary/10 p-2">
          {/* Top row: Active badge + action buttons */}
          <div className="flex items-center justify-between p-2">
            <Badge
              className={`gap-1 border-0 text-[10px] text-background ${isActive ? "bg-green-500" : "bg-gray-400"}`}
            >
              {isActive ? "Active" : "Inactive"}
            </Badge>
            <div className="flex gap-1">
              <Button
                size="icon-xs"
                onClick={handleJumpToInterview}
                aria-label="Open interview in new tab"
              >
                <ArrowUpRight />
              </Button>
              <Button
                size="icon-xs"
                aria-label={copied ? "Link copied" : "Copy interview link"}
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  copyToClipboard();
                }}
              >
                {copied ? <CopyCheck /> : <Copy />}
              </Button>
            </div>
          </div>

          {/* Center: Centered title */}
          <div className="flex flex-1 items-center justify-center px-4">
            <CardTitle className="text-center font-bold text-base text-primary">{name}</CardTitle>
          </div>
        </CardContent>

        <CardFooter className="px-0">
          {/* Bottom row: response count + interviewer avatar */}
          <div className="flex w-full items-center justify-between">
            <span className="flex items-center gap-2 font-bold text-primary/90 text-sm">
              <span className="text-primary text-xl">●</span> {responseCount} Responses
            </span>

            {interviewerImage && (
              <Image
                src={interviewerImage}
                alt="Picture of the interviewer"
                width={40}
                height={40}
                className="rounded-full object-cover object-center"
              />
            )}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default InterviewCard;
