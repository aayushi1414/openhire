"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import type { FeedbackData } from "@/types/response";

enum SatisfactionLevel {
  Positive = "😀",
  Moderate = "😐",
  Negative = "😔",
}

const formSchema = z
  .object({
    satisfaction: z.nativeEnum(SatisfactionLevel).nullable(),
    feedback: z.string(),
  })
  .refine((d) => d.satisfaction !== null || d.feedback.trim().length > 0, {
    message: "Please select a rating or add feedback",
    path: ["satisfaction"],
  });

type FormValues = z.infer<typeof formSchema>;

interface FeedbackFormProps {
  onSubmit: (data: Omit<FeedbackData, "interview_id">) => void;
  email: string;
}

export function FeedbackForm({ onSubmit, email }: FeedbackFormProps) {
  const { control, handleSubmit, setValue, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      satisfaction: SatisfactionLevel.Moderate,
      feedback: "",
    },
  });

  const satisfaction = watch("satisfaction");

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      satisfaction: Object.values(SatisfactionLevel).indexOf(
        values.satisfaction as SatisfactionLevel,
      ),
      feedback: values.feedback,
      email,
    });
  };

  return (
    <form className="p-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <p className="mb-4 font-semibold text-lg">Are you satisfied with the platform?</p>
      <FieldGroup>
        <Field data-invalid={!!formState.errors.satisfaction}>
          <FieldContent>
            <div className="flex justify-center space-x-4">
              {Object.values(SatisfactionLevel).map((emoji) => (
                <button
                  type="button"
                  key={emoji}
                  className={`text-3xl ${satisfaction === emoji ? "rounded border-2 border-primary" : ""}`}
                  onClick={() => setValue("satisfaction", emoji, { shouldValidate: true })}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </FieldContent>
          {formState.errors.satisfaction && (
            <FieldError>{formState.errors.satisfaction.message}</FieldError>
          )}
        </Field>

        <Controller
          control={control}
          name="feedback"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="feedback">Feedback</FieldLabel>
              <FieldContent>
                <Textarea
                  {...field}
                  id="feedback"
                  placeholder="Add your feedback here"
                  aria-invalid={fieldState.invalid}
                />
              </FieldContent>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={!formState.isValid} className="mt-4 w-full">
        Submit Feedback
      </Button>
    </form>
  );
}
