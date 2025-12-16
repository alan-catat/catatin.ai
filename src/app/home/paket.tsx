"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type BillingPlan = {
  id: string;
  package_id: string;
  name: string;
  billing_cycle: "monthly" | "annually";
  harga: number;
  chat: number;
  duration_days: number;
  is_active: boolean;
  features: {
    [key: string]: string | boolean;
  };
};

type Package = {
  id: string;
  name: string;
  harga: number;
  channels: string[];
  input: string[];
  chat: number;
  is_paid: boolean;
  billing_plans: BillingPlan[];
};

export default function Paket() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("monthly");
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
  const [showAllContent, setShowAllContent] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      const sampleData: Package[] = [
        {
          id: "1",
          name: "Biar Kebiasa",
          harga: 0,
          channels: ["Telegram", "Whatsapp"],
          input: ["Foto Struk", "Voice Note", "Transaksi Manual"],
          chat: 10,
          is_paid: false,
          billing_plans: [
            {
              id: "1m",
              package_id: "1",
              name: "Biar Kebiasa",
              billing_cycle: "monthly",
              harga: 0,
              chat: 10,
              duration_days: 30,
              is_active: true,
              features: {
                "Nama Paket": "Biar Kebiasa",
                "Harga per bulan": "Gratis",
                "Kuota Chat": "10",
                "Channel": "Telegram & Whatsapp",
                "Kolaborasi Group": "Telegram Group tidak terbatas",
                "Ekspor Format": "Excel",
                "Insight & Analisis Bulanan": false,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Email"
              },
            },
            {
              id: "1y",
              package_id: "1",
              name: "Biar Kebiasa",
              billing_cycle: "annually",
              harga: 0,
              chat: 10,
              duration_days: 365,
              is_active: true,
              features: {
                "Nama Paket": "Biar Kebiasa",
                "Harga per bulan": "Gratis",
                "Kuota Chat": "10",
                "Channel": "Telegram & Whatsapp",
                "Kolaborasi Group": "Telegram Group tidak terbatas",
                "Ekspor Format": "Excel",
                "Insight & Analisis Bulanan": false,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Email"
              },
            },
          ],
        },
        {
          id: "2",
          name: "Biar Rapi",
          harga: 16500,
          channels: ["Telegram", "Whatsapp"],
          input: ["Foto Struk", "Voice Note", "Transaksi Manual"],
          chat: 500,
          is_paid: true,
          billing_plans: [
            {
              id: "2m",
              package_id: "2",
              name: "Biar Rapi",
              billing_cycle: "monthly",
              harga: 16500,
              chat: 500,
              duration_days: 30,
              is_active: true,
              features: {
                "Nama Paket": "Biar Rapi",
                "Harga per bulan": "Rp 16.500",
                "Kuota Chat": "500",
                "Channel": "Telegram & Whatsapp",
                "Kolaborasi Group": "Telegram Group tidak terbatas",
                "Ekspor Format": "Excel",
                "Insight & Analisis Bulanan": true,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Email & Chat"
              },
            },
            {
              id: "2y",
              package_id: "2",
              name: "Biar Rapi",
              billing_cycle: "annually",
              harga: 164340,
              chat: 6000,
              duration_days: 365,
              is_active: true,
              features: {
                "Nama Paket": "Pro",
                "Harga per Tahun": "Rp 198.000",
                "Kuota Chat": "6.000",
                "Channel": "Telegram & Whatsapp",
                "Kolaborasi Group": "Telegram Group tidak terbatas",
                "Ekspor Format": "Excel",
                "Insight & Analisis Bulanan": true,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Email & Chat"
              },
            },
          ],
        },
        {
          id: "3",
          name: "Biar Tetep On Track",
          harga: 65000,
          channels: ["Telegram", "Whatsapp", "Priority Support"],
          input: ["Foto Struk", "Voice Note", "Transaksi Manual"],
          chat: 2000,
          is_paid: true,
          billing_plans: [
            {
              id: "3m",
              package_id: "3",
              name: "Biar Tetep On Track",
              billing_cycle: "monthly",
              harga: 65000,
              chat: 2000,
              duration_days: 30,
              is_active: true,
              features: {
                "Nama Paket": "Biar Tetep On Track",
                "Harga per bulan": "Rp 65.000",
                "Kuota Chat": "50.000",
                "Channel": "Semua Channel",
                "Kolaborasi Group": true,
                "Ekspor Format": "CSV, Excel, PDF",
                "Insight & Analisis Bulanan": true,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Priority 24/7"
              },
            },
            {
              id: "3y",
              package_id: "3",
              name: "Biar Tetep On Track",
              billing_cycle: "annually",
              harga: 647400,
              chat: 24000,
              duration_days: 365,
              is_active: true,
              features: {
                "Nama Paket": "Biar Tetep On Track",
                "Harga per Tahun": "Rp 780.000",
                "Kuota Chat": "50.000",
                "Channel": "Semua Channel",
                "Kolaborasi Group": true,
                "Ekspor Format": "Excel",
                "Insight & Analisis Bulanan": true,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Priority 24/7"
              },
            },
          ],
        },
        {
          id: "4",
          name: "Biar Sesuai Kamu",
          harga: 0,
          channels: ["custom"],
          input: ["Foto Struk", "Voice Note", "Transaksi Manual"],
          chat: 0,
          is_paid: true,
          billing_plans: [
            {
              id: "4m",
              package_id: "4",
              name: "Biar Sesuai Kamu",
              billing_cycle: "monthly",
              harga: 0,
              chat: 0,
              duration_days: 30,
              is_active: true,
              features: {
                "Nama Paket": "Biar Sesuai Kamu",
                "Harga per bulan": "Custom",
                "Kuota Chat": "Custom",
                "Channel": "Custom",
                "Kolaborasi Group": true,
                "Ekspor Format": "Custom",
                "Insight & Analisis Bulanan": true,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Priority 24/7"
              },
            },
            {
              id: "3y",
              package_id: "3",
              name: "Biar Sesuai Kamu",
              billing_cycle: "annually",
              harga: 0,
              chat: 0,
              duration_days: 365,
              is_active: true,
              features: {
                "Nama Paket": "Biar Sesuai Kamu",
                "Harga per bulan": "Custom",
                "Kuota Chat": "Custom",
                "Channel": "Custom",
                "Kolaborasi Group": true,
                "Ekspor Format": "Custom",
                "Insight & Analisis Bulanan": true,
                "Input": "Foto Struk, Voice Note & Transaksi Manual",
                "Dukungan": "Priority 24/7"
              },
            },
          ],
        },
      ];
      setPackages(sampleData);
      setLoading(false);
    }, 800);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  const allFeatures = [
    "Nama Paket",
    "Harga per bulan",
    "Kuota Chat",
    "Channel",
    "Kolaborasi Group",
    "Ekspor Format",
    "Insight & Analisis Bulanan",
    "Input",
    "Dukungan"
  ];

  return (
    <div className="py-12 md:py-16 bg-[#DFF3FF] text-slate-800 antialiased min-h-screen">
      {/* Hero Section */}
      <section id="paket" className="flex flex-col items-center text-center mt-12 px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
          Kelola Keuangan Jadi Lebih Mudah 💰
        </h2>
        <p className="text-gray-600 max-w-4xl mb-8 text-lg">
          Catat transaksi, pantau arus kas, dan dapatkan insight otomatis. Pilih paket sesuai kebutuhan Anda.
        </p>

        {/* Toggle Monthly / Annually */}
        <div className="flex items-center justify-center space-x-2 bg-white rounded-full p-1 mb-10 shadow-md">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              billingCycle === "monthly"
                ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Bulanan
          </button>
          <button
            onClick={() => setBillingCycle("annually")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
              billingCycle === "annually"
                ? "bg-gradient-to-r from-[#0566BD] to-[#A8E063] text-white shadow-lg"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tahunan
            <span className="ml-2 text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded-full">
              Hemat 15%
            </span>
          </button>
        </div>

<button
  onClick={() => setShowAllContent(!showAllContent)}
  className="mb-8 px-8 py-3 bg-gradient-to-r from-[#0566BD] to-[#A8E063] text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
>
  {showAllContent ? "Sembunyikan Detail Paket" : "Lihat Paket Lengkap →"}
</button>
      </section>

      {/* Pricing Cards */}
      
      <main className="flex-1">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto w-full px-6 mb-16">
          {packages.map((pkg, index) => {
            const plan = pkg.billing_plans.find((bp) => bp.billing_cycle === billingCycle);
            if (!plan) return null;

            const isPro = pkg.name === "Biar Rapi";

            return (
              <div
                key={pkg.id}
                style={{ transitionDelay: `${index * 100}ms` }}
                className={`relative border-2 rounded-2xl p-8 flex flex-col transform transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl ${
                  isPro
                    ? "bg-gradient-to-br from-[#0566BD] to-[#A8E063] text-white border-gradient-to-br from-[#0566BD] to-[#A8E063] shadow-xl scale-105"
                    : "bg-white border-gray-200 shadow-lg"
                }`}
              >
                {isPro && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-yellow-400 text-gray-900 text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                      ⭐ Paling Populer
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                  <p className={`text-sm ${isPro ? "text-blue-100" : "text-gray-500"}`}>
                    {pkg.name === "Biar Kebiasa"
                      ? "Cocok untuk memulai"
                      : pkg.name === "Biar Rapi"
                      ? "Untuk pengguna aktif dan bisnis"
                      : pkg.name === "Biar Tetep On Track"
                      ? "Untuk tim dan usaha skala besar"
                      : "sesuaikan kebutuhanmu"}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center mb-6 py-4">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-extrabold">
                      {pkg.name === "Biar Sesuai Kamu"
      ? "Custom"
      : plan.harga === 0 && pkg.name === "Biar Kebiasa" 
      ? "Free" 
      : billingCycle === "annually" && (pkg.name === "Biar Rapi" || pkg.name === "Biar Tetep On Track")
    ? `Rp${Math.round(plan.harga * 0.85).toLocaleString("id-ID")}`
    : `Rp${plan.harga.toLocaleString("id-ID")}`}
                      </span>
                  </div>
                  <span className={`text-sm mt-1 ${isPro ? "text-blue-100" : "text-gray-500"}`}>
                    /{billingCycle === "monthly" ? "bulan" : "tahun"}
                  </span>
                  {billingCycle === "annually" && plan.harga > 0 && pkg.name !== "Biar Sesuai Kamu" && (
  <div className={`text-xs mt-2 ${isPro ? "text-blue-100" : "text-gray-500"}`}>
    <span className="line-through opacity-70">
      Rp{Math.round((plan.harga / 0.85) / 12).toLocaleString("id-ID")}/bulan
    </span>
    <span className="ml-2 font-bold">
      ~Rp{Math.round(plan.harga / 12).toLocaleString("id-ID")}/bulan
    </span>
  </div>
                  )}
                </div>

                <div className="space-y-4 flex-1">
                  <div className={`p-3 rounded-lg ${isPro ? "bg-white/10" : "bg-gray-50"}`}>
                    <div className="text-sm font-semibold mb-2">Kuota Chat</div>
                    <div className="text-xl font-bold">{pkg.name === "Biar Sesuai Kamu" 
      ? "Custom" 
      : `${plan.chat.toLocaleString("id-ID")} pesan`}</div>
                  </div>

                  <div>
                    <div className="text-sm font-semibold mb-2">Channel</div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.channels.map((ch, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isPro
                              ? "bg-white/20 text-white"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                </div>
                <div>
                    <div className="text-sm font-semibold mb-2">Input</div>
                    <div className="flex flex-wrap gap-2">
                      {pkg.input.map((ch, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 text-xs font-medium rounded-full ${
                            isPro
                              ? "bg-white/20 text-white"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                </div>

              {showAllContent && (
                <>
                  <div>
                    <div className="text-sm font-semibold mb-3">Fitur Unggulan</div>
                    <ul className="space-y-2 text-sm">
                      {pkg.name === "Biar Sesuai Kamu"
                      ? "Custom"
                      : Object.entries(plan.features)
                        .filter(([key]) => !["Nama Paket", "Harga per bulan", "Kuota Chat", "Channel", "Dukungan"].includes(key))
                        .map(([key, value], i) => {
                          const isAvailable = typeof value === 'boolean' ? value : true;
                          return (
                            <li key={i} className="flex items-start gap-2">
                              <span className={isAvailable ? "text-green-500" : isPro ? "text-blue-200" : "text-gray-300"}>
                                {isAvailable ? "✓" : "—"}
                              </span>
                              <span className={isAvailable ? "" : "opacity-50"}>{key}</span>
                            </li>
                          );
                        })}
                    </ul>
                  </div>

                  <Link href={`/subscription?package=${pkg.id}&plan=${pkg.name}&billing=${billingCycle}&price=${plan.harga}`}
                    className={`mt-6 w-full py-3 px-6 rounded-lg font-semibold transition-all text-center block ${
                      isPro
                        ? "bg-white text-blue-600 hover:bg-gray-100 shadow-lg"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-md"
                    }`}
                  >
                    {pkg.is_paid ? "Pilih Paket" : "Mulai Gratis"}
                  </Link>
                </>
              )}
                </div>
              </div>
            );
          })}
      </div>

      {showAllContent && (
        <section className="max-w-7xl mx-auto w-full px-6 mb-20">
          <h3 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Bandingkan Semua Fitur
          </h3>
          <div className="overflow-x-auto rounded-xl shadow-xl border border-gray-200">
            <table className="min-w-full bg-white text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  <th className="p-4 text-left font-semibold">Fitur</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="p-4 text-center font-semibold min-w-[150px]">
                      {pkg.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, idx) => (
                  <tr
                    key={idx}
                    className={`border-t ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition`}
                  >
                    <td className="p-4 font-medium text-gray-700">{feature}</td>
                    {packages.map((pkg) => {
                      const plan = pkg.billing_plans.find(
                        (bp) => bp.billing_cycle === billingCycle
                      );
                      const value = plan?.features[feature];

                      return (
                        <td key={pkg.id} className="p-4 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <span className="text-green-500 font-bold text-lg">✓</span>
                            ) : (
                              <span className="text-gray-300">—</span>
                            )
                          ) : (
                            <span className="text-gray-700 font-medium">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </main>
    </div>
  );
}