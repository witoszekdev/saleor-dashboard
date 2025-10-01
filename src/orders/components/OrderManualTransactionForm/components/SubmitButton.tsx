// @ts-strict-ignore
import { useManualTransactionContext } from "../context";
import { ConfirmButton, ConfirmButtonProps } from "../../../../components/ConfirmButton/ConfirmButton";

export const SubmitButton = ({
  disabled,
  ...props
}: Omit<ConfirmButtonProps, "type" | "transitionState">) => {
  const { submitState, amount } = useManualTransactionContext();

  return (
    <ConfirmButton
      size="large"
      type="submit"
      transitionState={submitState}
      disabled={!amount || disabled}
      data-test-id="manualTransactionSubmit"
      {...props}
    />
  );
};
