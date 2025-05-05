import { Footer } from "../_components/Footer";
import { BenefitsSection } from "./_components/BenefitsSection";
import { HeroSection } from "./_components/HeroSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
