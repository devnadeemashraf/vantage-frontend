/**
 * ColumnDefinitions — Column config for results DataTable
 * Layer: Feature Slice (results)
 * Pattern: Configuration / static definitions
 *
 * Defines the column definitions (ABN, entityName, entityType, state, abnStatus)
 * for the search results DataTable. Uses responsive classes (hidden sm/md) for
 * smaller screens. BusinessInfoCard and TruncatedTable use similar but
 * simplified layouts.
 */

import type { Business } from '@shared/types';
import type { ColumnDef } from '@shared/ui';

import { Badge } from '@/components/ui/badge';

export const businessColumns: ColumnDef<Business>[] = [
  {
    key: 'abn',
    header: 'ABN',
    render: (row) => <span className="font-mono text-sm">{row.abn}</span>,
    className: 'w-[140px]',
  },
  {
    key: 'entityName',
    header: 'Entity Name',
    render: (row) => row.entityName,
  },
  {
    key: 'entityType',
    header: 'Type',
    render: (row) => (
      <span className="text-muted-foreground text-sm">
        {row.entityTypeText || row.entityTypeCode}
      </span>
    ),
    className: 'hidden md:table-cell',
  },
  {
    key: 'state',
    header: 'State',
    render: (row) => row.state ?? '—',
    className: 'hidden sm:table-cell w-[80px]',
  },
  {
    key: 'abnStatus',
    header: 'Status',
    render: (row) => (
      <Badge variant={row.abnStatus === 'ACT' ? 'default' : 'secondary'}>
        {row.abnStatus === 'ACT' ? 'Active' : 'Cancelled'}
      </Badge>
    ),
    className: 'w-[100px]',
  },
];
