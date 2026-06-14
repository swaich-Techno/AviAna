import { saveExpenseAction } from "@/actions/expenses";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { CsvExportButton } from "@/components/forms/CsvExportButton";
import { Field, SelectField, TextArea } from "@/components/ui/Field";
import { Notice } from "@/components/ui/Notice";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { getExpenses } from "@/lib/data";
import { formatDate, money } from "@/lib/utils";

export const dynamic = "force-dynamic";

const categories = ["rent", "salary", "electricity", "transport", "marketing", "repair", "packaging", "other"];
const modes = ["cash", "upi", "card", "bank", "credit"];

export default async function ExpensesPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const [params, expenses] = await Promise.all([searchParams, getExpenses()]);

  return (
    <>
      <PageHeader title="Expenses" description="Track daily and monthly business expenses by category and payment mode." />
      {params.saved ? <Notice>Expense saved.</Notice> : null}
      <form action={saveExpenseAction} className="surface space-y-5 rounded-lg p-4 sm:p-6">
        <div className="form-grid">
          <Field label="Title" name="title" required />
          <SelectField label="Category" name="category" options={categories} defaultValue="other" required />
          <Field label="Amount" name="amount" type="number" step="0.01" min="0" required />
          <Field label="Expense date" name="expenseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required />
          <SelectField label="Payment mode" name="paymentMode" options={modes} defaultValue="cash" required />
        </div>
        <TextArea label="Notes" name="notes" />
        <SubmitButton>Add expense</SubmitButton>
      </form>

      <section className="surface mt-6 rounded-lg p-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="font-display text-2xl font-semibold text-charcoal">Expense history</h2>
          <CsvExportButton filename="aviana-expenses.csv" rows={expenses.map((expense: any) => ({
            date: formatDate(expense.expenseDate),
            title: expense.title,
            category: expense.category,
            amount: expense.amount,
            paymentMode: expense.paymentMode
          }))} />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense: any) => (
                <tr key={expense._id}>
                  <td data-label="Date">{formatDate(expense.expenseDate)}</td>
                  <td data-label="Title">{expense.title}</td>
                  <td data-label="Category" className="capitalize">{expense.category}</td>
                  <td data-label="Amount" className="font-bold text-wine">{money(expense.amount)}</td>
                  <td data-label="Payment" className="capitalize">{expense.paymentMode}</td>
                </tr>
              ))}
              {!expenses.length ? (
                <tr>
                  <td colSpan={5} className="text-center text-sm text-[#70645c]">
                    No expenses yet.
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
