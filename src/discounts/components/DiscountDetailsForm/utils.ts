import { Option } from "@saleor/macaw-ui-next";

import { isArrayOfOptions } from "../../models/Condition";
import { Rule } from "../../models/Rule";

export const getCurrentConditionsValuesLabels = (rule: Rule[]) => {
  return rule
    .flatMap(rule => rule.conditions)
    .filter(condition => isArrayOfOptions(condition.value))
    .flatMap(condition => condition.value as Option[])
    .reduce(
      (acc, value) => {
        // Initali value and label might contain  id
        if (value.value !== value.label) {
          acc[value.value] = value.label;
        }

        return acc;
      },
      {} as Record<string, string>,
    );
};
