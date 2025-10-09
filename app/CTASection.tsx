import { Button } from "./button";
import { ArrowRight, MessageCircle, Bot } from "lucide-react";
import Image from "next/image";
import owlMascot from "./catatin.png";

const CTASection = () => {
  return (
    <section
      id="signup"
      className="relative py-24 text-center text-white overflow-hidden bg-[#2e2e2e] font-nunito"
    >

      {/* Content */}
      <div className="container mx-auto px-5 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 flex justify-center">
            <Image
              src={owlMascot}
              alt="Catatin.ai"
              className="w-32 h-auto animate-bounce-slow drop-shadow-2xl"
            />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Mau Nyatet
            <span className="block text-white">Gak Pake Ribet?</span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Bergabunglah dengan kami sekarang dan rasakan kemudahan
            mengelola keuangan dengan AI
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild className="text-xl font-semibold bg-success gap-2">
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

            <Button asChild className="text-xl font-semibold bg-primary gap-2">
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
