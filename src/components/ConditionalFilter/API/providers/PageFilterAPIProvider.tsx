import { useApolloClient } from "@apollo/client";
import { FilterAPIProvider } from "../FilterAPIProvider";
import { PageTypesHandler } from "../Handler";
import { getFilterElement } from "../utils";
import { FilterContainer } from "../../FilterElement/FilterElement";

export const usePageAPIProvider = (): FilterAPIProvider => {
  const client = useApolloClient();

  const fetchRightOptions = async (
    position: string,
    value: FilterContainer,
    inputValue: string,
  ) => {
    const index = parseInt(position, 10);
    const filterElement = getFilterElement(value, index);

    const rowType = filterElement.rowType();

    if (rowType === "pageTypes") {
      return new PageTypesHandler(client, inputValue).fetch();
    }

    throw new Error(`Unknown filter element: "${rowType}"`);
  };

  const fetchAttributeOptions = async () => {
    return [];
  };

  return {
    fetchRightOptions,
    fetchAttributeOptions,
  };
};
