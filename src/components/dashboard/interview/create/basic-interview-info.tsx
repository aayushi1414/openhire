"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewBase, Question } from "@/types/interview";
import type { Interviewer } from "@/types/interviewer";
import FileUpload from "./file-upload";

const formSchema = z.object({
  name: z.string().nonempty("Interview name is required"),
  objective: z.string().nonempty("Objective is required"),
  numQuestions: z
    .string()
    .nonempty("Number of questions is required")
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 5,
      "Must be a whole number between 1 and 5",
    ),
  duration: z
    .string()
    .nonempty("Duration is required")
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) >= 1 && Number(val) <= 15,
      "Must be a whole number between 1 and 15",
    ),
  interviewerId: z
    .number()
    .int()
    .refine((val) => val !== 0, "Please select an interviewer"),
  isAnonymous: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface BasicInterviewInfoProps {
  setLoading: (loading: boolean) => void;
  setProceed: (proceed: boolean) => void;
  interviewData: InterviewBase;
  setInterviewData: (interviewData: InterviewBase) => void;
  interviewers: Interviewer[];
  mode: "create" | "edit";
}

export default function BasicInterviewInfo(props: BasicInterviewInfoProps) {
  const {
    setLoading,
    setProceed,
    interviewData,
    setInterviewData,
    interviewers,
    mode = "create",
  } = props;

  const [submitAction, setSubmitAction] = useState<"generate" | "manual" | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [uploadedDocumentContext, setUploadedDocumentContext] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: interviewData.name,
      objective: interviewData.objective,
      numQuestions: interviewData.questionCount === 0 ? "" : String(interviewData.questionCount),
      duration: interviewData.timeDuration,
      interviewerId: interviewData.interviewerId,
      isAnonymous: interviewData.isAnonymous,
    },
  });

  const { control, formState } = form;
  const { isValid, isSubmitting } = formState;

  const onGenerateQuestions = async (values: FormValues) => {
    setLoading(true);

    try {
      const data = {
        name: values.name,
        objective: values.objective,
        number: values.numQuestions,
        context: uploadedDocumentContext,
      };

      const response = await fetch("/api/generate-interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to generate questions");
      }

      const generatedQuestions = await response.json();
      const generatedQuestionsResponse = generatedQuestions?.response;

      const updatedQuestions = generatedQuestionsResponse.questions.map((question: Question) => ({
        id: crypto.randomUUID(),
        question: question.question.trim(),
        followUpCount: 1,
      }));

      setInterviewData({
        ...interviewData,
        name: values.name.trim(),
        objective: values.objective.trim(),
        questions: updatedQuestions,
        interviewerId: values.interviewerId,
        questionCount: Number(values.numQuestions),
        timeDuration: values.duration,
        description: generatedQuestionsResponse.description,
        isAnonymous: values.isAnonymous,
      });
      setProceed(true);
    } catch {
      toast.error("Failed to generate questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnManual = (values: FormValues) => {
    setInterviewData({
      ...interviewData,
      name: values.name,
      objective: values.objective,
      questions:
        mode === "edit" && interviewData.questions.length > 0
          ? interviewData.questions
          : [{ id: crypto.randomUUID(), question: "", followUpCount: 1 }],
      interviewerId: values.interviewerId,
      questionCount: Number(values.numQuestions),
      timeDuration: String(values.duration),
      description: mode === "edit" ? interviewData.description : "",
      isAnonymous: values.isAnonymous,
    });
    setProceed(true);
  };

  const onSubmit = (values: FormValues) => {
    if (submitAction === "generate") {
      return onGenerateQuestions(values);
    }
    if (submitAction === "manual") {
      handleOnManual(values);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Interview Name</FieldLabel>
              <FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="e.g. Name of the Interview"
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="interviewerId"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Select an Interviewer</FieldLabel>
              <FieldContent>
                <div className="relative flex items-center">
                  <div className="flex gap-4">
                    {interviewers.map((item) => (
                      <div key={item.id.toString()} className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className={`h-auto flex-col border-2 px-4 py-2 hover:bg-background ${field.value === item.id ? "border-primary" : "border-border"}`}
                          onClick={() => field.onChange(item.id)}
                        >
                          <Image
                            src={item.image}
                            alt="Picture of the interviewer"
                            width={50}
                            height={50}
                            className="h-20 w-25 object-cover"
                          />
                          <CardTitle className="text-center text-xs">{item.name}</CardTitle>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="flex flex-wrap gap-4">
          <Controller
            name="numQuestions"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="min-w-35 flex-1">
                <FieldLabel htmlFor={field.name}>Number of Questions (Max 05)</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="number"
                    step="1"
                    max="5"
                    min="1"
                    placeholder="e.g. 3"
                    onChange={(e) => {
                      let value = e.target.value;
                      if (value === "" || (Number.isInteger(Number(value)) && Number(value) > 0)) {
                        if (Number(value) > 5) {
                          value = "5";
                        }
                        field.onChange(value);
                      }
                    }}
                  />
                </FieldContent>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name="duration"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="min-w-35 flex-1">
                <FieldLabel htmlFor={field.name}>Duration (Max 15 Minutes)</FieldLabel>
                <FieldContent>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      type="number"
                      step="1"
                      max="15"
                      min="1"
                      className="pr-12"
                      placeholder="e.g. 10"
                      onChange={(e) => {
                        let value = e.target.value;
                        if (
                          value === "" ||
                          (Number.isInteger(Number(value)) && Number(value) > 0)
                        ) {
                          if (Number(value) > 15) {
                            value = "15";
                          }
                          field.onChange(value);
                        }
                      }}
                    />
                    <span className="pointer-events-none absolute right-3 text-muted-foreground text-sm">
                      mins
                    </span>
                  </div>
                </FieldContent>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        <Controller
          name="objective"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Objective of Interview</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  className="h-24 w-full border border-border"
                  placeholder="e.g. Find best candidates based on their technical skills and previous projects."
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Upload job description</FieldLabel>
          <FileUpload
            isUploaded={isUploaded}
            setIsUploaded={setIsUploaded}
            fileName={fileName}
            setFileName={setFileName}
            setUploadedDocumentContext={setUploadedDocumentContext}
          />
        </Field>

        <Controller
          name="isAnonymous"
          control={control}
          render={({ field }) => (
            <Field>
              <div className="flex cursor-pointer items-center">
                <span className="font-medium text-foreground text-sm">Anonymous responses?</span>
                <Switch
                  checked={field.value}
                  className="mt-1 ml-4"
                  onCheckedChange={(checked) => field.onChange(checked)}
                />
              </div>
              <span className="text-muted-foreground text-xs italic">
                Note: If not anonymous, the interviewee&apos;s email and name will be collected.
              </span>
            </Field>
          )}
        />

        <Field>
          <div className="mt-1 flex w-full flex-row items-center justify-between gap-3">
            <Button
              type="submit"
              variant="outline"
              disabled={!isValid || isSubmitting}
              className="flex-1"
              onClick={() => setSubmitAction("manual")}
            >
              {mode === "edit" ? "Edit questions manually" : "Create questions myself"}
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-primary"
              onClick={() => setSubmitAction("generate")}
            >
              {mode === "edit" ? "✨ Regenerate questions" : "✨ Generate questions"}
            </Button>
          </div>
        </Field>
      </FieldGroup>
    </form>
  );
}
