import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { DashboardCard } from "@dashboard/components/Card";
import { configurationMenuUrl } from "@dashboard/configuration";
import { PermissionGroupFragment } from "@dashboard/graphql";
import { useNavigator } from "@dashboard/hooks/useNavigator";
import { sectionNames } from "@dashboard/intl";
import { Button } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { ListPageLayout } from "../../../components/Layouts/List/index";
import { PageListProps, SortPage } from "../../../types";
import { permissionGroupAddUrl, PermissionGroupListUrlSortField } from "../../urls";
import { PermissionGroupListDatagrid } from "../PermissionGroupListDatagrid/PermissionGroupListDatagrid";

interface PermissionGroupListPageProps
  extends PageListProps,
    SortPage<PermissionGroupListUrlSortField> {
  permissionGroups: PermissionGroupFragment[];
}

const PermissionGroupListPage = (listProps: PermissionGroupListPageProps) => {
  const intl = useIntl();
  const navigate = useNavigator();

  return (
    <ListPageLayout>
      <TopNav
        withoutBorder
        href={configurationMenuUrl}
        title={intl.formatMessage(sectionNames.permissionGroups)}
      >
        <Button
          variant="primary"
          onClick={() => navigate(permissionGroupAddUrl)}
          data-test-id="create-permission-group"
        >
          <FormattedMessage
            id="bRJD/v"
            defaultMessage="Create permission group"
            description="button"
          />
        </Button>
      </TopNav>
      <DashboardCard>
        <PermissionGroupListDatagrid {...listProps} />
      </DashboardCard>
    </ListPageLayout>
  );
};

PermissionGroupListPage.displayName = "PermissionGroupListPage";
export { PermissionGroupListPage };
