"use client";
import { useState } from "react";
import { HeroSection } from "@/app/(lp)/_components/HeroSection";
import { QuestionsSection } from "@/app/(lp)/_components/QuestionsSection";
import { ContactModal } from "@/app/(lp)/_components/ContactModal";
import { Footer } from "@/app/_components/Footer";

export default function Home() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <QuestionsSection />
      </main>
      <Footer />
      <button
        className="fixed bottom-4 right-4 rounded-full bg-blue-600 px-4 py-3 text-white shadow"
        onClick={() => setOpen(true)}
      >
        お問い合わせ
      </button>
      <ContactModal isOpen={open} onClose={() => setOpen(false)} />
    </div>
  );
}
