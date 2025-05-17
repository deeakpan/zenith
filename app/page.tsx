'use client';

import Map from './components/map/Map';
import Navigation from './components/layout/Navigation';

export default function Home() {
  return (
    <main className="relative w-full h-screen">
      <Map />
      <div className="absolute inset-0 z-[9999] pointer-events-none">
        <Navigation />
      </div>
    </main>
  );
}
