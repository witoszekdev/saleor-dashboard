import { discountListUrl } from "@dashboard/discounts/discountsUrls";
import { usePromotionDeleteMutation } from "@dashboard/graphql";
import { useNavigator } from "@dashboard/hooks/useNavigator";
import { useIntl } from "react-intl";

import { useNotifier } from "../../../../hooks/useNotifier/useNotifier";

export const usePromotionDelete = () => {
  const intl = useIntl();
  const notify = useNotifier();
  const navigate = useNavigator();
  const [promotionDelete, promotionDeleteOpts] = usePromotionDeleteMutation({
    onCompleted(data) {
      if (data?.promotionDelete?.errors?.length === 0) {
        notify({
          status: "success",
          text: intl.formatMessage({
            id: "4LRapg",
            defaultMessage: "Discount removed",
          }),
        });
        navigate(discountListUrl());
      }
    },
  });

  return {
    promotionDelete,
    promotionDeleteOpts,
  };
};
