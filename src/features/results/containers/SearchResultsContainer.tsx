/**
 * SearchResultsContainer — Stateful container for search results
 * Layer: Feature Slice (results)
 * Pattern: Stateful Container
 *
 * Reads query params from URL, uses useSearchBusinessesQuery to fetch data,
 * and coordinates loading/error/empty states. Renders ResultsHeader,
 * CompactSearchBar, DataTable, and Pagination. Row clicks navigate to
 * /business/:abn. Refinement updates URL to trigger refetch.
 */

import { useSearchBusinessesQuery } from '@features/search';
import { usePageTitle } from '@shared/hooks';
import type { Business } from '@shared/types';
import {
  DataTable,
  EmptyState,
  ErrorAlert,
  LoadingSkeleton,
  Pagination,
} from '@shared/ui';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { businessColumns } from '../components/ColumnDefinitions';
import { CompactSearchBar } from '../components/CompactSearchBar';
import { ResultsHeader } from '../components/ResultsHeader';
import { usePagination } from '../hooks/usePagination';

export function SearchResultsContainer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { page, limit, setPage } = usePagination();

  const q = searchParams.get('q') ?? undefined;
  const state = searchParams.get('state') ?? undefined;
  const entityType = searchParams.get('entityType') ?? undefined;
  const abnStatus = searchParams.get('abnStatus') ?? undefined;
  const techniqueFromUrl = searchParams.get('technique') ?? undefined;

  const [localQuery, setLocalQuery] = useState(q ?? '');

  const queryArg = {
    q,
    state,
    entityType,
    abnStatus,
    page,
    limit,
    mode: 'standard' as const,
    technique: (techniqueFromUrl as 'native' | 'optimized') || undefined,
  };

  usePageTitle(q ? `Results for "${q}"` : 'All Businesses');

  const { data, isLoading, isError, refetch } = useSearchBusinessesQuery(queryArg);

  const handleRefine = () => {
    const params = new URLSearchParams(searchParams);
    if (localQuery.trim()) {
      params.set('q', localQuery.trim());
    } else {
      params.delete('q');
    }
    params.delete('page');
    navigate(`/results?${params.toString()}`);
  };

  const handleRowClick = (row: Business) => {
    navigate(`/business/${row.abn}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton rows={8} columns={5} />
      </div>
    );
  }

  if (isError) {
    toast.error('Failed to load search results.');
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorAlert onRetry={refetch} />
      </div>
    );
  }

  const businesses = data?.data ?? [];
  const pagination = data?.pagination;
  const metrics = data?.meta;

  return (
    <div className="container mx-auto px-4 py-8">
      <ResultsHeader
        query={q}
        total={pagination?.total ?? 0}
        totalTimeMs={metrics?.totalTimeMs as number}
        queryTimeMs={metrics?.queryTimeMs as number}
      />
      <CompactSearchBar
        query={localQuery}
        onQueryChange={setLocalQuery}
        onSubmit={handleRefine}
      />

      {businesses.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <DataTable
            columns={businessColumns}
            data={businesses}
            keyExtractor={(row) => row.abn}
            onRowClick={handleRowClick}
          />
          {pagination && (
            <div className="mt-6">
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
