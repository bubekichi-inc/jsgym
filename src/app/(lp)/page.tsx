import { BenefitsSection } from "@/app/(lp)/_components/benefits-section";
import { CtaSection } from "@/app/(lp)/_components/cta-section";
import { FaqSection } from "@/app/(lp)/_components/faq-section";
import { FeaturesSection } from "@/app/(lp)/_components/features-section";
import { Footer } from "@/app/(lp)/_components/footer";
import { Header } from "@/app/(lp)/_components/header";
import { HeroSection } from "@/app/(lp)/_components/hero-section";
import { ProblemsSection } from "@/app/(lp)/_components/problems-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <ProblemsSection />
        <FaqSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
