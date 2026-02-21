"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlarmClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RetellWebClient } from "retell-client-js-sdk";
import { toast } from "sonner";
import { z } from "zod";
import { registerCall } from "@/actions/call";
import { submitFeedback } from "@/actions/feedback";
import { getInterviewerAction } from "@/actions/interviewers";
import { createResponse, getAllEmailsAction, updateResponse } from "@/actions/responses";
import { FeedbackForm } from "@/components/call/feedbackForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { isLightColor } from "@/lib/utils";
import type { Interview } from "@/types/interview";
import type { FeedbackData } from "@/types/response";
import MiniLoader from "../loaders/mini-loader/miniLoader";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { TabSwitchWarning, useTabSwitchPrevention } from "./tabSwitchPrevention";

const webClient = new RetellWebClient();

const formSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(1, "Name is required"),
});

type FormValues = z.infer<typeof formSchema>;

type InterviewProps = {
  interview: Interview;
};

type transcriptType = {
  role: string;
  content: string;
};

function Call({ interview }: InterviewProps) {
  const [lastInterviewerResponse, setLastInterviewerResponse] = useState<string>("");
  const [lastUserResponse, setLastUserResponse] = useState<string>("");
  const [activeTurn, setActiveTurn] = useState<string>("");
  const [Loading, setLoading] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isOldUser, setIsOldUser] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>("");
  const { tabSwitchCount } = useTabSwitchPrevention();
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [interviewerImg, setInterviewerImg] = useState("");
  const [interviewTimeDuration, setInterviewTimeDuration] = useState<string>("1");
  const [time, setTime] = useState(0);
  const [currentTimeDuration, setCurrentTimeDuration] = useState<string>("0");

  const lastUserResponseRef = useRef<HTMLDivElement | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { email: "", name: "" },
  });

  const { control, formState, getValues } = form;

  const handleFeedbackSubmit = async (formData: Omit<FeedbackData, "interview_id">) => {
    try {
      await submitFeedback({
        ...formData,
        interview_id: interview.id,
      });
      toast.success("Thank you for your feedback!");
      setIsFeedbackSubmitted(true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll to bottom on new response
  useEffect(() => {
    if (lastUserResponseRef.current) {
      const { current } = lastUserResponseRef;
      current.scrollTop = current.scrollHeight;
    }
  }, [lastUserResponse]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: timer logic depends on mutable time ref
  useEffect(() => {
    let intervalId: any;
    if (isCalling) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime(time + 1), 10);
    }
    setCurrentTimeDuration(String(Math.floor(time / 100)));
    if (Number(currentTimeDuration) === Number(interviewTimeDuration) * 60) {
      webClient.stopCall();
      setIsEnded(true);
    }

    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCalling, time, currentTimeDuration]);

  useEffect(() => {
    webClient.on("call_started", () => {
      console.log("Call started");
      setIsCalling(true);
    });

    webClient.on("call_ended", () => {
      console.log("Call ended");
      setIsCalling(false);
      setIsEnded(true);
    });

    webClient.on("agent_start_talking", () => {
      setActiveTurn("agent");
    });

    webClient.on("agent_stop_talking", () => {
      // Optional: Add any logic when agent stops talking
      setActiveTurn("user");
    });

    webClient.on("error", (error) => {
      console.error("An error occurred:", error);
      webClient.stopCall();
      setIsEnded(true);
      setIsCalling(false);
    });

    webClient.on("update", (update) => {
      if (update.transcript) {
        const transcripts: transcriptType[] = update.transcript;
        const roleContents: { [key: string]: string } = {};

        for (const transcript of transcripts) {
          roleContents[transcript?.role] = transcript?.content;
        }

        setLastInterviewerResponse(roleContents.agent);
        setLastUserResponse(roleContents.user);
      }
      //TODO: highlight the newly uttered word in the UI
    });

    return () => {
      // Clean up event listeners
      webClient.removeAllListeners();
    };
  }, []);

  const onEndCallClick = async () => {
    if (isStarted) {
      setLoading(true);
      webClient.stopCall();
      setIsEnded(true);
      setLoading(false);
    } else {
      setIsEnded(true);
    }
  };

  const startConversation = async () => {
    const { email, name } = getValues();
    const data = {
      mins: interview?.timeDuration,
      objective: interview?.objective,
      questions: interview?.questions.map((q) => q.question).join(", "),
      name: name || "not provided",
    };
    setLoading(true);

    const emailsList = await getAllEmailsAction(interview.id);
    const oldUserEmails: string[] = emailsList.map((item: any) => item.email);
    const OldUser =
      oldUserEmails.includes(email) ||
      (interview?.respondents && !interview?.respondents.includes(email));

    if (OldUser) {
      setIsOldUser(true);
    } else {
      const result = await registerCall(Number(interview?.interviewerId), data);

      if (!result.success) {
        console.error("Failed to register call:", result.error);
        setLoading(false);
        return;
      }

      const { call_id, access_token } = result.data;

      if (access_token) {
        await webClient.startCall({ accessToken: access_token }).catch(console.error);
        setIsCalling(true);
        setIsStarted(true);
        setCallId(call_id);

        await createResponse({
          interviewId: interview.id,
          callId: call_id,
          email: email,
          name: name,
        });
      } else {
        console.log("Failed to register call");
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (interview?.timeDuration) {
      setInterviewTimeDuration(interview?.timeDuration);
    }
  }, [interview]);

  useEffect(() => {
    const fetchInterviewer = async () => {
      const data = await getInterviewerAction(Number(interview.interviewerId));
      if (data?.image) setInterviewerImg(data.image);
    };
    fetchInterviewer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview.interviewerId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: only run when isEnded changes
  useEffect(() => {
    if (isEnded) {
      const updateInterview = async () => {
        await updateResponse({ isEnded: true, tabSwitchCount: tabSwitchCount }, callId);
      };

      updateInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEnded]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {isStarted && <TabSwitchWarning />}
      <div className="w-[90%] rounded-md bg-card md:w-[80%]">
        <Card className="min-h-[88vh] overflow-y-auto rounded-lg border-2 border-border border-r-4 border-b-4 font-bold text-xl transition-all md:block">
          <div>
            <div className="m-4 h-[15px] rounded-lg border-[1px] border-border">
              <div
                className="h-[15px] rounded-lg bg-primary"
                style={{
                  width: isEnded
                    ? "100%"
                    : `${
                        (Number(currentTimeDuration) / (Number(interviewTimeDuration) * 60)) * 100
                      }%`,
                }}
              />
            </div>
            <CardHeader className="items-center p-1">
              {!isEnded && (
                <CardTitle className="mb-2 flex flex-row items-center font-bold text-lg md:text-xl">
                  {interview?.name}
                </CardTitle>
              )}
              {!isEnded && (
                <div className="mt-2 flex flex-row">
                  <AlarmClockIcon
                    className="mr-2 h-[1rem] w-[1rem] rotate-0 scale-100 font-bold text-primary dark:-rotate-90 dark:scale-0"
                    style={{ color: interview.themeColor }}
                  />
                  <div className="font-normal text-sm">
                    Expected duration:{" "}
                    <span className="font-bold" style={{ color: interview.themeColor }}>
                      {interviewTimeDuration} mins{" "}
                    </span>
                    or less
                  </div>
                </div>
              )}
            </CardHeader>
            {!isStarted && !isEnded && !isOldUser && (
              <div className="m-2 mx-auto mt-2 w-fit min-w-[400px] max-w-[400px] rounded-md border border-primary/20 bg-muted p-2">
                <div>
                  {interview?.logoUrl && (
                    <div className="flex justify-center p-1">
                      <Image
                        src={interview?.logoUrl}
                        alt="Logo"
                        className="h-10 w-auto"
                        width={100}
                        height={100}
                      />
                    </div>
                  )}
                  <div className="mb-4 whitespace-pre-line p-2 font-normal text-sm">
                    {interview?.description}
                    <p className="font-bold text-sm">
                      {"\n"}Ensure your volume is up and grant microphone access when prompted.
                      Additionally, please make sure you are in a quiet environment.
                      {"\n\n"}Note: Tab switching will be recorded.
                    </p>
                  </div>
                  {!interview?.isAnonymous && (
                    <FieldGroup className="px-4 pb-2">
                      <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email" className="font-normal text-sm">
                              Email address
                            </FieldLabel>
                            <FieldContent>
                              <Input
                                {...field}
                                id="email"
                                placeholder="Enter your email address"
                                aria-invalid={fieldState.invalid}
                                className="font-normal text-sm"
                              />
                            </FieldContent>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        control={control}
                        name="name"
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name" className="font-normal text-sm">
                              First name
                            </FieldLabel>
                            <FieldContent>
                              <Input
                                {...field}
                                id="name"
                                placeholder="Enter your first name"
                                aria-invalid={fieldState.invalid}
                                className="font-normal text-sm"
                              />
                            </FieldContent>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </FieldGroup>
                  )}
                </div>
                <div className="mx-auto flex w-[80%] flex-row items-center justify-center align-middle">
                  <Button
                    className="mb-8 flex h-10 min-w-20 flex-row justify-center rounded-lg"
                    style={{
                      backgroundColor: interview.themeColor ?? "#4F46E5",
                      color: isLightColor(interview.themeColor ?? "#4F46E5") ? "black" : "white",
                    }}
                    disabled={Loading || (!interview?.isAnonymous && !formState.isValid)}
                    onClick={startConversation}
                  >
                    {!Loading ? "Start Interview" : <MiniLoader />}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        className="mb-8 ml-2 flex h-10 min-w-15 flex-row justify-center rounded-lg border bg-card text-foreground"
                        style={{ borderColor: interview.themeColor }}
                        disabled={Loading}
                      >
                        Exit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-primary hover:bg-primary/90"
                          onClick={async () => {
                            await onEndCallClick();
                          }}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
            {isStarted && !isEnded && !isOldUser && (
              <div className="flex grow flex-row p-2">
                <div className="my-auto min-h-[70%] w-[50%] border-border border-x-2">
                  <div className="flex flex-col justify-evenly">
                    <div className={"mx-auto mt-4 min-h-[250px] w-[80%] px-6 text-sm md:text-base"}>
                      {lastInterviewerResponse}
                    </div>
                    <div className="mx-auto flex flex-col items-center justify-center align-middle">
                      <Image
                        src={interviewerImg}
                        alt="Image of the interviewer"
                        width={120}
                        height={120}
                        className={`mx-auto my-auto object-cover object-center ${
                          activeTurn === "agent"
                            ? `border-4 border-[${interview.themeColor}] rounded-full`
                            : ""
                        }`}
                      />
                      <div className="font-semibold">Interviewer</div>
                    </div>
                  </div>
                </div>

                <div className="flex w-[50%] flex-col justify-evenly">
                  <div
                    ref={lastUserResponseRef}
                    className={
                      "mx-auto mt-4 h-[250px] w-[80%] overflow-y-auto overflow-x-hidden break-words px-6 text-sm md:text-base"
                    }
                  >
                    {lastUserResponse}
                  </div>
                  <div className="mx-auto flex flex-col items-center justify-center align-middle">
                    <Image
                      src={"/user-icon.png"}
                      alt="Picture of the user"
                      width={120}
                      height={120}
                      className={`mx-auto my-auto object-cover object-center ${
                        activeTurn === "user"
                          ? `border-4 border-[${interview.themeColor}] rounded-full`
                          : ""
                      }`}
                    />
                    <div className="font-semibold">You</div>
                  </div>
                </div>
              </div>
            )}
            {isStarted && !isEnded && !isOldUser && (
              <div className="items-center p-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="mx-auto mb-8 flex h-10 w-full flex-row justify-center border border-primary bg-card text-foreground"
                      disabled={Loading}
                    >
                      End Interview{" "}
                      <XCircleIcon className="ml-2 h-[1.5rem] w-[1.5rem] rotate-0 scale-100 text-red dark:-rotate-90 dark:scale-0" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This action will end the call.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-primary hover:bg-primary/90"
                        onClick={async () => {
                          await onEndCallClick();
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}

            {isEnded && !isOldUser && (
              <div className="absolute top-1/2 left-1/2 m-2 mx-auto mt-2 w-fit min-w-[400px] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md border border-primary/20 bg-muted p-2">
                <div>
                  <div className="mb-4 whitespace-pre-line p-2 font-normal text-base">
                    <CheckCircleIcon className="mx-auto my-4 h-[2rem] w-[2rem] rotate-0 scale-100 text-primary transition-all dark:-rotate-90 dark:scale-0" />
                    <p className="text-center font-semibold text-lg">
                      {isStarted
                        ? "Thank you for taking the time to participate in this interview"
                        : "Thank you very much for considering."}
                    </p>
                    <p className="text-center">
                      {"\n"}
                      You can close this tab now.
                    </p>
                  </div>

                  {!isFeedbackSubmitted && (
                    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          className="mt-4 mb-4 h-10 w-full bg-primary text-primary-foreground"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          Provide Feedback
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <FeedbackForm email={getValues("email")} onSubmit={handleFeedbackSubmit} />
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            )}
            {isOldUser && (
              <div className="absolute top-1/2 left-1/2 m-2 mx-auto mt-2 w-fit min-w-[400px] max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-md border border-primary/20 bg-muted p-2">
                <div>
                  <div className="mb-4 whitespace-pre-line p-2 font-normal text-base">
                    <CheckCircleIcon className="mx-auto my-4 h-[2rem] w-[2rem] rotate-0 scale-100 text-primary transition-all dark:-rotate-90 dark:scale-0" />
                    <p className="text-center font-semibold text-lg">
                      You have already responded in this interview or you are not eligible to
                      respond. Thank you!
                    </p>
                    <p className="text-center">
                      {"\n"}
                      You can close this tab now.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-3 flex flex-row justify-center pb-3 align-middle">
            <div className="mr-2 text-center font-semibold text-md">
              Powered by{" "}
              <span className="font-bold">
                Open<span className="text-primary">Hire</span>
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Call;
