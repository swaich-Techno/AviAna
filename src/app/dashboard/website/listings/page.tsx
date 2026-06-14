import Link from "next/link";
import { deleteListingAction, saveWebsiteListingAction, setListingStatusAction } from "@/actions/website";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { ConfirmSubmitButton } from "@/components/ui/ConfirmSubmitButton";
import { Field, SelectField, TextArea } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getAllListings, getListingById } from "@/lib/data";
import { listingCategories } from "@/lib/defaults";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function WebsiteListingsPage({
  searchParams
}: {
  searchParams: Promise<{ saved?: string; updated?: string; deleted?: string; edit?: string }>;
}) {
  const params = await searchParams;
  const [listings, editListing] = await Promise.all([getAllListings(), getListingById(params.edit)]);

  return (
    <>
      <PageHeader title="Collection listings" description="Create public product CMS listings. Public pages show published listings only." />
      {params.saved ? <Notice>Listing saved.</Notice> : null}
      {params.updated ? <Notice>Publishing status updated.</Notice> : null}
      {params.deleted ? <Notice>Listing deleted.</Notice> : null}
      <form action={saveWebsiteListingAction} className="surface space-y-5 rounded-lg p-4 sm:p-6">
        <input type="hidden" name="id" defaultValue={editListing?._id || ""} />
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold text-charcoal">{editListing ? "Edit listing" : "Add listing"}</h2>
            <p className="text-sm text-[#70645c]">Use image URLs, one per line or comma separated.</p>
          </div>
          {editListing ? (
            <Link className="text-sm font-bold text-wine" href="/dashboard/website/listings">
              Clear edit
            </Link>
          ) : null}
        </div>
        <div className="form-grid">
          <Field label="Title" name="title" defaultValue={editListing?.title} required />
          <Field label="Slug" name="slug" defaultValue={editListing?.slug} hint="Leave blank to generate from title." />
          <SelectField label="Category" name="category" options={listingCategories} defaultValue={editListing?.category || listingCategories[0]} required />
          <Field label="Fabric / material" name="fabric" defaultValue={editListing?.fabric} required />
          <Field label="Price" name="price" type="number" min="0" step="0.01" defaultValue={editListing?.price || ""} />
          <SelectField label="Stock status" name="stockStatus" options={["available", "limited", "sold_out"]} defaultValue={editListing?.stockStatus || "available"} />
          <SelectField label="Publish status" name="status" options={["draft", "published"]} defaultValue={editListing?.status || "draft"} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <TextArea label="Description" name="description" defaultValue={editListing?.description} required />
          <TextArea label="Image URLs" name="images" defaultValue={(editListing?.images || []).join("\n")} />
        </div>
        <div className="form-grid">
          <Field label="SEO title" name="seoTitle" defaultValue={editListing?.seoTitle} />
          <Field label="SEO description" name="seoDescription" defaultValue={editListing?.seoDescription} />
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm font-semibold text-charcoal">
            <input type="checkbox" name="showPrice" defaultChecked={editListing?.showPrice} className="h-4 w-4 accent-wine" />
            Show price publicly
          </label>
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-[#d9c8ac] bg-white px-3 text-sm font-semibold text-charcoal">
            <input type="checkbox" name="featured" defaultChecked={editListing?.featured} className="h-4 w-4 accent-wine" />
            Featured on home page
          </label>
        </div>
        <SubmitButton>{editListing ? "Update listing" : "Create listing"}</SubmitButton>
      </form>

      <section className="surface mt-6 rounded-lg p-4">
        <h2 className="font-display text-2xl font-semibold text-charcoal">All CMS listings</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Status</th>
                <th>Price</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing: any) => (
                <tr key={listing._id}>
                  <td data-label="Product">
                    <p className="font-bold text-charcoal">{listing.title}</p>
                    <p className="text-sm text-[#70645c]">{listing.category} · {listing.fabric}</p>
                  </td>
                  <td data-label="Status">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={listing.status === "published" ? "success" : "warning"}>{listing.status}</StatusBadge>
                      {listing.featured ? <StatusBadge tone="wine">featured</StatusBadge> : null}
                    </div>
                  </td>
                  <td data-label="Price">{listing.showPrice ? money(listing.price) : "Hidden"}</td>
                  <td data-label="Updated">{formatDate(listing.updatedAt)}</td>
                  <td data-label="Actions">
                    <div className="flex flex-wrap gap-2">
                      <Link className="inline-flex min-h-11 items-center rounded-md border border-[#d9c8ac] px-3 text-sm font-bold text-wine" href={`/dashboard/website/listings?edit=${listing._id}`}>
                        Edit
                      </Link>
                      <form action={setListingStatusAction}>
                        <input type="hidden" name="id" value={listing._id} />
                        <input type="hidden" name="status" value={listing.status === "published" ? "draft" : "published"} />
                        <ConfirmSubmitButton message="Change public publishing status?">
                          {listing.status === "published" ? "Unpublish" : "Publish"}
                        </ConfirmSubmitButton>
                      </form>
                      <form action={deleteListingAction}>
                        <input type="hidden" name="id" value={listing._id} />
                        <ConfirmSubmitButton variant="danger" message="Delete this listing permanently?">
                          Delete
                        </ConfirmSubmitButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {!listings.length ? (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-[#70645c]">
                    No listings yet.
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
