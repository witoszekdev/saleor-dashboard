// @ts-strict-ignore
import {
  ProductTypeConfigurable,
  ProductTypeEnum,
  ProductTypeFilterInput,
} from "@dashboard/graphql";
import { findValueInEnum, maybe } from "@dashboard/misc";

import { FilterElement } from "../../../components/Filter/types";
import { getSingleValueQueryParam } from "../../../utils/filters/filters";
import { createFilterTabUtils } from "../../../utils/filters/storage";
import {
  ProductTypeFilterKeys,
  ProductTypeListFilterOpts,
} from "../../components/ProductTypeListPage/filters";
import { ProductTypeListUrlFilters, ProductTypeListUrlFiltersEnum } from "../../urls";

const PRODUCT_TYPE_FILTERS_KEY = "productTypeFilters";

export function getFilterOpts(params: ProductTypeListUrlFilters): ProductTypeListFilterOpts {
  return {
    configurable: {
      active: !!maybe(() => params.configurable),
      value: maybe(() => findValueInEnum(params.configurable, ProductTypeConfigurable)),
    },
    type: {
      active: !!maybe(() => params.type),
      value: maybe(() => findValueInEnum(params.type, ProductTypeEnum)),
    },
  };
}

export function getFilterVariables(params: ProductTypeListUrlFilters): ProductTypeFilterInput {
  return {
    configurable: params.configurable
      ? findValueInEnum(params.configurable, ProductTypeConfigurable)
      : undefined,
    productType: params.type ? findValueInEnum(params.type, ProductTypeEnum) : undefined,
    search: params.query,
  };
}

export function getFilterQueryParam(
  filter: FilterElement<ProductTypeFilterKeys>,
): ProductTypeListUrlFilters {
  const { name } = filter;

  switch (name) {
    case ProductTypeFilterKeys.configurable:
      return getSingleValueQueryParam(filter, ProductTypeListUrlFiltersEnum.configurable);

    case ProductTypeFilterKeys.type:
      return getSingleValueQueryParam(filter, ProductTypeListUrlFiltersEnum.type);
  }
}

export const storageUtils = createFilterTabUtils<string>(PRODUCT_TYPE_FILTERS_KEY);
