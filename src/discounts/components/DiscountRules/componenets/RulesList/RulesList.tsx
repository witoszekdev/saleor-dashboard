import { CommonError } from "@dashboard/utils/errors/common";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";
import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { Rule } from "../../../../models/Rule";
import { useDiscountRulesContext } from "../../context/consumer";
import { Placeholder } from "../Placeholder/Placeholder";
import { RuleActions } from "./components/RuleActions/RuleActions";
import { RuleLabel } from "./components/RuleLabel/RuleLabel";
import { RuleListContainer } from "./components/RuleListContainer/RuleListContainer";
import { RuleListLoading } from "./components/RuleListLoading/RuleListLoading";
import { RuleSummary } from "./components/RuleSummary/RuleSummary";
import { RuleWrapper } from "./components/RuleWrapper/RuleWrapper";

interface RulesListProps<ErrorCode> {
  rules: Rule[];
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode> & { index?: number }>;
  loading?: boolean;
  onRuleDelete: (index: number) => void;
  onRuleEdit: (index: number) => void;
}

export const RulesList = <ErrorCode,>({
  rules,
  errors,
  onRuleEdit,
  onRuleDelete,
  loading,
}: RulesListProps<ErrorCode>) => {
  const intl = useIntl();
  const { channels } = useDiscountRulesContext();

  if (loading) {
    return <RuleListLoading />;
  }

  if (rules.length === 0) {
    return <Placeholder />;
  }

  return (
    <RuleListContainer>
      {rules.map((rule, index) => {
        const hasError = errors.some(error => error.index === index);

        return (
          <RuleWrapper key={rule.id || index} hasError={hasError}>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box
                data-test-id="rule-label-with-actions"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <RuleLabel ruleName={rule.name} data-test-id="rule-name" />

                <RuleActions
                  onDelete={() => onRuleDelete(index)}
                  onEdit={() => onRuleEdit(index)}
                />
              </Box>
              <RuleSummary rule={rule} currencySymbol={getCurencySymbol(rule.channel, channels)} />
              {hasError && <Text color="critical1">{intl.formatMessage(messages.ruleError)}</Text>}
            </Box>
          </RuleWrapper>
        );
      })}
    </RuleListContainer>
  );
};
