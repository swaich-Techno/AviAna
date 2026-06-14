import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  helper,
  icon: Icon
}: {
  label: string;
  value: string;
  helper?: string;
  icon: LucideIcon;
}) {
  return (
    <section className="surface rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#70645c]">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-charcoal">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f8ead0] text-wine">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {helper ? <p className="mt-3 text-sm leading-6 text-[#70645c]">{helper}</p> : null}
    </section>
  );
}
