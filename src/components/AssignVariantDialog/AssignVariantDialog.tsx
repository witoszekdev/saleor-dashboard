import {
  ConditionalProductDialogFilterProvider,
  useConditionalFilterContext,
} from "@dashboard/components/ConditionalFilter";
import { createProductQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ProductWhereInput, SearchProductsQuery } from "@dashboard/graphql";
import { ReferenceProductFilterVariables } from "@dashboard/searches/types";
import { Container, DialogProps, FetchMoreProps, RelayToFlat } from "@dashboard/types";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { AssignContainerDialogProps } from "../AssignContainerDialog";
import { AssignVariantDialogMulti } from "./AssignVariantDialogMulti";
import { AssignVariantDialogSingle } from "./AssignVariantDialogSingle";
import { messages } from "./messages";

interface AssignVariantDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: RelayToFlat<SearchProductsQuery["search"]>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  enableFilters?: boolean;
  onFilterChange?: (variables: ReferenceProductFilterVariables) => void;
}

const AssignVariantDialogContent = (props: AssignVariantDialogProps) => {
  const {
    selectionMode = "multiple",
    enableFilters = false,
    onFilterChange,
    onClose,
    open,
    ...restProps
  } = props;
  const { valueProvider } = useConditionalFilterContext();

  useEffect(() => {
    if (!enableFilters || !onFilterChange) {
      return;
    }

    const queryVars = createProductQueryVariables(valueProvider.value);
    const { channel, ...whereFilters } = queryVars;
    const hasWhereFilters = Object.keys(whereFilters).length > 0;
    const where = hasWhereFilters ? (whereFilters as ProductWhereInput) : undefined;
    const channelSlug = channel?.eq;

    onFilterChange({ where, channel: channelSlug });
  }, [enableFilters, onFilterChange, valueProvider.value]);

  const handleClose = () => {
    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>
          <FormattedMessage {...messages.assignVariantDialogHeader} />
        </DashboardModal.Header>

        {selectionMode === "single" ? (
          <AssignVariantDialogSingle
            enableFilters={enableFilters}
            onClose={onClose}
            open={open}
            {...restProps}
          />
        ) : (
          <AssignVariantDialogMulti
            enableFilters={enableFilters}
            onClose={onClose}
            open={open}
            {...restProps}
          />
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
};

const AssignVariantDialog = (props: AssignVariantDialogProps) => {
  return (
    <ConditionalProductDialogFilterProvider>
      <AssignVariantDialogContent {...props} />
    </ConditionalProductDialogFilterProvider>
  );
};

AssignVariantDialog.displayName = "AssignVariantDialog";
export default AssignVariantDialog;
