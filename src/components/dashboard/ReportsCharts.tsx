"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

export function ReportsCharts({ data }: { data: any[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="surface rounded-lg p-4">
        <h2 className="font-display text-2xl font-semibold text-charcoal">Sales and profit</h2>
        <p className="mb-4 mt-1 text-sm text-[#70645c]">Monthly sales and estimated profit from bills.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#eadfce" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#70645c" />
              <YAxis stroke="#70645c" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#6F1D2D" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="profit" stroke="#66785F" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="surface rounded-lg p-4">
        <h2 className="font-display text-2xl font-semibold text-charcoal">Expenses</h2>
        <p className="mb-4 mt-1 text-sm text-[#70645c]">Monthly expenses against business activity.</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid stroke="#eadfce" strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#70645c" />
              <YAxis stroke="#70645c" />
              <Tooltip />
              <Legend />
              <Bar dataKey="expenses" fill="#B9852E" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
