export interface SearchFilters {
  technique: string;
  state: string;
  entityType: string;
  abnStatus: string;
}

export const EMPTY_FILTERS: SearchFilters = {
  technique: 'native',
  state: '',
  entityType: '',
  abnStatus: '',
};
