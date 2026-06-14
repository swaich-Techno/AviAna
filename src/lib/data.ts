import { Types } from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { defaultSiteSettings } from "@/lib/defaults";
import { toPlain } from "@/lib/utils";
import Bill from "@/models/Bill";
import Expense from "@/models/Expense";
import InventoryItem from "@/models/InventoryItem";
import InventoryMovement from "@/models/InventoryMovement";
import Purchase from "@/models/Purchase";
import SiteSettings from "@/models/SiteSettings";
import Supplier from "@/models/Supplier";
import User from "@/models/User";
import WebsiteListing from "@/models/WebsiteListing";

async function hasDatabase() {
  if (!process.env.MONGODB_URI) return false;
  await connectToDatabase();
  return true;
}

export async function getSiteSettings() {
  if (!(await hasDatabase())) {
    return defaultSiteSettings;
  }

  const settings = await SiteSettings.findOne().lean();
  return toPlain({ ...defaultSiteSettings, ...(settings || {}) });
}

export async function getOrCreateSiteSettings() {
  await connectToDatabase();
  const settings = await SiteSettings.findOneAndUpdate(
    {},
    { $setOnInsert: defaultSiteSettings },
    { new: true, upsert: true }
  ).lean();

  return toPlain(settings);
}

export async function getPublishedListings(options?: {
  category?: string;
  query?: string;
  featured?: boolean;
  limit?: number;
}) {
  if (!(await hasDatabase())) return [];

  const filter: Record<string, unknown> = { status: "published" };
  if (options?.featured !== undefined) filter.featured = options.featured;
  if (options?.category) filter.category = options.category;
  if (options?.query) {
    filter.$or = [
      { title: { $regex: options.query, $options: "i" } },
      { category: { $regex: options.query, $options: "i" } },
      { fabric: { $regex: options.query, $options: "i" } }
    ];
  }

  const query = WebsiteListing.find(filter).sort({ featured: -1, createdAt: -1 });
  if (options?.limit) query.limit(options.limit);
  return toPlain(await query.lean());
}

export async function getListingBySlug(slug: string, publishedOnly = true) {
  if (!(await hasDatabase())) return null;
  const filter: Record<string, unknown> = { slug };
  if (publishedOnly) filter.status = "published";
  return toPlain(await WebsiteListing.findOne(filter).lean());
}

export async function getAllListings() {
  await connectToDatabase();
  return toPlain(await WebsiteListing.find().sort({ createdAt: -1 }).lean());
}

export async function getListingById(id?: string) {
  if (!id || !Types.ObjectId.isValid(id)) return null;
  await connectToDatabase();
  return toPlain(await WebsiteListing.findById(id).lean());
}

export async function getInventoryItems(filter?: { query?: string; category?: string; type?: string }) {
  await connectToDatabase();
  const where: Record<string, unknown> = {};
  if (filter?.category) where.category = filter.category;
  if (filter?.type) where.type = filter.type;
  if (filter?.query) {
    where.$or = [
      { itemName: { $regex: filter.query, $options: "i" } },
      { sku: { $regex: filter.query, $options: "i" } },
      { category: { $regex: filter.query, $options: "i" } }
    ];
  }

  return toPlain(await InventoryItem.find(where).sort({ updatedAt: -1 }).lean());
}

export async function getInventoryItem(id?: string) {
  if (!id || !Types.ObjectId.isValid(id)) return null;
  await connectToDatabase();
  return toPlain(await InventoryItem.findById(id).lean());
}

export async function getInventoryMovements(itemId?: string) {
  await connectToDatabase();
  const where = itemId && Types.ObjectId.isValid(itemId) ? { inventoryItemId: itemId } : {};
  return toPlain(await InventoryMovement.find(where).sort({ createdAt: -1 }).limit(60).lean());
}

export async function getSuppliers() {
  await connectToDatabase();
  return toPlain(await Supplier.find().sort({ name: 1 }).lean());
}

export async function getSupplier(id?: string) {
  if (!id || !Types.ObjectId.isValid(id)) return null;
  await connectToDatabase();
  return toPlain(await Supplier.findById(id).lean());
}

export async function getPurchases() {
  await connectToDatabase();
  return toPlain(
    await Purchase.find().populate("supplierId", "name").sort({ purchaseDate: -1, createdAt: -1 }).limit(100).lean()
  );
}

