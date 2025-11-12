"use client";

import { useEffect, useState, forwardRef } from "react";
import { useAlert } from "@/components/ui/alert/Alert";
import { StatCard } from "@/components/dashboard/StatCard";
import { PieCart } from "@/components/charts/pie/PieCart";
import { Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign } from "lucide-react";
import { USER_OVERVIEWS } from "@/config/variables";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Category {
  id: string;
  name: string;
}

interface CashFlow {
  id: string;
  flow_type: "income" | "expense";
  flow_amount: number;
  created_at: string;
  user_id: string;
  category: Category;
}

export default function DashboardUser() {
  const { setAlertData } = useAlert();

  const [loading, setLoading] = useState(true);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [stats, setStats] = useState<any>({});
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");

  // Warna dan ikon (optional)
  const colors = ["text-blue-500", "text-green-500", "text-purple-500", "text-orange-500", "text-pink-500"];
  const icons = [Wallet, ShoppingBag, Briefcase, CreditCard, DollarSign];

  // Custom input utk DatePicker (tombol bukan input)
  const CustomInput = forwardRef(({ value, onClick }: any, ref: any) => (
    <button
      onClick={onClick}
      ref={ref}
      className="border rounded-lg px-3 py-2 dark:text-gray-400 w-full sm:w-auto text-left"
    >
      {value || "Select period"}
    </button>
  ));
  CustomInput.displayName = "CustomInput";

  // === Generate daftar bulan ===
  function generatePeriods() {
    const now = new Date();
    const periods: string[] = [];
    for (let i = 0; i < 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toLocaleString("en-US", { month: "long" });
      const year = d.getFullYear();
      periods.push(`${month} ${year}`);
    }
    return periods.reverse();
  }

  // === Grouping kategori ===
  function groupByCategory(data: CashFlow[], type: "income" | "expense") {
    const grouped: Record<string, number> = {};
    data
      .filter((d) => d.flow_type === type)
      .forEach((row) => {
        const cat = row.category?.name || "Other";
        grouped[cat] = (grouped[cat] || 0) + Math.abs(row.flow_amount);
      });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }

  // === POST ke n8n (utk filter per user & periode) ===
  async function fetchCashFlows(period?: string) {
    try {
      const storedEmail = typeof window !== "undefined" ? localStorage.getItem("user_email") : null;
      if (!storedEmail) {
        console.warn("Email user tidak ditemukan di localStorage");
        return [];
      }

      const url = process.env.NEXT_PUBLIC_N8N_GETCASHFLOW_URL;
      if (!url) throw new Error("NEXT_PUBLIC_N8N_GETCASHFLOW_URL");

      const res = await fetch(`${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedEmail,
          period: period || selectedPeriod,
        }),
      });

      if (!res.ok) throw new Error("Gagal fetch data dari n8n");
      const result = await res.json();

      const formatted: CashFlow[] = (Array.isArray(result) ? result : result.data || []).map(
        (r: any, i: number) => ({
          id: String(i),
          flow_type: r.flow_type || (Number(r.flow_amount) >= 0 ? "income" : "expense"),
          flow_amount: Math.abs(Number(r.flow_amount)) || 0,
          created_at: new Date().toISOString(),
          user_id: storedEmail,
          category: { id: r.group_channel, name: r.group_channel || "Unknown" },
        })
      );

      setCashFlows(formatted);
      return formatted;
    } catch (err) {
      console.error(err);
      setCashFlows([]);
      return [];
    }
  }

  // === Hitung statistik ===
  function calculateStats(data: CashFlow[]) {
    const totalIncome = data.filter((f) => f.flow_type === "income").reduce((a, b) => a + b.flow_amount, 0);
    const totalExpense = data.filter((f) => f.flow_type === "expense").reduce((a, b) => a + b.flow_amount, 0);
    const balance = totalIncome - totalExpense;

    const incomeData = groupByCategory(data, "income");
    const expenseData = groupByCategory(data, "expense");

    return { balance, totalIncome, totalExpense, entries: data.length, incomeData, expenseData };
  }

  // === INIT pertama ===
  useEffect(() => {
    const init = async () => {
      const p = generatePeriods();
      setPeriods(p);
      const flows = await fetchCashFlows(p[p.length - 1]);
      setSelectedPeriod(p[p.length - 1]);
      setStats(calculateStats(flows));
      setLoading(false);
    };
    init();
  }, []);

  // === Update saat period berganti ===
  useEffect(() => {
    if (!selectedPeriod) return;
    (async () => {
      const flows = await fetchCashFlows(selectedPeriod);
      setStats(calculateStats(flows));
    })();
  }, [selectedPeriod]);

  if (loading) return <div className="text-center mt-10">Memuat dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <DatePicker
            selected={
              selectedPeriod
                ? new Date(`${selectedPeriod.split(" ")[0]} 1, ${selectedPeriod.split(" ")[1]}`)
                : null
            }
            onChange={(date) => {
              if (!date) return;
              const month = date.toLocaleString("en-US", { month: "long" });
              const year = date.getFullYear();
              setSelectedPeriod(`${month} ${year}`);
            }}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            customInput={<CustomInput />}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={USER_OVERVIEWS.totalBalance.title} value={`Rp${(stats.balance || 0).toLocaleString()}`} />
        <StatCard title={USER_OVERVIEWS.totalIncome.title} value={`Rp${(stats.totalIncome || 0).toLocaleString()}`} />
        <StatCard title={USER_OVERVIEWS.totalExpense.title} value={`Rp${(stats.totalExpense || 0).toLocaleString()}`} />
        <StatCard title={USER_OVERVIEWS.entries.title} value={stats.entries || 0} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieCart title={USER_OVERVIEWS.incomeChartBreakdown.title} data={stats.incomeData || []} total={stats.totalIncome || 0} />
        <PieCart title={USER_OVERVIEWS.expenseChartBreakdown.title} data={stats.expenseData || []} total={stats.totalExpense || 0} />
      </div>
    </div>
  );
}
