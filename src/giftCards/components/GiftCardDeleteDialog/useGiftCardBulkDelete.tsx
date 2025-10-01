import { BulkDeleteGiftCardMutation, useBulkDeleteGiftCardMutation } from "@dashboard/graphql";
import { MutationResultWithOpts } from "@dashboard/hooks/makeMutation";
import { commonErrorMessages } from "@dashboard/utils/errors/common";
import { useIntl } from "react-intl";

import { giftCardDeleteDialogMessages as messages } from "./messages";
import { useGiftCardList } from "../../GiftCardsList/providers/GiftCardListProvider/GiftCardListProvider";
import { useNotifier } from "../../../hooks/useNotifier/useNotifier";

interface UseGiftCardBulkDeleteProps {
  onBulkDeleteGiftCards: () => void;
  bulkDeleteGiftCardOpts: MutationResultWithOpts<BulkDeleteGiftCardMutation>;
}

const useGiftCardBulkDelete = ({
  onClose,
  refetchQueries,
}: {
  onClose: () => void;
  refetchQueries?: string[];
}): UseGiftCardBulkDeleteProps => {
  const notify = useNotifier();
  const intl = useIntl();
  const { selectedRowIds, clearRowSelection } = useGiftCardList();
  const [bulkDeleteGiftCard, bulkDeleteGiftCardOpts] = useBulkDeleteGiftCardMutation({
    onCompleted: data => {
      const errors = data?.giftCardBulkDelete?.errors;

      if (!errors?.length) {
        notify({
          status: "success",
          text: intl.formatMessage(messages.deleteSuccessAlertText, {
            selectedItemsCount: selectedRowIds.length,
          }),
        });
        onClose();
        clearRowSelection();

        return;
      }

      notify({
        status: "error",
        text: intl.formatMessage(commonErrorMessages.unknownError),
      });
    },
    refetchQueries,
  });
  const onBulkDeleteGiftCards = () => bulkDeleteGiftCard({ variables: { ids: selectedRowIds } });

  return {
    onBulkDeleteGiftCards,
    bulkDeleteGiftCardOpts,
  };
};

export { useGiftCardBulkDelete };
