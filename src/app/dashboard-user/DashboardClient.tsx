"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type Row = {
  group_name?: string;
  group_channel?: string;
  flow_merchant?: string;
  flow_amount?: number;
};

function SummaryCards({ total }: { total: number }) {
  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Total Flow</div>
        <div className="text-2xl font-bold">Rp{total.toLocaleString()}</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Merchants</div>
        <div className="text-2xl font-bold">-</div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Channels</div>
        <div className="text-2xl font-bold">-</div>
      </div>
    </div>
  );
}

export default function DashboardClient() {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_N8N_GETCASHFLOW_URL;

    if (!url) {
      console.error("NEXT_PUBLIC_N8N_GETCASHFLOW_URL belum diset");
      return;
    }

    fetch(url)
      .then((r) => r.json())
      .then((result) => {
        // ✅ pastikan data berupa array
        if (Array.isArray(result)) {
          setData(result);
        } else if (result?.data && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          console.error("Format data tidak sesuai:", result);
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading data…</div>;

  const total = data.reduce((s, r) => s + (r.flow_amount || 0), 0);

  const byChannel = Object.values(
    data.reduce(
      (acc: Record<string, { name: string; amount: number }>, r) => {
        const name = r.group_channel || "Unknown";
        acc[name] ??= { name, amount: 0 };
        acc[name].amount += r.flow_amount || 0;
        return acc;
      },
      {}
    )
  );

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Laporan Bulanan</h1>

      <SummaryCards total={total} />

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Flow by Channel</h2>
        {byChannel.length === 0 ? (
          <div className="text-gray-400 text-sm">Belum ada data.</div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byChannel}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Raw Table</h2>
        <table className="w-full text-left text-sm">
          <thead className="text-gray-500 border-b">
            <tr>
              <th className="p-2">Group</th>
              <th className="p-2">Channel</th>
              <th className="p-2">Merchant</th>
              <th className="p-2">Flow</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i} className="border-b">
                <td className="p-2">{r.group_name}</td>
                <td className="p-2">{r.group_channel}</td>
                <td className="p-2">{r.flow_merchant}</td>
                <td className="p-2">Rp{(r.flow_amount || 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
