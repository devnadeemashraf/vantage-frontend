/**
 * Business Domain Types
 * Layer: Shared
 *
 * Mirrors the backend's Business domain entities (camelCase shapes returned by
 * the API). Every feature that displays business data imports from here,
 * ensuring a single source of truth for the data contract.
 */

export interface Business {
  id?: number;
  abn: string;
  abnStatus: string;
  abnStatusFrom: string | null;
  entityTypeCode: string;
  entityTypeText: string;
  entityName: string;
  givenName: string | null;
  familyName: string | null;
  state: string | null;
  postcode: string | null;
  gstStatus: string | null;
  gstFromDate: string | null;
  acn: string | null;
  recordLastUpdated: string | null;
  businessNames?: BusinessName[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BusinessName {
  id?: number;
  businessId?: number;
  nameType: string;
  nameText: string;
}
