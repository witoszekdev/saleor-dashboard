import { DashboardModal } from "@dashboard/components/Modal";
import { buttonMessages } from "@dashboard/intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { messages } from "../../messages";
import { getDefaultValue } from "./defaultFormValues";
import { getValidationSchema } from "./validationSchema";
import { ConfirmButton, ConfirmButtonTransitionState } from "../../../../../components/ConfirmButton/ConfirmButton";
import { Rule } from "../../../../models/Rule";
import { useDiscountRulesContext } from "../../context/consumer";

interface RuleFormModalProps {
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: (data: Rule) => void;
  confimButtonState: ConfirmButtonTransitionState;
  initialFormValues?: Rule | null;
}

export const RuleFormModal = ({
  onClose,
  initialFormValues,
  confimButtonState,
  children,
  onSubmit,
}: RuleFormModalProps) => {
  const intl = useIntl();
  const { discountType } = useDiscountRulesContext();
  const methods = useForm<Rule>({
    mode: "onBlur",
    values: initialFormValues || getDefaultValue(discountType),
    resolver: zodResolver(getValidationSchema(intl)),
  });

  return (
    <DashboardModal open={true} onChange={onClose}>
      <DashboardModal.Content size="sm" data-test-id="add-rule-dialog">
        <DashboardModal.Header>
          <FormattedMessage {...(initialFormValues ? messages.editRule : messages.addRule)} />
        </DashboardModal.Header>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
        </FormProvider>
        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            <FormattedMessage {...buttonMessages.close} />
          </Button>
          <ConfirmButton
            data-test-id="saveRuleButton"
            transitionState={confimButtonState}
            onClick={methods.handleSubmit(onSubmit)}
          >
            <FormattedMessage {...buttonMessages.save} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
