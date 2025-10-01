import { ItemOption } from "../FilterElement/ConditionValue";
import { LeftOperand } from "../LeftOperandsProvider";
import { FilterContainer } from "../FilterElement/FilterElement";

export interface FilterAPIProvider {
  fetchRightOptions: (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => Promise<ItemOption[]>;
  fetchAttributeOptions: (inputValue: string) => Promise<LeftOperand[]>;
}
