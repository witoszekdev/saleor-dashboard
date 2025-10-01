import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { Savebar } from "@dashboard/components/Savebar";
import { ProductErrorFragment } from "@dashboard/graphql";
import { useNavigator } from "@dashboard/hooks/useNavigator";
import { Box } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { ConfirmButtonTransitionState } from "../../../components/ConfirmButton/ConfirmButton";
import { DetailPageLayout } from "../../../components/Layouts/Detail/index";
import { Metadata } from "../../../components/Metadata/Metadata";
import { SeoForm } from "../../../components/SeoForm/SeoForm";
import { CategoryDetailsForm } from "../CategoryDetailsForm/CategoryDetailsForm";
import { CategoryCreateData, CategoryCreateForm } from "./form";

interface CategoryCreatePageProps {
  errors: ProductErrorFragment[];
  disabled: boolean;
  saveButtonBarState: ConfirmButtonTransitionState;
  backUrl: string;
  onSubmit: (data: CategoryCreateData) => any;
}

const CategoryCreatePage = ({
  disabled,
  onSubmit,
  errors,
  saveButtonBarState,
  backUrl,
}: CategoryCreatePageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <CategoryCreateForm onSubmit={onSubmit} disabled={disabled}>
      {({ data, change, handlers, submit, isSaveDisabled }) => (
        <DetailPageLayout gridTemplateColumns={1}>
          <TopNav
            href={backUrl}
            title={intl.formatMessage({
              id: "cgsY/X",
              defaultMessage: "Create New Category",
              description: "page header",
            })}
          />
          <DetailPageLayout.Content>
            <Box height="100vh" __marginBottom="auto">
              <CategoryDetailsForm
                data={data}
                disabled={disabled}
                errors={errors}
                onChange={change}
              />
              <CardSpacer />
              <SeoForm
                allowEmptySlug={true}
                helperText={intl.formatMessage({
                  id: "wQdR8M",
                  defaultMessage:
                    "Add search engine title and description to make this category easier to find",
                })}
                slug={data.slug}
                slugPlaceholder={data.name}
                title={data.seoTitle}
                titlePlaceholder={data.name}
                description={data.seoDescription}
                descriptionPlaceholder={data.name}
                loading={disabled}
                onChange={change}
                disabled={disabled}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
            </Box>
          </DetailPageLayout.Content>
          <Savebar>
            <Savebar.Spacer />
            <Savebar.CancelButton onClick={() => navigate(backUrl)} />
            <Savebar.ConfirmButton
              transitionState={saveButtonBarState}
              onClick={submit}
              disabled={isSaveDisabled}
            />
          </Savebar>
        </DetailPageLayout>
      )}
    </CategoryCreateForm>
  );
};

CategoryCreatePage.displayName = "CategoryCreatePage";
export { CategoryCreatePage };
