"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Plus } from "lucide-react";
import { useEffect, useRef, useTransition } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createInterview, updateInterview } from "@/actions/interviews";
import InterviewQuestionCard from "@/components/dashboard/interview/create/interview-question-card";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewBase } from "@/types/interview";

const schema = z.object({
  description: z.string().min(1, "Description is required"),
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string().min(1, "Question is required"),
      followUpCount: z.number().int().min(1).max(3),
    }),
  ),
});

type FormValues = z.infer<typeof schema>;

interface CreateInterviewQuestionsProps {
  interviewData: InterviewBase;
  setProceed: (proceed: boolean) => void;
  setOpen: (open: boolean) => void;
  mode?: "create" | "edit";
  interviewId?: string;
}

export default function CreateInterviewQuestions(props: CreateInterviewQuestionsProps) {
  const { interviewData, setProceed, setOpen, mode = "create", interviewId } = props;

  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      description: interviewData.description.trim(),
      questions: interviewData.questions,
    },
  });

  const { control, formState } = form;

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "questions",
    keyName: "rhfId",
  });

  const endOfListRef = useRef<HTMLDivElement>(null);
  const prevQuestionLengthRef = useRef(fields.length);

  const handleInputChange = (id: string, newQuestion: FormValues["questions"][number]) => {
    const index = fields.findIndex((f) => f.id === id);
    if (index !== -1) update(index, newQuestion);
  };

  const handleDeleteQuestion = (id: string) => {
    const index = fields.findIndex((f) => f.id === id);
    if (index === -1) return;
    if (fields.length === 1) {
      update(0, { ...fields[0], question: "", followUpCount: 1 });
      return;
    }
    remove(index);
  };

  const handleAddQuestion = () => {
    if (fields.length < interviewData.questionCount) {
      append({ id: crypto.randomUUID(), question: "", followUpCount: 1 });
    }
  };

  const onSave = form.handleSubmit((values) => {
    startTransition(async () => {
      if (mode === "edit" && interviewId) {
        const result = await updateInterview(interviewId, {
          name: interviewData.name,
          objective: interviewData.objective,
          description: values.description,
          questions: values.questions,
          interviewerId: Number(interviewData.interviewerId),
          questionCount: interviewData.questionCount,
          timeDuration: interviewData.timeDuration,
          isAnonymous: interviewData.isAnonymous,
        });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        toast.success("Interview updated successfully.");
        setOpen(false);
      } else {
        const sanitizedInterviewData = {
          ...interviewData,
          questions: values.questions,
          description: values.description,
          interviewerId: interviewData.interviewerId.toString(),
          responseCount: interviewData.responseCount.toString(),
          logoUrl: "",
        };

        const result = await createInterview({ interviewData: sanitizedInterviewData });

        if (!result.success) {
          toast.error(result.error);
          return;
        }

        setOpen(false);
      }
    });
  });

  useEffect(() => {
    if (fields.length > prevQuestionLengthRef.current) {
      endOfListRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevQuestionLengthRef.current = fields.length;
  }, [fields.length]);

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={onSave}>
      {/* Header */}
      <button
        type="button"
        className="flex items-center gap-1 font-semibold text-primary text-sm"
        onClick={() => setProceed(false)}
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      {/* Subtitle */}
      <p className="text-muted-foreground text-sm">
        We will be using these questions during the interviews. Please make sure they are ok.
      </p>

      {/* Questions list with bounded scroll */}
      <ScrollArea className="max-h-72 w-full">
        <div className="flex flex-col gap-3 pr-3">
          {fields.map((field, index) => (
            <InterviewQuestionCard
              key={field.rhfId}
              questionNumber={index + 1}
              questionData={field}
              onDelete={handleDeleteQuestion}
              onQuestionChange={handleInputChange}
            />
          ))}
          <div ref={endOfListRef} />
        </div>
      </ScrollArea>

      {/* Add question button */}
      {fields.length < interviewData.questionCount && (
        <div className="flex justify-center">
          <button
            type="button"
            className="rounded-full opacity-75 hover:opacity-100"
            onClick={handleAddQuestion}
          >
            <Plus size={40} strokeWidth={2.2} className="text-primary" />
          </button>
        </div>
      )}

      {/* Description */}
      <FieldGroup>
        <Controller
          name="description"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>
                Interview Description
                <span className="mt-0.5 block font-light text-muted-foreground text-xs italic">
                  Note: Interviewees will see this description.
                </span>
              </FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  id={field.name}
                  className="resize-none"
                  placeholder="Enter your interview description."
                  rows={3}
                  onBlur={(e) => field.onChange(e.target.value.trim())}
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      {/* Footer */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isPending || fields.length < interviewData.questionCount || !formState.isValid}
          className="bg-primary hover:bg-primary/90"
        >
          {isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
