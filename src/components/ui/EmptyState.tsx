import { PackageOpen } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="surface rounded-lg p-8 text-center">
      <PackageOpen className="mx-auto h-10 w-10 text-gold" aria-hidden="true" />
      <h2 className="mt-4 font-display text-2xl font-semibold text-charcoal">{title}</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[#70645c]">{description}</p>
      {actionHref && actionLabel ? (
        <ButtonLink href={actionHref} className="mt-5">
          {actionLabel}
        </ButtonLink>
      ) : null}
    </div>
  );
}
