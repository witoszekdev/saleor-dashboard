import { ActionDialog } from "@dashboard/components/ActionDialog";
import { useIntl } from "react-intl";

import { productVariantEndPreorderDialogMessages } from "./messages";
import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";

interface ProductVariantEndPreorderDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  variantGlobalSoldUnits?: number;
}

const ProductVariantEndPreorderDialog = ({
  confirmButtonState,
  open,
  onClose,
  onConfirm,
  variantGlobalSoldUnits,
}: ProductVariantEndPreorderDialogProps) => {
  const intl = useIntl();

  return (
    <ActionDialog
      confirmButtonLabel={intl.formatMessage(
        productVariantEndPreorderDialogMessages.dialogConfirmButtonLabel,
      )}
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(productVariantEndPreorderDialogMessages.dialogTitle)}
      variant="default"
    >
      {intl.formatMessage(productVariantEndPreorderDialogMessages.dialogMessage, {
        variantGlobalSoldUnits,
      })}
    </ActionDialog>
  );
};

ProductVariantEndPreorderDialog.displayName = "ProductVariantEndPreorderDialog";
export { ProductVariantEndPreorderDialog };
