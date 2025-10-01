import { ProductTypeConfigurable, ProductTypeEnum } from "@dashboard/graphql";
import { ProductTypeListUrlFilters } from "@dashboard/productTypes/urls";
import { stringifyQs } from "@dashboard/utils/urls";
import { getExistingKeys, setFilterOptsStatus } from "@test/filters";
import { config } from "@test/intl";
import { createIntl } from "react-intl";

import { getFilterQueryParams } from "../../../utils/filters/filters";
import { createFilterStructure } from "../../components/ProductTypeListPage/filters";
import { getFilterQueryParam, getFilterVariables } from "./filters";

describe("Filtering query params", () => {
  it("should be empty object if no params given", () => {
    const params: ProductTypeListUrlFilters = {};
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(0);
  });
  it("should not be empty object if params given", () => {
    const params: ProductTypeListUrlFilters = {
      configurable: ProductTypeConfigurable.CONFIGURABLE,
      type: ProductTypeEnum.DIGITAL,
    };
    const filterVariables = getFilterVariables(params);

    expect(getExistingKeys(filterVariables)).toHaveLength(2);
  });
});
describe("Filtering URL params", () => {
  const intl = createIntl(config);
  const filters = createFilterStructure(intl, {
    configurable: {
      active: false,
      value: ProductTypeConfigurable.CONFIGURABLE,
    },
    type: {
      active: false,
      value: ProductTypeEnum.DIGITAL,
    },
  });

  it("should be empty if no active filters", () => {
    const filterQueryParams = getFilterQueryParams(filters, getFilterQueryParam);

    expect(getExistingKeys(filterQueryParams)).toHaveLength(0);
  });
  it("should not be empty if active filters are present", () => {
    const filterQueryParams = getFilterQueryParams(
      setFilterOptsStatus(filters, true),
      getFilterQueryParam,
    );

    expect(filterQueryParams).toMatchSnapshot();
    expect(stringifyQs(filterQueryParams)).toMatchSnapshot();
  });
});
