/**
 * ModeToggle — Standard/AI mode switch
 * Layer: Shared / UI
 * Pattern: Stateless Presentational
 *
 * Renders a tabs-style toggle between "Standard" and "AI" search modes.
 * Mode is controlled via props; onModeChange updates URL ?mode= when used
 * in RootLayout. Drives which container (StandardSearch vs AiSearch) is shown.
 */

import { memo } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ModeToggleProps {
  mode: 'standard' | 'ai';
  onModeChange: (mode: 'standard' | 'ai') => void;
}

export const ModeToggle = memo(function ModeToggle({
  mode,
  onModeChange,
}: ModeToggleProps) {
  return (
    <Tabs
      value={mode}
      onValueChange={(v) => onModeChange(v as 'standard' | 'ai')}
    >
      <TabsList>
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="ai">AI</TabsTrigger>
      </TabsList>
    </Tabs>
  );
});
