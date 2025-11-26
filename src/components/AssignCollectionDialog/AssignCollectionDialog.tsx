// @ts-strict-ignore
import { useIntl } from "react-intl";

import AssignContainerDialog, {
  AssignContainerDialogProps,
  ContainerEntityType,
} from "../AssignContainerDialog";
import { messages } from "./messages";

type Collections = {
  id: string;
  name: string;
}[];

interface AssignCollectionDialogProps
  extends Omit<AssignContainerDialogProps, "containers" | "labels"> {
  collections: Collections | null;
  labels?: Partial<AssignContainerDialogProps["labels"]>;
  entityType?: ContainerEntityType;
  locationSearch?: string;
}

const AssignCollectionDialog = ({
  collections,
  labels,
  entityType,
  locationSearch,
  ...rest
}: AssignCollectionDialogProps) => {
  const intl = useIntl();

  return (
    <AssignContainerDialog
      containers={collections}
      emptyMessage={intl.formatMessage(messages.noCollectionsFound)}
      labels={{
        title: intl.formatMessage(messages.assignCollectionDialogHeader),
        label: intl.formatMessage(messages.assignCollectionDialogLabel),
        placeholder: intl.formatMessage(messages.assignCollectionDialogPlaceholder),
        confirmBtn: intl.formatMessage(messages.confirmBtn),
        ...labels,
      }}
      entityType={entityType}
      locationSearch={locationSearch}
      {...rest}
    />
  );
};

AssignCollectionDialog.displayName = "AssignCollectionDialog";
export default AssignCollectionDialog;
