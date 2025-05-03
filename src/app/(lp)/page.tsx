'use client';

import { useDevice } from '../_hooks/useDevice';
import { Footer } from './_components/footer';
import { Questions } from '@/app/(lp)/_components/Questions';
import { HeroSection } from '@/app/(lp)/_components/hero-section';

export default function Home() {
  const { isSp } = useDevice();
  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>
        <HeroSection />
        {isSp ? <Questions limit={9} /> : <Questions limit={12} />}
      </main>
      <Footer />
    </div>
  );
}
