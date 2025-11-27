import {
  ConditionalProductDialogFilterProvider,
  useConditionalFilterContext,
} from "@dashboard/components/ConditionalFilter";
import { createProductQueryVariables } from "@dashboard/components/ConditionalFilter/queryVariables";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { ProductWhereInput } from "@dashboard/graphql";
import { ReferenceProductFilterVariables } from "@dashboard/searches/types";
import { Container, DialogProps, FetchMoreProps } from "@dashboard/types";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";

import { AssignProductDialogMulti } from "./AssignProductDialogMulti";
import { AssignProductDialogSingle } from "./AssignProductDialogSingle";
import { messages } from "./messages";
import { Products, SelectedChannel } from "./types";

export interface AssignProductDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFetch: (value: string) => void;
  // name is part of Container interface
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  labels?: {
    confirmBtn?: string;
  };
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  enableFilters?: boolean;
  onFilterChange?: (variables: ReferenceProductFilterVariables) => void;
}

const AssignProductDialogContent = (props: AssignProductDialogProps) => {
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
          <AssignProductDialogSingle
            enableFilters={enableFilters}
            onClose={onClose}
            open={open}
            {...restProps}
          />
        ) : (
          <AssignProductDialogMulti
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

const AssignProductDialog = (props: AssignProductDialogProps) => {
  return (
    <ConditionalProductDialogFilterProvider>
      <AssignProductDialogContent {...props} />
    </ConditionalProductDialogFilterProvider>
  );
};

AssignProductDialog.displayName = "AssignProductDialog";
export default AssignProductDialog;
