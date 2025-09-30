import { useCallback, useMemo, useState } from "react";

import { FilterContainer, FilterElement } from "../FilterElement";
import { FilterValueProvider } from "../FilterValueProvider";
import { UrlToken } from "./UrlToken";

export const useMemoryValueProvider = (): FilterValueProvider => {
  const [value, setValue] = useState<FilterContainer>([]);

  const persist = useCallback((newValue: FilterContainer) => {
    setValue(newValue);
  }, []);

  const clear = useCallback(() => {
    setValue([]);
  }, []);

  const isPersisted = useCallback(
    (element: FilterElement) =>
      value.some(item => FilterElement.isCompatible(item) && item.equals(element)),
    [value],
  );

  const getTokenByName = useCallback<(name: string) => UrlToken | undefined>(() => undefined, []);

  const count = useMemo(() => value.filter(FilterElement.isCompatible).length, [value]);

  return {
    value,
    loading: false,
    persist,
    clear,
    isPersisted,
    getTokenByName,
    count,
  };
};
