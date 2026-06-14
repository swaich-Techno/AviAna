import { changePasswordAction, createOwnerAction } from "@/actions/settings";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { Field } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getSession } from "@/lib/auth";
import { getUsers } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SettingsPage({
  searchParams
}: {
  searchParams: Promise<{ owner?: string; password?: string; error?: string }>;
}) {
  const [params, session, users] = await Promise.all([searchParams, getSession(), getUsers()]);
  const isSuperAdmin = session?.role === "SUPER_ADMIN";

  return (
    <>
      <PageHeader title="Settings" description="Manage owner access and change your password. Public business settings live under Website CMS." />
      {params.owner ? <Notice>Owner user created.</Notice> : null}
      {params.password ? <Notice>Password changed.</Notice> : null}
      {params.error ? <Notice type="error">Could not complete the settings action. Check duplicate users or current password.</Notice> : null}

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="surface rounded-lg p-4 sm:p-6">
          <h2 className="font-display text-3xl font-semibold text-charcoal">Change password</h2>
          <form action={changePasswordAction} className="mt-4 space-y-4">
            <Field label="Current password" name="currentPassword" type="password" autoComplete="current-password" required />
            <Field label="New password" name="newPassword" type="password" autoComplete="new-password" required hint="Use at least 10 characters." />
            <SubmitButton>Update password</SubmitButton>
          </form>
        </section>

        {isSuperAdmin ? (
          <section className="surface rounded-lg p-4 sm:p-6">
            <h2 className="font-display text-3xl font-semibold text-charcoal">Add owner user</h2>
            <form action={createOwnerAction} className="mt-4 space-y-4">
              <Field label="Name" name="name" required />
              <Field label="Email" name="email" type="email" required />
              <Field label="Temporary password" name="password" type="password" required hint="Owner should change this after first login." />
              <SubmitButton>Create owner</SubmitButton>
            </form>
          </section>
        ) : (
          <section className="surface rounded-lg p-4 sm:p-6">
            <h2 className="font-display text-3xl font-semibold text-charcoal">Owner permissions</h2>
            <p className="mt-3 text-sm leading-6 text-[#70645c]">
              Owner users can manage ERP modules, inventory, billing, suppliers, purchases, expenses, and reports. Super Admin-only website publishing and user creation remain protected.
            </p>
          </section>
        )}
      </div>

      <section className="surface mt-6 rounded-lg p-4">
        <h2 className="font-display text-2xl font-semibold text-charcoal">Users</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td data-label="User">
                    <p className="font-bold text-charcoal">{user.name}</p>
                    <p className="text-sm text-[#70645c]">{user.email}</p>
                  </td>
                  <td data-label="Role">
                    <StatusBadge tone={user.role === "SUPER_ADMIN" ? "wine" : "neutral"}>{user.role.replace("_", " ")}</StatusBadge>
                  </td>
                  <td data-label="Status">
                    <StatusBadge tone={user.status === "active" ? "success" : "neutral"}>{user.status}</StatusBadge>
                  </td>
                  <td data-label="Last login">{formatDate(user.lastLoginAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
