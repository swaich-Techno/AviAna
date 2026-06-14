import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-wine text-white shadow-line hover:bg-maroon",
        variant === "secondary" && "border border-[#d9c8ac] bg-white text-charcoal hover:border-gold hover:text-wine",
        variant === "ghost" && "text-wine hover:bg-[#f6e7dc]",
        variant === "danger" && "bg-[#b42318] text-white hover:bg-[#8f1c13]",
        className
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
};

export function ButtonLink({ className, variant = "primary", ...props }: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        "inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variant === "primary" && "bg-wine text-white shadow-line hover:bg-maroon",
        variant === "secondary" && "border border-[#d9c8ac] bg-white text-charcoal hover:border-gold hover:text-wine",
        variant === "ghost" && "text-wine hover:bg-[#f6e7dc]",
        variant === "danger" && "bg-[#b42318] text-white hover:bg-[#8f1c13]",
        className
      )}
      {...props}
    />
  );
}
