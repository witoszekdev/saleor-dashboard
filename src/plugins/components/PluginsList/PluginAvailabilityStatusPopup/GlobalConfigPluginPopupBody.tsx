// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { CardSpacer } from "@dashboard/components/CardSpacer";
import { PluginBaseFragment } from "@dashboard/graphql";
import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { globalConfigPluginMessages as messages, pluginStatusMessages } from "../messages";
import { Pill } from "../../../../components/Pill/Pill";

interface GlobalConfigPluginPopupBodyProps {
  plugin: PluginBaseFragment;
}

const GlobalConfigPluginPopupBody = ({ plugin }: GlobalConfigPluginPopupBodyProps) => {
  const intl = useIntl();
  const { active } = plugin.globalConfiguration;

  return (
    <>
      <DashboardCard.Content>
        <Text>{intl.formatMessage(messages.title)}</Text>
        <CardSpacer />
        <Text size={2} fontWeight="light">
          {intl.formatMessage(messages.description)}
        </Text>
        <CardSpacer />
        <Pill
          color={active ? "success" : "error"}
          label={intl.formatMessage(
            active ? pluginStatusMessages.active : pluginStatusMessages.deactivated,
          )}
        />
      </DashboardCard.Content>
    </>
  );
};

export { GlobalConfigPluginPopupBody };
