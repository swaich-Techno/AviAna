import { CheckCircle2, CircleAlert } from "lucide-react";

export function Notice({ type = "success", children }: { type?: "success" | "error"; children: React.ReactNode }) {
  const Icon = type === "success" ? CheckCircle2 : CircleAlert;
  return (
    <div
      className={
        type === "success"
          ? "mb-4 flex items-start gap-2 rounded-md border border-[#d8e2d2] bg-[#f3f8ef] p-3 text-sm font-semibold text-[#3f5f37]"
          : "mb-4 flex items-start gap-2 rounded-md border border-[#f1b8b3] bg-[#fff1ef] p-3 text-sm font-semibold text-[#9d2118]"
      }
      role={type === "error" ? "alert" : "status"}
    >
      <Icon className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
      {children}
    </div>
  );
}
