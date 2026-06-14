"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { csvEscape } from "@/lib/utils";

export function CsvExportButton({
  filename,
  rows
}: {
  filename: string;
  rows: Array<Record<string, unknown>>;
}) {
  function exportCsv() {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header])).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button type="button" variant="secondary" onClick={exportCsv} disabled={!rows.length}>
      <Download className="h-4 w-4" aria-hidden="true" />
      Export CSV
    </Button>
  );
}
