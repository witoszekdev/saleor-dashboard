import { ConditionalProductFilterProvider } from "@dashboard/components/ConditionalFilter/context";
import { useLocation } from "react-router";

import AssignProductDialog, { AssignProductDialogProps } from "./AssignProductDialog";

/**
 * Wrapper component that provides ConditionalFilter context to AssignProductDialog
 * This allows the modal to use advanced filtering capabilities
 */
const AssignProductDialogWithFilters = (props: AssignProductDialogProps) => {
  const location = useLocation();

  return (
    <ConditionalProductFilterProvider locationSearch={location.search}>
      <AssignProductDialog {...props} />
    </ConditionalProductFilterProvider>
  );
};

AssignProductDialogWithFilters.displayName = "AssignProductDialogWithFilters";
export default AssignProductDialogWithFilters;
