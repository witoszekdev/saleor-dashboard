import { UrlToken } from "./ValueProvider/UrlToken";
import { FilterContainer, FilterElement } from "./FilterElement/FilterElement";

export interface FilterValueProvider {
  value: FilterContainer;
  loading: boolean;
  persist: (newValue: FilterContainer) => void;
  isPersisted: (element: FilterElement) => boolean;
  clear: () => void;
  getTokenByName: (name: string) => UrlToken | undefined;
  count: number;
}