export async function getBills(filter?: { query?: string }) {
  await connectToDatabase();
  const where: Record<string, unknown> = {};
  if (filter?.query) {
    where.$or = [
      { billNumber: { $regex: filter.query, $options: "i" } },
      { customerName: { $regex: filter.query, $options: "i" } },
      { customerPhone: { $regex: filter.query, $options: "i" } }
    ];
  }
  return toPlain(await Bill.find(where).sort({ billDate: -1, createdAt: -1 }).limit(120).lean());
}

export async function getBill(id: string) {
  if (!Types.ObjectId.isValid(id)) return null;
  await connectToDatabase();
  return toPlain(await Bill.findById(id).lean());
}

export async function getExpenses() {
  await connectToDatabase();
  return toPlain(await Expense.find().sort({ expenseDate: -1, createdAt: -1 }).limit(120).lean());
}

export async function getUsers() {
  await connectToDatabase();
  return toPlain(await User.find().select("-passwordHash").sort({ createdAt: -1 }).lean());
}

export async function getDashboardSummary() {
  await connectToDatabase();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayBills, monthlyBills, monthlyExpenses, inventoryItems, lowStockItems, suppliers, recentBills, recentPurchases] =
    await Promise.all([
      Bill.find({ billDate: { $gte: today } }).lean(),
      Bill.find({ billDate: { $gte: monthStart } }).lean(),
      Expense.find({ expenseDate: { $gte: monthStart } }).lean(),
      InventoryItem.find({ status: "active" }).lean(),
      InventoryItem.find({ $expr: { $lte: ["$currentStock", "$lowStockAlertQty"] }, status: "active" })
        .sort({ currentStock: 1 })
        .limit(8)
        .lean(),
      Supplier.find({ status: "active" }).lean(),
      Bill.find().sort({ createdAt: -1 }).limit(6).lean(),
      Purchase.find().populate("supplierId", "name").sort({ createdAt: -1 }).limit(6).lean()
    ]);

  const sum = (items: any[], key: string) => items.reduce((total, item) => total + Number(item[key] || 0), 0);

  return toPlain({
    todaySales: sum(todayBills, "grandTotal"),
    monthlySales: sum(monthlyBills, "grandTotal"),
    monthlyProfit: sum(monthlyBills, "profitEstimate"),
    monthlyExpenses: sum(monthlyExpenses, "amount"),
    inventoryValue: inventoryItems.reduce(
      (total, item: any) => total + Number(item.currentStock || 0) * Number(item.purchasePrice || 0),
      0
    ),
    lowStockCount: lowStockItems.length,
    lowStockItems,
    supplierPendingBalance: sum(suppliers, "currentBalance"),
    recentBills,
    recentPurchases
  });
}

export async function getReportsData() {
  await connectToDatabase();
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const [bills, expenses, inventoryItems, suppliers] = await Promise.all([
    Bill.find({ billDate: { $gte: start } }).lean(),
    Expense.find({ expenseDate: { $gte: start } }).lean(),
    InventoryItem.find().lean(),
    Supplier.find().lean()
  ]);

  const monthKey = (date: Date) =>
    new Intl.DateTimeFormat("en-IN", { month: "short", year: "2-digit" }).format(new Date(date));
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return monthKey(date);
  });

  const chart = months.map((month) => {
    const monthBills = bills.filter((bill: any) => monthKey(bill.billDate) === month);
    const monthExpenses = expenses.filter((expense: any) => monthKey(expense.expenseDate) === month);
    return {
      month,
      sales: monthBills.reduce((total: number, bill: any) => total + Number(bill.grandTotal || 0), 0),
      profit: monthBills.reduce((total: number, bill: any) => total + Number(bill.profitEstimate || 0), 0),
      expenses: monthExpenses.reduce((total: number, expense: any) => total + Number(expense.amount || 0), 0)
    };
  });

  const topSelling = new Map<string, number>();
  for (const bill of bills as any[]) {
    for (const item of bill.items || []) {
      topSelling.set(item.itemNameSnapshot, (topSelling.get(item.itemNameSnapshot) || 0) + Number(item.quantity || 0));
    }
  }

  return toPlain({
    chart,
    lowStock: inventoryItems.filter((item: any) => Number(item.currentStock) <= Number(item.lowStockAlertQty)),
    valuation: inventoryItems.reduce(
      (total: number, item: any) => total + Number(item.currentStock || 0) * Number(item.purchasePrice || 0),
      0
    ),
    supplierPayable: suppliers.reduce((total: number, supplier: any) => total + Number(supplier.currentBalance || 0), 0),
    topSelling: Array.from(topSelling.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10)
  });
}
