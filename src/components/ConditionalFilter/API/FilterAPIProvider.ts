import { ItemOption } from "../FilterElement/ConditionValue";
import { FilterContainer } from "../FilterElement/FilterElement";
import { LeftOperand } from "../LeftOperandsProvider";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => Promise<ItemOption[]>;
  fetchAttributeOptions: (inputValue: string) => Promise<LeftOperand[]>;
}
