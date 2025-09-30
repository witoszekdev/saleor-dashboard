import { FC, ReactNode } from "react";

import { useProductFilterAPIProvider } from "../API/providers/ProductFilterAPIProvider";
import { STATIC_PRODUCT_OPTIONS } from "../constants";
import { useContainerState } from "../useContainerState";
import { useFilterLeftOperandsProvider } from "../useFilterLeftOperands";
import { useFilterWindow } from "../useFilterWindow";
import { useMemoryValueProvider } from "../ValueProvider/useMemoryValueProvider";
import { ConditionalFilterContext } from "./context";

export const ConditionalProductDialogFilterProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const apiProvider = useProductFilterAPIProvider();
  const valueProvider = useMemoryValueProvider();
  const leftOperandsProvider = useFilterLeftOperandsProvider(STATIC_PRODUCT_OPTIONS);
  const containerState = useContainerState(valueProvider);
  const filterWindow = useFilterWindow();

  return (
    <ConditionalFilterContext.Provider
      value={{
        apiProvider,
        valueProvider,
        leftOperandsProvider,
        containerState,
        filterWindow,
      }}
    >
      {children}
    </ConditionalFilterContext.Provider>
  );
};
