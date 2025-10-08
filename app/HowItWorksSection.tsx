import { MessageSquare, Brain, PieChart, CheckCircle } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: MessageSquare,
      number: "01",
      title: "Kirim Pesan",
      description: "Kirim detail transaksi melalui WhatsApp atau Telegram. Format bebas, cukup tuliskan seperti bicara normal!",
    },
    {
      icon: Brain,
      number: "02", 
      title: "AI Memproses",
      description: "Sistem AI kami menganalisis pesan, mengekstrak informasi penting dan mengkategorikan otomatis.",
    },
    {
      icon: PieChart,
      number: "03",
      title: "Data Tersimpan",
      description: "Transaksi otomatis tersimpan dan dianalisis untuk memberikan insight keuangan yang berguna.",
    },
    {
      icon: CheckCircle,
      number: "04",
      title: "Laporan Siap",
      description: "Akses laporan lengkap, analisis trend, dan rekomendasi untuk mengoptimalkan keuangan Anda.",
    }
  ];

  return (
    <section id="how" className="py-20 min-h-screen bg-gradient-to-r from-white via-[#B2F7FF] to-[#80F2FF] text-slate-800 antialiased">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-black">
            Catat Praktis 
            <span className="bg-black bg-clip-text"> Laporan otomatis</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hanya 4 langkah sederhana untuk mengelola keuangan dengan AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex items-start gap-4 p-8 rounded-4xl bg-white border-l-8 border-l-success hover:shadow-card transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="relative">
                  
                    <div className="w-15 h-15 rounded-4xl bg-[#80F2FF] flex items-center justify-center absolute -top-2 -right-2">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="text-2xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
              
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute left-8 mt-4 w-0.5 h-12 bg-gradient-primary opacity-30" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 bg-success/10 border border-success/30 rounded-full px-6 py-3 text-success font-medium">
            <CheckCircle className="w-5 h-5" />
            Setup dalam 2 menit - Langsung bisa digunakan!
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;