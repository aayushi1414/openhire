"use client";

import Modal from "@/components/dashboard/Modal";
import CreateInterviewCard from "@/components/dashboard/interview/createInterviewCard";
import InterviewCard from "@/components/dashboard/interview/interviewCard";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import type { Interview } from "@/types/interview";
import { Gem, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type InterviewsClientProps = {
  interviews: Interview[];
  currentPlan: string;
};

export default function InterviewsClient({ interviews, currentPlan }: InterviewsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(currentPlan === "free_trial_over");
  console.log(interviews);

  return (
    <main className="p-8 pt-0 ml-12 mr-auto rounded-md">
      <div className="flex flex-col items-left">
        <h2 className="mr-2 text-2xl font-semibold tracking-tight mt-8">My Interviews</h2>
        <h3 className=" text-sm tracking-tight text-gray-600 font-medium ">
          Start getting responses now!
        </h3>
        <div className="relative flex items-center mt-1 flex-wrap">
          {currentPlan === "free_trial_over" ? (
            <Card className=" flex bg-gray-200 items-center border-dashed border-gray-700 border-2 hover:scale-105 ease-in-out duration-300 h-60 w-56 ml-1 mr-3 mt-4 rounded-xl shrink-0 overflow-hidden shadow-md">
              <CardContent className="flex items-center flex-col mx-auto">
                <div className="flex flex-col justify-center items-center w-full overflow-hidden">
                  <Plus size={90} strokeWidth={0.5} className="text-gray-700" />
                </div>
                <CardTitle className="p-0 text-md text-center">
                  You cannot create any more interviews unless you upgrade
                </CardTitle>
              </CardContent>
            </Card>
          ) : (
            <CreateInterviewCard />
          )}
          {isModalOpen && (
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-center text-indigo-600">
                  <Gem />
                </div>
                <h3 className="text-xl font-semibold text-center">Upgrade to Pro</h3>
                <p className="text-l text-center">
                  You have reached your limit for the free trial. Please upgrade to pro to continue
                  using our features.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-center items-center">
                    <Image src={"/premium-plan-icon.png"} alt="Graphic" width={299} height={300} />
                  </div>

                  <div className="grid grid-rows-2 gap-2">
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-lg font-medium">Free Plan</h4>
                      <ul className="list-disc pl-5 mt-2">
                        <li>10 Responses</li>
                        <li>Basic Support</li>
                        <li>Limited Features</li>
                      </ul>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="text-lg font-medium">Pro Plan</h4>
                      <ul className="list-disc pl-5 mt-2">
                        <li>Flexible Pay-Per-Response</li>
                        <li>Priority Support</li>
                        <li>All Features</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p className="text-l text-center">
                  Contact <span className="font-semibold">founders@openhire.io</span> to upgrade your
                  plan.
                </p>
              </div>
            </Modal>
          )}
          {interviews.map((item) => (
            <InterviewCard
              id={item.id}
              interviewerId={item.interviewerId}
              key={item.id}
              name={item.name}
              readableSlug={item.readableSlug}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
