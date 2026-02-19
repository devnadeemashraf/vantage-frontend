/**
 * BusinessInfoCard — Stateless card displaying all business fields
 * Layer: Feature Slice (business-detail)
 * Pattern: Stateless Presentational
 *
 * Renders a Card with entity name, StatusBadge, and a definition list of
 * ABN, entity type, names, state, postcode, GST status, ACN, last updated.
 * Conditionally hides empty fields. Used by BusinessDetailContainer.
 */

import type { Business } from '@shared/types';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { StatusBadge } from './StatusBadge';

interface BusinessInfoCardProps {
  business: Business;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-3 gap-2 py-2">
      <dt className="text-muted-foreground text-sm font-medium">{label}</dt>
      <dd className="col-span-2 text-sm">{value}</dd>
    </div>
  );
}

export function BusinessInfoCard({ business }: BusinessInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <CardTitle className="text-xl">{business.entityName}</CardTitle>
          <StatusBadge status={business.abnStatus} />
        </div>
      </CardHeader>
      <CardContent>
        <dl>
          <InfoRow label="ABN" value={business.abn} />
          <Separator />
          <InfoRow label="Entity Type" value={business.entityTypeText} />
          <Separator />
          {business.givenName && (
            <>
              <InfoRow label="Given Name" value={business.givenName} />
              <Separator />
            </>
          )}
          {business.familyName && (
            <>
              <InfoRow label="Family Name" value={business.familyName} />
              <Separator />
            </>
          )}
          <InfoRow label="State" value={business.state} />
          <Separator />
          <InfoRow label="Postcode" value={business.postcode} />
          <Separator />
          <InfoRow
            label="GST Status"
            value={
              business.gstStatus === 'ACT'
                ? 'Registered'
                : business.gstStatus === 'CAN'
                  ? 'Cancelled'
                  : business.gstStatus
            }
          />
          {business.acn && (
            <>
              <Separator />
              <InfoRow label="ACN" value={business.acn} />
            </>
          )}
          {business.recordLastUpdated && (
            <>
              <Separator />
              <InfoRow
                label="Last Updated"
                value={new Date(
                  business.recordLastUpdated,
                ).toLocaleDateString()}
              />
            </>
          )}
        </dl>
      </CardContent>
    </Card>
  );
}
