"use client";

import { Button } from "@/components/ui/Button";

export function ConfirmSubmitButton({
  children,
  message,
  variant = "secondary"
}: {
  children: React.ReactNode;
  message: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <Button
      type="submit"
      variant={variant}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </Button>
  );
}
