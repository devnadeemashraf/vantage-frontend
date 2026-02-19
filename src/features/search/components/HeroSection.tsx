import { memo } from 'react';

export const HeroSection = memo(function HeroSection() {
  return (
    <div className="mb-8 text-center">
      <h1 className="text-5xl font-bold tracking-tight">Vantage</h1>
      <p className="text-muted-foreground mt-3 text-lg">
        Search the Australian Business Register
      </p>
    </div>
  );
});
