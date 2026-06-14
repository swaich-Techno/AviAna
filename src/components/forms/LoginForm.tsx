"use client";

import { useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, LockKeyhole } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginAction } from "@/actions/auth";
import { Button } from "@/components/ui/Button";
import { loginSchema } from "@/lib/validations";

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@avianacollection.in", password: "" }
  });

  const onSubmit = handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginAction(values);
      if (!result.ok) {
        setError("root", { message: result.message });
        return;
      }
      router.push(searchParams.get("next") || "/dashboard");
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {errors.root?.message ? (
        <div className="rounded-md border border-[#f1b8b3] bg-[#fff1ef] p-3 text-sm font-semibold text-[#9d2118]" role="alert">
          {errors.root.message}
        </div>
      ) : null}
      <label className="block space-y-2 text-sm font-semibold text-charcoal">
        Email
        <input
          className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 shadow-line focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email?.message ? <span className="text-xs text-[#9d2118]">{errors.email.message}</span> : null}
      </label>
      <label className="block space-y-2 text-sm font-semibold text-charcoal">
        Password
        <input
          className="min-h-11 w-full rounded-md border border-[#d9c8ac] bg-white px-3 py-2 shadow-line focus:border-wine focus:outline-none focus:ring-2 focus:ring-wine/20"
          type="password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password?.message ? <span className="text-xs text-[#9d2118]">{errors.password.message}</span> : null}
      </label>
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <LockKeyhole className="h-4 w-4" aria-hidden="true" />}
        {pending ? "Checking..." : "Login securely"}
      </Button>
    </form>
  );
}
