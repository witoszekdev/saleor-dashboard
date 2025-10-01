import { ActionDialog } from "@dashboard/components/ActionDialog";
import { getStringOrPlaceholder } from "@dashboard/misc";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import { Messages as msgs } from "./messages";

interface AppInProgressDeleteDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  name?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

const AppInProgressDeleteDialog = ({
  confirmButtonState,
  open,
  name,
  onClose,
  onConfirm,
}: AppInProgressDeleteDialogProps) => {
  const intl = useIntl();
  const isNameMissing = name === null || name === "";
  const getMainText = () => {
    if (isNameMissing) {
      return intl.formatMessage(msgs.deleteApp);
    }

    return intl.formatMessage(msgs.deleteNamedApp, {
      name: <strong>{getStringOrPlaceholder(name)}</strong>,
    });
  };

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={intl.formatMessage(msgs.header)}
      variant="delete"
    >
      <Box data-test-id="dialog-content">{getMainText()}</Box>
    </ActionDialog>
  );
};

AppInProgressDeleteDialog.displayName = "AppInProgressDeleteDialog";
export { AppInProgressDeleteDialog };
