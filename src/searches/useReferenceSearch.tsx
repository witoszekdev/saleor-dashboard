import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import {
  AttributeDetailsFragment,
  PageWhereInput,
  ProductWhereInput,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import usePageSearch from "@dashboard/searches/usePageSearch";
import useProductSearch from "@dashboard/searches/useProductSearch";
import { useMemo } from "react";

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
  additionalWhere?: ProductWhereInput | PageWhereInput,
) => {
  const baseWhere = allowedIds?.length ? { [whereKey]: { oneOf: allowedIds } } : {};
  const mergedWhere =
    additionalWhere && Object.keys(additionalWhere).length > 0
      ? { ...baseWhere, ...additionalWhere }
      : baseWhere;

  return {
    ...DEFAULT_INITIAL_SEARCH_DATA,
    ...(Object.keys(mergedWhere).length > 0 ? { where: mergedWhere } : {}),
  };
};

export const useReferenceProductSearch = (
  refAttr: AttributeWithReferenceTypes | undefined,
  additionalWhere?: ProductWhereInput,
) => {
  const ids = useMemo(
    () => getAllowedReferenceTypeIds(refAttr, ReferenceType.ProductType),
    [refAttr],
  );
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.ProductType, additionalWhere),
    [ids, additionalWhere],
  );

  return useProductSearch({ variables });
};

export const useReferencePageSearch = (
  refAttr: AttributeWithReferenceTypes | undefined,
  additionalWhere?: PageWhereInput,
) => {
  const ids = useMemo(() => getAllowedReferenceTypeIds(refAttr, ReferenceType.PageType), [refAttr]);
  const variables = useMemo(
    () => buildReferenceSearchVariables(ids, ReferenceWhereKey.PageType, additionalWhere),
    [ids, additionalWhere],
  );

  return usePageSearch({ variables });
};
