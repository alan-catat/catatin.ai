import { Button } from "./button"; // relative path
import { ArrowRight, Star, MessageCircle, Bot } from "lucide-react";
import Image from "next/image";
import owlMascot from "./catatin.png";

const CTASection = () => {
  return (
    <section className="py-5 bg-gradient-to-t from-white via-[#B2F7FF] to-[#80F2FF]">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-5 right-20 w-40 h-40 bg-blue rounded-full animate-float"></div>
        <div
          className="absolute bottom-5 left-20 w-32 h-32 bg-blue rounded-full animate-float"
          style={{ animationDelay: "1.5s" }}
        ></div>
      </div>

      <div className="container mx-auto px-10 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Mascot */}
          <div className="mb-2 flex justify-center">
            <Image
              src={owlMascot}
              alt="Catatin.ai"
              className="w-74 h-74 animate-float drop-shadow-xl"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-black mb-6">
            Mau nyatet
            <span className="block text-black">gak pake ribet?</span>
          </h2>

          <p className="text-xl md:text-2xl text-black/90 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan kami sekarang dan rasakan kemudahan
            mengelola keuangan dengan AI
          </p>

          

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button className="text-xl font-semibold bg-success">
              <MessageCircle className="w-5 h-5" />
              WhatsApp
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button className="text-xl font-semibold bg-primary">
              <Bot className="w-5 h-5" />
              Telegram
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>

          
          </div>
        </div>
    </section>
  );
};

export default CTASection;