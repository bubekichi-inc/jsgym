import { HeroSection } from "@/app/(lp)/_components/HeroSection";
import { QuestionsSection } from "@/app/(lp)/_components/QuestionsSection";
import { Footer } from "@/app/_components/Footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <QuestionsSection />
      </main>
      <Footer />
    </div>
  );
}
