/**
 * TruncatedTable — Stateless 5-row preview table
 * Layer: Feature Slice (ai-search)
 * Pattern: Stateless Presentational
 *
 * Renders the first 5 businesses in a compact table (Entity Name, ABN, State)
 * with a "View in full screen" link to /results?q=...&mode=ai. Used inside
 * ChatMessage bubbles when assistant returns business results.
 */

import type { Business } from '@shared/types';
import { Link } from 'react-router';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TruncatedTableProps {
  businesses: Business[];
  query: string;
}

export function TruncatedTable({ businesses, query }: TruncatedTableProps) {
  const rows = businesses.slice(0, 5);

  return (
    <div className="mt-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Entity Name</TableHead>
              <TableHead className="hidden sm:table-cell">ABN</TableHead>
              <TableHead className="hidden sm:table-cell">State</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((biz, idx) => (
              <TableRow key={biz.abn}>
                <TableCell className="text-muted-foreground">
                  {idx + 1}
                </TableCell>
                <TableCell className="font-medium">{biz.entityName}</TableCell>
                <TableCell className="hidden font-mono text-sm sm:table-cell">
                  {biz.abn}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {biz.state ?? '—'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Link
        to={`/results?q=${encodeURIComponent(query)}&mode=ai`}
        className="text-primary mt-2 inline-block text-sm underline underline-offset-4"
      >
        View in full screen &rarr;
      </Link>
    </div>
  );
}
