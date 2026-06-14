import { ButtonLink } from "@/components/ui/Button";

export function PageHeader({
  title,
  description,
  actionHref,
  actionLabel
}: {
  title: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-gold">Aviana Collection</p>
        <h1 className="mt-2 font-display text-4xl font-semibold text-charcoal md:text-5xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-[#70645c]">{description}</p> : null}
      </div>
      {actionHref && actionLabel ? <ButtonLink href={actionHref}>{actionLabel}</ButtonLink> : null}
    </div>
  );
}
