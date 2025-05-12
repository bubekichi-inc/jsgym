import { Footer } from "../_components/FooterTemp";
import { BenefitsSection } from "./_components/BenefitsSection";
import { CTASection } from "./_components/CTASection";
import { FAQSection } from "./_components/FAQSection";
import { FeaturesSection } from "./_components/FeaturesSection";
import { HeroSection } from "./_components/HeroSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <BenefitsSection />
        <FeaturesSection />
        <CTASection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
