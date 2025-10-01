import { Combobox } from "@dashboard/components/Combobox";
import { useController, useFormContext } from "react-hook-form";

import { useConditionNames } from "./hooks/useConditionNames";
import { getConditionNameValue } from "./utils";
import { useDiscountRulesContext } from "../../../../context/consumer";
import { Condition } from "../../../../../../models/Condition";
import { Rule } from "../../../../../../models/Rule";

interface RuleConditionNameProps {
  conditionIndex: number;
  updateCondition: (index: number, value: Condition) => void;
  isConditionTypeSelected: (conditionType: string) => boolean;
}

export const RuleConditionName = ({
  conditionIndex,
  updateCondition,
  isConditionTypeSelected,
}: RuleConditionNameProps) => {
  const { watch } = useFormContext<Rule>();
  const { discountType, disabled } = useDiscountRulesContext();
  const conditionNames = useConditionNames(discountType);
  const ruleConditionNameFieldName = `conditions.${conditionIndex}.id` as const;
  const { field: nameField } = useController<Rule, typeof ruleConditionNameFieldName>({
    name: ruleConditionNameFieldName,
  });
  const condition = watch(`conditions.${conditionIndex}`);
  const filteredConditionLeftOptions = conditionNames.filter(
    condition => !isConditionTypeSelected(condition.value),
  );

  return (
    <Combobox
      value={getConditionNameValue(nameField.value, conditionNames)}
      fetchOptions={() => undefined}
      options={filteredConditionLeftOptions}
      onChange={e => {
        condition.value = [];
        updateCondition(conditionIndex, condition);
        nameField.onChange(e.target.value);
      }}
      size="medium"
      data-test-id={`condition-name-${conditionIndex}`}
      onBlur={nameField.onBlur}
      disabled={disabled}
    />
  );
};
