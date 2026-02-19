/**
 * Application Constants
 * Layer: Shared
 *
 * Centralised lookup tables and defaults mirrored from the backend's
 * shared/constants.ts. Filter dropdowns, URL parsing, and pagination
 * all reference this file, keeping values in sync with the API.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1';

export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const ABN_STATUS_OPTIONS = [
  { value: 'ACT', label: 'Active' },
  { value: 'CAN', label: 'Cancelled' },
] as const;

export const STATE_OPTIONS = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'NT', label: 'Northern Territory' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'AAT', label: 'Australian Antarctic Territory' },
] as const;

export const ENTITY_TYPE_OPTIONS = [
  { value: 'IND', label: 'Individual/Sole Trader' },
  { value: 'PRV', label: 'Australian Private Company' },
  { value: 'PUB', label: 'Australian Public Company' },
  { value: 'FPT', label: 'Family Partnership' },
  { value: 'PTR', label: 'Other Partnership' },
  { value: 'TRT', label: 'Other Trust' },
  { value: 'DTT', label: 'Discretionary Trading Trust' },
  { value: 'DIT', label: 'Discretionary Investment Trust' },
  { value: 'SMF', label: 'Self-Managed Super Fund' },
  { value: 'GOV', label: 'Government Entity' },
  { value: 'SGE', label: 'State Government Entity' },
  { value: 'STR', label: 'Strata-title' },
  { value: 'OIE', label: 'Other Incorporated Entity' },
  { value: 'UIE', label: 'Other Unincorporated Entity' },
  { value: 'COP', label: 'Co-operative' },
] as const;
