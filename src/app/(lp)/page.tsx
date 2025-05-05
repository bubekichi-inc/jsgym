import { HeroSection } from "@/app/(lp)/_components/HeroSection";
import { Questions } from "@/app/(lp)/_components/Questions";
import { Footer } from "@/app/_components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <Questions limit={12} />
      </main>
      <Footer />
    </div>
  );
}
