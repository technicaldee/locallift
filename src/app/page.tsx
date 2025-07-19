'use client'

export const dynamic = 'force-dynamic'

import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <Hero />
      </main>
    </div>
  );
}
