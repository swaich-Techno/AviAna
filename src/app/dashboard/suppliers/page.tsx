import Link from "next/link";
import { saveSupplierAction } from "@/actions/suppliers";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Field, SelectField, TextArea } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getSupplier, getSuppliers } from "@/lib/data";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SuppliersPage({
  searchParams
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const params = await searchParams;
  const [suppliers, editSupplier] = await Promise.all([getSuppliers(), getSupplier(params.edit)]);

  return (
    <>
      <PageHeader title="Suppliers" description="Manage cloth, fabric, accessory, and packaging suppliers with opening/current balances." />
      {params.saved ? <Notice>Supplier saved.</Notice> : null}
      <form action={saveSupplierAction} className="surface space-y-5 rounded-lg p-4 sm:p-6">
        <input type="hidden" name="id" defaultValue={editSupplier?._id || ""} />
        <div className="flex justify-between gap-3">
          <h2 className="font-display text-3xl font-semibold text-charcoal">{editSupplier ? "Edit supplier" : "Add supplier"}</h2>
          {editSupplier ? <Link className="text-sm font-bold text-wine" href="/dashboard/suppliers">Clear edit</Link> : null}
        </div>
        <div className="form-grid">
          <Field label="Name" name="name" defaultValue={editSupplier?.name} required />
          <Field label="Phone" name="phone" defaultValue={editSupplier?.phone} />
          <Field label="WhatsApp" name="whatsapp" defaultValue={editSupplier?.whatsapp} />
          <Field label="Email" name="email" type="email" defaultValue={editSupplier?.email} />
          <Field label="GST number" name="gstNumber" defaultValue={editSupplier?.gstNumber} />
          <SelectField label="Status" name="status" options={["active", "inactive"]} defaultValue={editSupplier?.status || "active"} />
          <Field label="Opening balance" name="openingBalance" type="number" step="0.01" defaultValue={editSupplier?.openingBalance ?? 0} required />
          <Field label="Current balance" name="currentBalance" type="number" step="0.01" defaultValue={editSupplier?.currentBalance ?? 0} required />
        </div>
        <TextArea label="Address" name="address" defaultValue={editSupplier?.address} />
        <TextArea label="Notes" name="notes" defaultValue={editSupplier?.notes} />
        <SubmitButton>{editSupplier ? "Update supplier" : "Create supplier"}</SubmitButton>
      </form>

      <section className="surface mt-6 rounded-lg p-4">
        <h2 className="font-display text-2xl font-semibold text-charcoal">Supplier ledger snapshot</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Contact</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier: any) => (
                <tr key={supplier._id}>
                  <td data-label="Supplier">
                    <p className="font-bold text-charcoal">{supplier.name}</p>
                    <p className="text-sm text-[#70645c]">{supplier.gstNumber || "GST not set"}</p>
                  </td>
                  <td data-label="Contact">
                    <p className="text-sm">{supplier.phone || "-"}</p>
                    <p className="text-sm">{supplier.email || "-"}</p>
                  </td>
                  <td data-label="Balance" className="font-bold text-wine">
                    {money(supplier.currentBalance)}
                  </td>
                  <td data-label="Status">
                    <StatusBadge tone={supplier.status === "active" ? "success" : "neutral"}>{supplier.status}</StatusBadge>
                  </td>
                  <td data-label="Actions">
                    <Link className="inline-flex min-h-11 items-center rounded-md border border-[#d9c8ac] px-3 text-sm font-bold text-wine" href={`/dashboard/suppliers?edit=${supplier._id}`}>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {!suppliers.length ? (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-[#70645c]">
                    No suppliers yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
