// @ts-strict-ignore
import {
  LanguageCodeEnum,
  useUpdateVoucherTranslationsMutation,
  useVoucherTranslationDetailsQuery,
} from "@dashboard/graphql";
import { useNavigator } from "@dashboard/hooks/useNavigator";
import { useShop } from "@dashboard/hooks/useShop";
import { commonMessages } from "@dashboard/intl";
import { stringifyQs } from "@dashboard/utils/urls";
import { useIntl } from "react-intl";

import { extractMutationErrors, maybe } from "../../misc";
import { TranslationField, TranslationInputFieldName } from "../types";
import { getParsedTranslationInputData } from "../utils";
import { useNotifier } from "../../hooks/useNotifier/useNotifier";
import { TranslationsVouchersPage } from "../components/TranslationsVouchersPage/TranslationsVouchersPage";

export interface TranslationsVouchersQueryParams {
  activeField: string;
}
interface TranslationsVouchersProps {
  id: string;
  languageCode: LanguageCodeEnum;
  params: TranslationsVouchersQueryParams;
}

const TranslationsVouchers = ({ id, languageCode, params }: TranslationsVouchersProps) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const voucherTranslations = useVoucherTranslationDetailsQuery({
    variables: { id, language: languageCode },
  });
  const [updateTranslations, updateTranslationsOpts] = useUpdateVoucherTranslationsMutation({
    onCompleted: data => {
      if (data.voucherTranslate.errors.length === 0) {
        voucherTranslations.refetch();
        notify({
          status: "success",
          text: intl.formatMessage(commonMessages.savedChanges),
        });
        navigate("?", { replace: true });
      }
    },
  });
  const onEdit = (field: string) =>
    navigate(
      "?" +
        stringifyQs({
          activeField: field,
        }),
      { replace: true },
    );
  const onDiscard = () => {
    navigate("?", { replace: true });
  };
  const handleSubmit = (
    { name: fieldName }: TranslationField<TranslationInputFieldName>,
    data: string,
  ) =>
    extractMutationErrors(
      updateTranslations({
        variables: {
          id,
          input: getParsedTranslationInputData({
            data,
            fieldName,
          }),
          language: languageCode,
        },
      }),
    );
  const translation = voucherTranslations?.data?.translation;

  return (
    <TranslationsVouchersPage
      translationId={id}
      activeField={params.activeField}
      disabled={voucherTranslations.loading || updateTranslationsOpts.loading}
      languages={maybe(() => shop.languages, [])}
      languageCode={languageCode}
      saveButtonState={updateTranslationsOpts.status}
      onEdit={onEdit}
      onDiscard={onDiscard}
      onSubmit={handleSubmit}
      data={translation?.__typename === "VoucherTranslatableContent" ? translation : null}
    />
  );
};

TranslationsVouchers.displayName = "TranslationsVouchers";
export { TranslationsVouchers };
