"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: signUpError } = await signUp.email({
      name,
      email,
      password,
      callbackURL: "/",
    });

    if (signUpError) {
      setError(signUpError.message ?? "Sign up failed");
      setLoading(false);
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create your OpenHire Alpha account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Label htmlFor="name">Full name</Label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Jane Doe"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="email">Email</Label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="password">Password</Label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="••••••••"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
