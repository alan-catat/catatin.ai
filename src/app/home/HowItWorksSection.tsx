"use client";

import { MessageSquare, Brain, PieChart, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: MessageSquare,
      number: "01",
      title: "Kirim Pesan",
      description:
        "Kirim detail transaksi melalui Telegram. Format bebas, cukup tuliskan seperti bicara normal!",
    },
    {
      icon: Brain,
      number: "02",
      title: "AI Memproses",
      description:
        "Sistem AI kami menganalisis pesan, mengekstrak informasi penting dan mengkategorikan otomatis.",
    },
    {
      icon: PieChart,
      number: "03",
      title: "Data Tersimpan",
      description:
        "Transaksi otomatis tersimpan dan dianalisis untuk memberikan gambaran keuangan yang lebih jelas.",
    },
    {
      icon: CheckCircle,
      number: "04",
      title: "Laporan Siap",
      description:
        "Akses laporan lengkap, analisis trend, dan rekomendasi untuk mengoptimalkan keuangan Anda.",
    },
  ];

  return (
    <section
      id="how"
      className="py-12 md:py-16 bg-[#DFF3FF] text-slate-800 antialiased"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-black">
            Catat Praktis{" "}
            <span className="bg-black bg-clip-text">Laporan otomatis</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Hanya 4 langkah sederhana untuk mengelola keuangan dengan AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative flex flex-col md:flex-row items-start gap-4 p-6 rounded-2xl bg-white border-l-8 border-l-success hover:shadow-card transition-all duration-300"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-[#80F2FF] flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
              </div>

              <div className="flex-grow">
                <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute bottom-0 left-6 w-0.5 h-10 bg-gradient-primary opacity-30"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
