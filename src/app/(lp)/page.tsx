import { Footer } from "../_components/footer";
import { HeroSection } from "@/app/(lp)/_components/HeroSection";
import { Questions } from "@/app/(lp)/_components/Questions";

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
