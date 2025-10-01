import { useShippingMethodTranslationsQuery } from "@dashboard/graphql";
import { PaginatorContext, usePaginator } from "@dashboard/hooks/usePaginator";
import { languageEntityUrl, TranslatableEntities } from "@dashboard/translations/urls";

import { TranslationsEntitiesList } from "../../components/TranslationsEntitiesList/TranslationsEntitiesList";
import { TranslationsEntityListProps } from "./types";
import { mapTranslationsToEntities } from "./utils";

const TranslationsShippingMethodList = ({ params, variables }: TranslationsEntityListProps) => {
  const { data, loading } = useShippingMethodTranslationsQuery({
    displayLoader: true,
    variables,
  });
  const paginationValues = usePaginator({
    pageInfo: data?.translations?.pageInfo,
    paginationState: variables,
    queryString: params,
  });

  return (
    <PaginatorContext.Provider value={paginationValues}>
      <TranslationsEntitiesList
        disabled={loading}
        entities={mapTranslationsToEntities(data)}
        getRowHref={id =>
          languageEntityUrl(variables.language, TranslatableEntities.shippingMethods, id)
        }
      />
    </PaginatorContext.Provider>
  );
};

export { TranslationsShippingMethodList };
