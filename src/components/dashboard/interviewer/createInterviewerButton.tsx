"use client";

import { createDefaultInterviewers } from "@/actions/interviewers.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

function CreateInterviewerButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const createInterviewers = () => {
    startTransition(async () => {
      const result = await createDefaultInterviewers();

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      router.refresh();
    });
  };

  return (
    <>
      <Card
        className="p-0 inline-block cursor-pointer hover:scale-105 ease-in-out duration-300 h-40 w-36 ml-1 mr-3 rounded-xl shrink-0 overflow-hidden shadow-md"
        onClick={() => createInterviewers()}
      >
        <CardContent className="p-0">
          {isPending ? (
            <div className="w-full h-20 overflow-hidden flex justify-center items-center">
              <Loader2 size={40} className="animate-spin" />
            </div>
          ) : (
            <div className="w-full h-20 overflow-hidden flex justify-center items-center">
              <Plus size={40} />
            </div>
          )}
          <p className="my-3 mx-auto text-xs text-wrap w-fit text-center">
            Create two Default Interviewers
          </p>
        </CardContent>
      </Card>
    </>
  );
}

export default CreateInterviewerButton;
