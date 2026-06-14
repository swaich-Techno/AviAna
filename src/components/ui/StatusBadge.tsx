import { cn } from "@/lib/utils";

export function StatusBadge({
  children,
  tone = "neutral"
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "wine";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-bold capitalize",
        tone === "neutral" && "border-[#ded2c3] bg-white text-[#60564f]",
        tone === "success" && "border-[#d8e2d2] bg-[#f3f8ef] text-[#3f5f37]",
        tone === "warning" && "border-[#ecd7a7] bg-[#fff8e5] text-[#7c5510]",
        tone === "danger" && "border-[#f1b8b3] bg-[#fff1ef] text-[#9d2118]",
        tone === "wine" && "border-[#ead0d5] bg-[#f8eaed] text-wine"
      )}
    >
      {children}
    </span>
  );
}
