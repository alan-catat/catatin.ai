import { MessageCircle, Bot, BarChart3, Shield, Zap, Calculator, ArrowBigRight } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: ArrowBigRight,
      title: "AI Agent",
      description: "AI membuat semua pencatatan jadi lebih cepat.",
      color: "text-success"
    },
    {
      icon: Bot,
      title: "Telegram Integration",
      description: "Kirim transaksi langsung melalui Telegram. Cukup ketik dan kami akan mencatat otomatis.",
      color: "text-primary"
    },
    {
      icon: BarChart3,
      title: "Analisis Mendalam",
      description: "Dashboard analitik yang memberikan insight mendalam tentang pola keuangan Anda.",
      color: "text-warning"
    },
    {
      icon: Shield,
      title: "Keamanan Terjamin",
      description: "Data keuangan Anda dienkripsi dengan standar keamanan tingkat bank.",
      color: "text-destructive"
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Sinkronisasi real-time di semua perangkat untuk akses data kapan saja.",
      color: "text-accent"
    },
    {
      icon: Calculator,
      title: "Smart Categorization",
      description: "AI otomatis mengkategorikan transaksi berdasarkan deskripsi dan pola.",
      color: "text-primary-light"
    }
  ];

  return (
    <section id="features" className="mx-auto px-4 md:px-5 md:px-37 md:pr-77 py-16 bg-[#80F2FF] text-slate-800 antialiased">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-black bg-clip-text">
            Fitur Unggulan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Teknologi AI terdepan untuk mengelola keuangan Anda dengan cara yang belum pernah ada sebelumnya
          </p>
        </div>

        <div className="grid mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-25xl md:max-w-6xl md:px-9 px-0">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-4 rounded-2xl bg-white border-l-8 border-l-success hover:shadow-card transition-all duration-300 hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex gap-6 mb-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <div className="flex-grow">
                <h3 className="text-2xl font-bold mb-2 text-black">
                  {feature.title}<br />
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