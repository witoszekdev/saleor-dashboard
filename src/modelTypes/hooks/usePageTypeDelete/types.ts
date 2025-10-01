import { Ids } from "@dashboard/types";

import { TypeDeleteMessages } from "../../../components/TypeDeleteWarningDialog/TypeDeleteWarningDialog";

export interface UseTypeDeleteData extends TypeDeleteMessages {
  isOpen: boolean;
  assignedItemsCount: number | undefined;
  viewAssignedItemsUrl: string | null;
  isLoading: boolean | undefined;
  typesToDelete: Ids;
}

export interface UseTypeDeleteProps<T> {
  params: T;
  selectedTypes?: Ids;
  singleId?: string;
}
