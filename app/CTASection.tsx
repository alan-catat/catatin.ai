import { Button } from "./button"; // relative path
import { ArrowRight, Star, MessageCircle, Bot } from "lucide-react";
import Image from "next/image";
import owlMascot from "./catatin.png";

const CTASection = () => {
  return (
    <section id="signup" className="py-10 bg-[#2E2E2E]">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 right-20 w-40 h-40 bg-blue rounded-full animate-float"></div>
        <div
          className="absolute bottom-5 left-20 w-32 h-32 bg-blue rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container mx-auto px-5 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Mascot */}
          <div className="mb-5 flex justify-center">
            <Image
              src={owlMascot}
              alt="Catatin.ai"
              className="w-40 h-14 animate-float drop-shadow-xl"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Mau nyatet
            <span className="block text-white">gak pake ribet?</span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan kami sekarang dan rasakan kemudahan
            mengelola keuangan dengan AI
          </p>

          

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
  <Button asChild className="text-xl font-semibold bg-success">
    <a
      href="https://wa.me/6281118891092"
      target="_blank"
      rel="noopener noreferrer"
    >
      <MessageCircle className="w-5 h-5" />
      WhatsApp
      <ArrowRight className="w-5 h-5" />
    </a>
  </Button>

  <Button asChild className="text-xl font-semibold bg-primary">
    <a
      href="https://t.me/catatin"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Bot className="w-5 h-5" />
      Telegram
      <ArrowRight className="w-5 h-5" />
    </a>
  </Button>
</div>


          
          </div>
        </div>
    </section>
  );
};

export default CTASection;