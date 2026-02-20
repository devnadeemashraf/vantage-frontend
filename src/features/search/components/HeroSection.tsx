import { memo } from 'react';

export const HeroSection = memo(function HeroSection() {
  return (
    <div className="mb-10 text-center">
      <h1 className="from-foreground to-foreground/70 bg-linear-to-b bg-clip-text text-7xl font-bold tracking-tight text-transparent">
        Vantage
      </h1>
      <p className="text-muted-foreground mt-4 text-xl font-light">
        Discover Australian businesses in milliseconds
      </p>
    </div>
  );
});
