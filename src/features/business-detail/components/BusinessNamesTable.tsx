/**
 * BusinessNamesTable — Stateless table of trading names
 * Layer: Feature Slice (business-detail)
 * Pattern: Stateless Presentational
 *
 * Renders a table of business names (TRD, BN, MN, etc.) with type labels.
 * Returns null if no names. Used by BusinessDetailContainer below
 * BusinessInfoCard for businesses with businessNames.
 */

import type { BusinessName } from '@shared/types';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface BusinessNamesTableProps {
  names: BusinessName[];
}

const NAME_TYPE_LABELS: Record<string, string> = {
  TRD: 'Trading Name',
  BN: 'Business Name',
  MN: 'Main Name',
  LGL: 'Legal Name',
  OTN: 'Other Name',
  DGR: 'DGR Fund Name',
};

export function BusinessNamesTable({ names }: BusinessNamesTableProps) {
  if (names.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="mb-3 text-lg font-medium">Business Names</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[160px]">Type</TableHead>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {names.map((name, idx) => (
              <TableRow key={idx}>
                <TableCell className="text-muted-foreground text-sm">
                  {NAME_TYPE_LABELS[name.nameType] ?? name.nameType}
                </TableCell>
                <TableCell>{name.nameText}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
