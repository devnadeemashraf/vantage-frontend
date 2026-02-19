export interface SearchFilters {
  state: string;
  entityType: string;
  abnStatus: string;
}

export const EMPTY_FILTERS: SearchFilters = {
  state: '',
  entityType: '',
  abnStatus: '',
};
