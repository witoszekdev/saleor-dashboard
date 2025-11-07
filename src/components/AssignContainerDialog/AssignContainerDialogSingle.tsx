import { ConditionalFilters } from "@dashboard/components/ConditionalFilter";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableRowLink from "@dashboard/components/TableRowLink";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQueryFromUrl from "@dashboard/hooks/useSearchQueryFromUrl";
import { Container, FetchMoreProps } from "@dashboard/types";
import { CircularProgress, Radio, TableBody, TableCell, TextField } from "@material-ui/core";
import { Box, Button, DropdownButton, Popover, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import BackButton from "../BackButton";
import { useStyles } from "./styles";

type Labels = Record<"confirmBtn" | "title" | "label" | "placeholder", string>;

interface AssignContainerDialogSingleProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  containers: Container[];
  loading: boolean;
  labels: Labels;
  onFetch: (value: string) => void;
  onSubmit: (data: Container[]) => void;
  onClose: () => void;
  selectedId?: string;
  emptyMessage?: string;
  open: boolean;
}

const scrollableTargetId = "assignContainerScrollableDialog";

export const AssignContainerDialogSingle = (props: AssignContainerDialogSingleProps) => {
  const {
    confirmButtonState,
    containers,
    hasMore,
    loading,
    labels,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
    selectedId,
    emptyMessage,
    open,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQueryFromUrl(onFetch);
  const [selectedContainerId, setSelectedContainerId] = useState<string>(selectedId ?? "");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Access ConditionalFilter context (provided by AssignAttributeValueDialog wrapper)
  const conditionalFilterContext = useConditionalFilterContext();
  const { valueProvider, containerState } = conditionalFilterContext || {};

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onClose: handleClose,
  });

  const handleSubmit = () => {
    if (selectedContainerId) {
      const selectedContainer = containers.find(c => c.id === selectedContainerId);

      onSubmit(selectedContainer ? [selectedContainer] : []);
    } else {
      onSubmit([]);
    }
  };

  const handleContainerSelect = (containerId: string) => {
    setSelectedContainerId(containerId === selectedContainerId ? "" : containerId);
  };

  return (
    <>
      <Box display="flex" gap={2} alignItems="flex-end">
        <Box flexGrow="1">
          <TextField
            name="query"
            value={query}
            onChange={onQueryChange}
            label={labels.label}
            placeholder={labels.placeholder}
            fullWidth
            InputProps={{
              autoComplete: "off",
              endAdornment: loading && <CircularProgress size={16} />,
            }}
          />
        </Box>
        {conditionalFilterContext && (
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <Popover.Trigger>
              <DropdownButton data-test-id="filters-button">
                {intl.formatMessage(
                  {
                    id: "ZcpkEs",
                    defaultMessage: "Filters{count, plural, =0 {} other { ({count})}}",
                  },
                  {
                    count: valueProvider?.count || 0,
                  },
                )}
              </DropdownButton>
            </Popover.Trigger>
            <Popover.Content align="start" onInteractOutside={() => containerState?.clearEmpty()}>
              <Box
                __minHeight="250px"
                __minWidth="636px"
                display="grid"
                __gridTemplateRows="auto 1fr"
              >
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
                  <Text>
                    {intl.formatMessage({
                      id: "zSOvI0",
                      defaultMessage: "Filters",
                    })}
                  </Text>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Popover.Close>
                      <Button
                        variant="tertiary"
                        onClick={() => {
                          containerState?.clearEmpty();
                          setIsFilterOpen(false);
                        }}
                      >
                        {intl.formatMessage({
                          id: "rbrahO",
                          defaultMessage: "Close",
                        })}
                      </Button>
                    </Popover.Close>
                  </Box>
                </Box>
                <ConditionalFilters onClose={() => setIsFilterOpen(false)} />
              </Box>
            </Popover.Content>
          </Popover>
        )}
      </Box>

      <InfiniteScroll
        id={scrollableTargetId}
        dataLength={containers?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable>
          <TableBody>
            {!loading && (containers?.length ?? 0) === 0 && (
              <Text>
                <Text>{emptyMessage ?? "No objects found"}</Text>
              </Text>
            )}
            {containers?.map(container => {
              const isSelected = selectedContainerId === container.id;

              return (
                <TableRowLink
                  key={container.id}
                  data-test-id="dialog-row"
                  onClick={() => handleContainerSelect(container.id)}
                >
                  <TableCell padding="checkbox" className={classes.checkboxCell}>
                    <Radio
                      checked={isSelected}
                      onChange={() => handleContainerSelect(container.id)}
                      value={container.id}
                      name="container-selection"
                    />
                  </TableCell>
                  <TableCell className={classes.wideCell} data-test-id={container.name}>
                    {container.name}
                  </TableCell>
                </TableRowLink>
              );
            })}
          </TableBody>
        </ResponsiveTable>
      </InfiniteScroll>

      <DashboardModal.Actions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="assign-and-save-button"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels.confirmBtn}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};

AssignContainerDialogSingle.displayName = "AssignContainerDialogSingle";
