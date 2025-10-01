import { useMemo } from "react";
import { OccurrenceLimiter } from "./FilterElement/OccurrenceLimiter";
import { LeftOperand } from "./LeftOperandsProvider";
import { FilterContainer } from "./FilterElement/FilterElement";

export const useFilteredOperands = (
  operands: LeftOperand[],
  container: FilterContainer,
): LeftOperand[] => {
  return useMemo(
    () => OccurrenceLimiter.filterAvailableOperands(operands, container),
    [operands, container],
  );
};
