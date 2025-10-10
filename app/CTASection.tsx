import { Button } from "./button";
import { ArrowRight, MessageCircle, Bot } from "lucide-react";
import Image from "next/image";
import owlMascot from "./catatin.png";

const CTASection = () => {
  return (
    <section
      id="signup"
      className="relative px-10 md:px-37 md:pr-77 py-24 text-center text-white overflow-hidden bg-[#2e2e2e] font-nunito"
    >

      {/* Content */}
      <div className="container mx-auto px-5 text-center relative z-10">
        <div className="max-w-4xl mx-auto">

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center">
  Kirim Aja, <br />
  Biar{" "}
  <Image
    src={owlMascot}
    alt="Catatin.ai"
    className="inline-block align-middle w-35 md:w-62 h-auto animate-bounce-slow drop-shadow-2xl"
  />{" "}
  Yang Urus.
</h2>

          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            <span className="text-3xl font-bold bg-gradient-to-r from-[#0566BD] to-[#A8E063] bg-clip-text text-transparent">
              catatin.ai
            </span> bantu kamu nyatet hal penting tanpa repot — struk, pesan, catatan, semuanya beres otomatis.
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
                href="https://t.me/catatinaics"
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
