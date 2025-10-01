import { WarehouseFilterInput } from "@dashboard/graphql";
import { WarehouseListUrlFilters } from "../../urls";
import { createFilterTabUtils } from "../../../utils/filters/storage";

const WAREHOUSE_FILTERS_KEY = "warehouseFilters";

export function getFilterVariables(params: WarehouseListUrlFilters): WarehouseFilterInput {
  return {
    search: params.query,
  };
}

export const storageUtils = createFilterTabUtils<string>(WAREHOUSE_FILTERS_KEY);
