/**
 * BusinessDetailContainer — Stateful container for business detail
 * Layer: Feature Slice (business-detail)
 * Pattern: Stateful Container
 *
 * Fetches a single business by ABN from the route param. Handles loading,
 * error, and success states. Renders BusinessInfoCard and BusinessNamesTable.
 * Back button navigates to previous history entry. Used by BusinessDetailPage.
 */

import { ErrorAlert, LoadingSkeleton } from '@shared/ui';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

import { Button } from '@/components/ui/button';

import { useGetBusinessByAbnQuery } from '../api/businessApi';
import { BusinessInfoCard } from '../components/BusinessInfoCard';
import { BusinessNamesTable } from '../components/BusinessNamesTable';

export function BusinessDetailContainer() {
  const { abn } = useParams<{ abn: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError, refetch } = useGetBusinessByAbnQuery(
    abn ?? '',
    { skip: !abn },
  );

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <LoadingSkeleton rows={10} columns={2} />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto max-w-2xl px-4 py-8">
        <ErrorAlert
          message={`Business with ABN ${abn} could not be found.`}
          onRetry={refetch}
        />
      </div>
    );
  }

  const business = data.data;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back
      </Button>

      <BusinessInfoCard business={business} />
      {business.businessNames && business.businessNames.length > 0 && (
        <BusinessNamesTable names={business.businessNames} />
      )}
    </div>
  );
}
