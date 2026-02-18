"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signIn } from "@/lib/auth/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z.email("Invalid email address").nonempty("Email is required"),
  password: z
    .string()
    .min(8, "Password must be at least 10 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^*])[A-Za-z\d!@#$%^*]+$/,
      "Password must contain at least one letter, one number, and one special character",
    ),
});

export default function SignInPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const { control, formState } = form;
  const { isDirty, isValid, isSubmitting } = formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/",
    });

    if (error) {
      toast.error("Your ID or password is incorrect.", {
        icon: <TriangleAlert className="size-4" />,
      });
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-semibold text-slate-800">
                Open<span className="text-primary font-extrabold">Hire</span>
              </div>
              <Badge variant="secondary" className="text-[10px]">
                Alpha
              </Badge>
            </div>
          </div>
          <Card className="gap-4">
            <CardHeader>
              <CardTitle className="text-center text-xl">Login to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="you@example.com"
                          type="email"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          aria-invalid={fieldState.invalid}
                          placeholder="••••••••"
                          type="password"
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Field>
                    <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
                      Login
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
