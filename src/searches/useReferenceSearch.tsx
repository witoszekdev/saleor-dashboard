import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeDetailsFragment,
  ProductWhereInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { useCallback, useMemo, useState } from "react";

import { ReferenceProductFilterVariables } from "./types";

enum ReferenceType {
  ProductType = "ProductType",
  PageType = "PageType",
}

enum ReferenceWhereKey {
  ProductType = "productType",
  PageType = "pageType",
}

type AttributeWithReferenceTypes =
  | NonNullable<AttributeDetailsFragment>
  | NonNullable<VariantAttributeFragment>;

const getAllowedReferenceTypeIds = (
  refAttr: AttributeWithReferenceTypes | undefined,
  type: ReferenceType,
): string[] => {
  if (refAttr?.referenceTypes?.[0]?.__typename === type) {
    return (refAttr.referenceTypes ?? []).map(t => t?.id);
  }

  return [];
};

const buildReferenceSearchVariables = (
  allowedIds: string[] | undefined,
  whereKey: ReferenceWhereKey,
) => ({
  ...DEFAULT_INITIAL_SEARCH_DATA,
  ...(allowedIds?.length ? { where: { [whereKey]: { oneOf: allowedIds } } } : {}),
});

const mergeWhereInputs = (
  baseWhere?: ProductWhereInput,
  filters?: ProductWhereInput,
): ProductWhereInput | undefined => {
  if (!baseWhere) {
    return filters;
  }

  if (!filters) {
    return baseWhere;
  }

  return {
    AND: [baseWhere, filters],
  };
};

export const useReferenceProductSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const baseVariables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType),
    [ids],
  );

  const [filters, setFilters] = useState<ProductWhereInput | undefined>();
  const [channel, setChannel] = useState<string | undefined>();

  const variables = useMemo(
    () => ({
      ...baseVariables,
      where: mergeWhereInputs(baseVariables.where as ProductWhereInput | undefined, filters),
      channel: channel ?? (baseVariables as { channel?: string }).channel,
    }),
    [baseVariables, filters, channel],
  );

  const searchHook = useProductSearch({ variables });

  const setFilterVariables = useCallback(
    ({ where, channel: channelSlug }: ReferenceProductFilterVariables) => {
      setFilters(where);
      setChannel(channelSlug);
    },
    [],
  );

  return {
    ...searchHook,
    setFilterVariables,
  };
};

export const useReferencePageSearch = (refAttr: AttributeWithReferenceTypes | undefined) => {
  const ids = useMemo(() => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType), [refAttr]);
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType),
    [ids],
  );

  return usePageSearch({ variables });
};
