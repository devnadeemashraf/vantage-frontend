/**
 * IconFilterButton — Icon-only filter button with dropdown
 * Layer: Shared UI
 * Pattern: Stateless Presentational
 *
 * Renders an icon button that opens a dropdown with filter options.
 * Shows a visual indicator dot when a filter is active. Supports color
 * variants (default, success, danger) for visual feedback. Used by
 * CompactFilterBar and IconFilterBar for space-efficient filtering.
 */

import type { LucideIcon } from 'lucide-react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type FilterVariant = 'default' | 'success' | 'danger';

const variantStyles: Record<
  FilterVariant,
  { trigger: string; icon: string; dot: string }
> = {
  default: {
    trigger: 'border-primary/50 bg-primary/10',
    icon: 'text-primary',
    dot: 'bg-primary',
  },
  success: {
    trigger: 'border-emerald-500/50 bg-emerald-500/10',
    icon: 'text-emerald-500',
    dot: 'bg-emerald-500',
  },
  danger: {
    trigger: 'border-red-500/50 bg-red-500/10',
    icon: 'text-red-500',
    dot: 'bg-red-500',
  },
};

interface IconFilterButtonProps {
  icon: LucideIcon;
  label: string;
  value: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  onChange: (value: string) => void;
  variant?: FilterVariant;
  disabled?: boolean;
  className?: string;
}

export function IconFilterButton({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  variant = 'default',
  disabled = false,
  className,
}: IconFilterButtonProps) {
  const hasActiveFilter = value !== '' && value !== '__all__';
  const styles = variantStyles[variant];

  const handleValueChange = (newValue: string) => {
    onChange(newValue === '__all__' ? '' : newValue);
  };

  return (
    <Select
      value={value || '__all__'}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger
        className={cn(
          'relative h-9 w-9 justify-center gap-0 rounded-full px-0',
          '[&>svg:last-child]:hidden',
          hasActiveFilter && styles.trigger,
          disabled && 'pointer-events-none opacity-50',
          className,
        )}
        aria-label={label}
        title={label}
      >
        <Icon className={cn('h-4 w-4', hasActiveFilter && styles.icon)} />
        {hasActiveFilter && (
          <span
            className={cn(
              'ring-background absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ring-2',
              styles.dot,
            )}
          />
        )}
      </SelectTrigger>
      <SelectContent position="popper" align="center" sideOffset={8}>
        <SelectItem value="__all__" className="text-muted-foreground">
          All {label}
        </SelectItem>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
