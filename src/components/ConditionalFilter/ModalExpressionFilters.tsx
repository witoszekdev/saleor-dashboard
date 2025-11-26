import { Box, Button, CloseIcon, DropdownButton, Popover, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { ConditionalFilters } from "./ConditionalFilters";
import { conditionalFilterMessages } from "./messages";
import { useConditionalFilterContext } from "./context";

/**
 * A compact version of ExpressionFilters designed for use in modals.
 * This component provides filtering capabilities without taking up too much vertical space.
 */
export const ModalExpressionFilters = () => {
  const { formatMessage } = useIntl();
  const { valueProvider, containerState, filterWindow } = useConditionalFilterContext();
  const clearEmpty = () => {
    containerState.clearEmpty();
  };

  return (
    <Popover open={filterWindow.isOpen} onOpenChange={open => filterWindow.setOpen(open)}>
      <Popover.Trigger>
        <DropdownButton data-test-id="modal-filters-button">
          {formatMessage(conditionalFilterMessages.popoverTrigger, {
            count: valueProvider.count,
          })}
        </DropdownButton>
      </Popover.Trigger>
      <Popover.Content align="start" onInteractOutside={clearEmpty}>
        <Box __minHeight="250px" __minWidth="636px" display="grid" __gridTemplateRows="auto 1fr">
          <Popover.Arrow fill="default1" />
          <Box
            paddingTop={3}
            paddingX={3}
            paddingBottom={1.5}
            display="flex"
            gap={1}
            alignItems="center"
            justifyContent="space-between"
            backgroundColor="default1"
            borderTopLeftRadius={2}
            borderTopRightRadius={2}
          >
            <Text>{formatMessage(conditionalFilterMessages.popoverTitle)}</Text>
            <Box display="flex" alignItems="center" gap={2}>
              <Popover.Close>
                <Button variant="tertiary" icon={<CloseIcon />} onClick={clearEmpty} />
              </Popover.Close>
            </Box>
          </Box>
          <ConditionalFilters onClose={() => filterWindow.setOpen(false)} />
        </Box>
      </Popover.Content>
    </Popover>
  );
};
