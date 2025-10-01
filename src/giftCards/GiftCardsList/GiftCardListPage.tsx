import { GiftCardListSearchAndFilters } from "./GiftCardListSearchAndFilters/GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid/GiftCardsListDatagrid";
import { GiftCardsListHeader } from "./GiftCardsListHeader/GiftCardsListHeader";

const GiftCardsListPage = () => (
  <>
    <GiftCardsListHeader />
    <GiftCardListSearchAndFilters />
    <GiftCardsListDatagrid />
  </>
);

export { GiftCardsListPage };
