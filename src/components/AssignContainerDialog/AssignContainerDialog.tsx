import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import {
  ConditionalCollectionFilterProvider,
  ConditionalPageFilterProvider,
} from "@dashboard/components/ConditionalFilter";
import { DashboardModal } from "@dashboard/components/Modal";
import { Container, DialogProps, FetchMoreProps } from "@dashboard/types";
import { ReactNode } from "react";

import { AssignContainerDialogMulti } from "./AssignContainerDialogMulti";
import { AssignContainerDialogSingle } from "./AssignContainerDialogSingle";

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;

export type ContainerEntityType = "page" | "collection" | "category";

export interface AssignContainerDialogProps extends FetchMoreProps, DialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  emptyMessage?: string;
  selectionMode?: "single" | "multiple";
  selectedId?: string;
  entityType?: ContainerEntityType;
  locationSearch?: string;
}

const getFilterProvider = (
  entityType: ContainerEntityType | undefined,
  locationSearch: string,
  children: ReactNode,
) => {
  if (!entityType) {
    // No filtering for categories yet
    return <>{children}</>;
  }

  switch (entityType) {
    case "page":
      return (
        <ConditionalPageFilterProvider locationSearch={locationSearch}>
          {children}
        </ConditionalPageFilterProvider>
      );
    case "collection":
      return (
        <ConditionalCollectionFilterProvider locationSearch={locationSearch}>
          {children}
        </ConditionalCollectionFilterProvider>
      );
    case "category":
      // Categories don't have a filter provider yet
      return <>{children}</>;
    default:
      return <>{children}</>;
  }
};

const AssignContainerDialog = (props: AssignContainerDialogProps) => {
  const { selectionMode = "multiple", entityType, locationSearch = "", ...restProps } = props;

  const { labels, open, onClose } = props;

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="sm" __gridTemplateRows="auto auto 1fr auto">
        <DashboardModal.Header>{labels.title}</DashboardModal.Header>
        {getFilterProvider(
          entityType,
          locationSearch,
          selectionMode === "single" ? (
            <AssignContainerDialogSingle {...restProps} />
          ) : (
            <AssignContainerDialogMulti {...restProps} />
          ),
        )}
      </DashboardModal.Content>
    </DashboardModal>
  );
};

AssignContainerDialog.displayName = "AssignContainerDialog";

export default AssignContainerDialog;
