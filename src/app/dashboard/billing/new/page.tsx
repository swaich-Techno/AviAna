import { BillForm } from "@/components/forms/BillForm";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { getInventoryItems } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NewBillPage() {
  const inventory = await getInventoryItems({ type: "finished_good" });

  return (
    <>
      <PageHeader
        title="Create bill"
        description="Add inventory or custom items, auto-calculate totals, reduce stock, and save cost snapshots for profit estimate."
      />
      <BillForm inventory={inventory} />
    </>
  );
}
