import { Questions } from "@/app/(lp)/_components/Questions";
import { BenefitsSection } from "@/app/(lp)/_components/benefits-section";
import { CtaSection } from "@/app/(lp)/_components/cta-section";
import { FaqSection } from "@/app/(lp)/_components/faq-section";
import { FeaturesSection } from "@/app/(lp)/_components/features-section";
import { Footer } from "@/app/(lp)/_components/footer";
import { HeroSection } from "@/app/(lp)/_components/hero-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <Questions limit={24} />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
