import { GiftCardsListPage as GiftCardListPage } from "./GiftCardListPage";
import { GiftCardListUrlQueryParams } from "./types";
import { GiftCardListDialogsProvider } from "./providers/GiftCardListDialogsProvider/GiftCardListDialogsProvider";
import { GiftCardsListProvider } from "./providers/GiftCardListProvider/GiftCardListProvider";

interface GiftCardsListProps {
  params: GiftCardListUrlQueryParams;
}

const GiftCardsList = ({ params }: GiftCardsListProps) => (
  <GiftCardsListProvider params={params}>
    <GiftCardListDialogsProvider params={params}>
      <GiftCardListPage />
    </GiftCardListDialogsProvider>
  </GiftCardsListProvider>
);

export { GiftCardsList };
