"use client";

import {
  MessageCircle,
  Bot,
  BarChart3,
  Shield,
  Zap,
  Calculator,
  ArrowBigRight,
} from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: ArrowBigRight,
      title: "AI Agent",
      description: "AI membuat semua pekerjaan jadi lebih cepat.",
      color: "text-success",
    },
    {
      icon: Bot,
      title: "Telegram Integration",
      description:
        "Kirim transaksi langsung melalui Telegram. Cukup ketik dan kami akan mencatat otomatis.",
      color: "text-primary",
    },
    {
      icon: BarChart3,
      title: "Analisis Mendalam",
      description:
        "Dashboard analitik yang memberikan insight mendalam tentang pola keuangan Anda.",
      color: "text-warning",
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description:
        "Data keuangan Anda dienkripsi dengan standar keamanan tingkat bank.",
      color: "text-destructive",
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description:
        "Sinkronisasi real-time di semua perangkat untuk akses data kapan saja.",
      color: "text-accent",
    },
    {
      icon: Calculator,
      title: "Smart Categorization",
      description:
        "AI otomatis mengkategorikan transaksi berdasarkan deskripsi dan pola.",
      color: "text-primary-light",
    },
  ];

  return (
    <section
      id="features"
      className="py-12 md:py-16 bg-[#80F2FF] text-slate-800 antialiased"
    >
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-black">
            Fitur Unggulan
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Teknologi AI terdepan untuk mengelola keuangan Anda dengan cara yang
            belum pernah ada sebelumnya
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 md:p-8 rounded-2xl bg-white border-l-8 border-l-success hover:shadow-card hover:-translate-y-2 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 md:gap-6">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className={`w-6 h-6 md:w-8 md:h-8 ${feature.color}`} />
                </div>

                <div className="flex-grow">
                  <h3 className="text-lg md:text-xl font-bold mb-2 text-black">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
