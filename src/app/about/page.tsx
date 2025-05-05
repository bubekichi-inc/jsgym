import { Footer } from "../_components/footer";
import { HeroSection } from "./_components/HeroSection";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
