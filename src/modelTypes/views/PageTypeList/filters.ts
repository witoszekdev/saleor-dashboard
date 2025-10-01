import { PageTypeFilterInput } from "@dashboard/graphql";
import { PageTypeListUrlFilters } from "../../urls";
import { createFilterTabUtils } from "../../../utils/filters/storage";

const PAGE_TYPE_FILTERS_KEY = "pageTypeFilters";

export function getFilterVariables(params: PageTypeListUrlFilters): PageTypeFilterInput {
  return {
    search: params.query,
  };
}

export const storageUtils = createFilterTabUtils<string>(PAGE_TYPE_FILTERS_KEY);
