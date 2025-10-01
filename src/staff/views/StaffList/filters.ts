import { StaffMemberStatus, StaffUserInput } from "@dashboard/graphql";
import { findValueInEnum } from "@dashboard/misc";
import { StaffListUrlFilters, StaffListUrlFiltersEnum } from "../../urls";
import { FilterElement, FilterElementRegular } from "../../../components/Filter/types";
import { StaffFilterKeys, StaffListFilterOpts } from "../../components/StaffListPage/filters";
import { createFilterTabUtils } from "../../../utils/filters/storage";
import { getSingleEnumValueQueryParam } from "../../../utils/filters/filters";

const STAFF_FILTERS_KEY = "staffFilters";

export function getFilterOpts(params: StaffListUrlFilters): StaffListFilterOpts {
  return {
    status: {
      active: params?.status !== undefined,
      value: params?.status ? findValueInEnum(params.status, StaffMemberStatus) : null,
    },
  };
}

export function getFilterVariables(params: StaffListUrlFilters): StaffUserInput {
  return {
    search: params.query,
    status: params.status ? findValueInEnum(params.status, StaffMemberStatus) : null,
  };
}

export function getFilterQueryParam(filter: FilterElement<StaffFilterKeys>): StaffListUrlFilters {
  const { name } = filter;

  switch (name) {
    case StaffFilterKeys.status:
      return getSingleEnumValueQueryParam(
        filter as FilterElementRegular<StaffFilterKeys.status>,
        StaffListUrlFiltersEnum.status,
        StaffMemberStatus,
      );
  }
}

export const storageUtils = createFilterTabUtils<string>(STAFF_FILTERS_KEY);
