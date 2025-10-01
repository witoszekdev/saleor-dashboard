import { GiftCardUpdatePage } from "./GiftCardUpdatePage";
import { GiftCardUpdateFormProvider } from "./providers/GiftCardUpdateFormProvider/GiftCardUpdateFormProvider";
import { GiftCardUpdatePageUrlQueryParams } from "./types";
import { GiftCardDetailsProvider } from "./providers/GiftCardDetailsProvider/GiftCardDetailsProvider";
import { GiftCardUpdateDialogsProvider } from "./providers/GiftCardUpdateDialogsProvider/GiftCardUpdateDialogsProvider";

interface GiftCardUpdateProps {
  params: GiftCardUpdatePageUrlQueryParams;
  id: string;
}

const GiftCardUpdate = ({ id, params }: GiftCardUpdateProps) => (
  <GiftCardDetailsProvider id={id}>
    <GiftCardUpdateFormProvider>
      <GiftCardUpdateDialogsProvider id={id} params={params}>
        <GiftCardUpdatePage />
      </GiftCardUpdateDialogsProvider>
    </GiftCardUpdateFormProvider>
  </GiftCardDetailsProvider>
);

export { GiftCardUpdate };
