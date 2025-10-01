import { TopNav } from "@dashboard/components/AppLayout";
import { messages } from "@dashboard/extensions/messages";
import { MANIFEST_FORMAT_DOCS_URL } from "@dashboard/links";
import { FormattedMessage } from "react-intl";

import { previousPagePath } from "../consts";
import { ExternalLinkUnstyled } from "../../../components/ExternalLinkUnstyled/ExternalLinkUnstyled";

export const InstallTopNav = ({
  title,
  showDocsLink = true,
}: {
  title: string;
  showDocsLink?: boolean;
}) => {
  return (
    <TopNav
      href={previousPagePath}
      __height="auto"
      title={title}
      subtitle={
        showDocsLink && (
          <FormattedMessage
            {...messages.learnMoreSubheader}
            values={{
              manifestFormatLink: (
                <ExternalLinkUnstyled href={MANIFEST_FORMAT_DOCS_URL} target="_blank">
                  <FormattedMessage {...messages.manifestFormatLink} />
                </ExternalLinkUnstyled>
              ),
            }}
          />
        )
      }
    />
  );
};
