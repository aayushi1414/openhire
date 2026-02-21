"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Interviewer } from "@/types/interviewer";
import { Plus } from "lucide-react";
import { useState } from "react";
import MainInterviewDialog from "../create/main-interview-dialog";

interface CreateInterviewCardProps {
  interviewers: Interviewer[];
}

function CreateInterviewCard({ interviewers }: CreateInterviewCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className="flex items-center border-dashed border-border border-2 cursor-pointer h-64 rounded-md shrink-0 overflow-hidden"
        onClick={() => {
          setOpen(true);
        }}
      >
        <CardContent className="flex items-center justify-center h-full flex-col mx-auto">
          <div className="flex flex-col justify-center items-center w-full overflow-hidden">
            <div className="bg-primary/10 rounded-full p-2">
              <div className="bg-primary text-background rounded-full p-1">
                <Plus size={24} />
              </div>
            </div>
          </div>
          <CardTitle className="pt-1.5 text-md text-center">Create an Interview</CardTitle>
        </CardContent>
      </Card>

      {open && (
        <MainInterviewDialog
          mode="create"
          open={open}
          setOpen={setOpen}
          interviewers={interviewers}
        />
      )}
    </>
  );
}

export default CreateInterviewCard;
