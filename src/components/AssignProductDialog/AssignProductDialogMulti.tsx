// @ts-strict-ignore
import { ConditionalFilters } from "@dashboard/components/ConditionalFilter";
import { useConditionalFilterContext } from "@dashboard/components/ConditionalFilter/context";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { InfiniteScroll } from "@dashboard/components/InfiniteScroll";
import { DashboardModal } from "@dashboard/components/Modal";
import ResponsiveTable from "@dashboard/components/ResponsiveTable";
import TableCellAvatar from "@dashboard/components/TableCellAvatar";
import TableRowLink from "@dashboard/components/TableRowLink";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useSearchQueryFromUrl from "@dashboard/hooks/useSearchQueryFromUrl";
import { maybe } from "@dashboard/misc";
import { Container, FetchMoreProps } from "@dashboard/types";
import { CircularProgress, TableBody, TableCell, TextField } from "@material-ui/core";
import { Box, Button, DropdownButton, Popover, Text } from "@saleor/macaw-ui-next";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import BackButton from "../BackButton";
import Checkbox from "../Checkbox";
import { messages } from "./messages";
import { useStyles } from "./styles";
import { Products, SelectedChannel } from "./types";
import { isProductAvailableInVoucherChannels } from "./utils";

interface AssignProductDialogMultiProps extends FetchMoreProps {
  confirmButtonState: ConfirmButtonTransitionState;
  products: Products;
  selectedChannels?: SelectedChannel[];
  productUnavailableText?: string;
  selectedIds?: Record<string, boolean>;
  loading: boolean;
  onFetch: (value: string) => void;
  onSubmit: (data: Array<Container & Omit<Partial<Products[number]>, "name">>) => void;
  onClose: () => void;
  labels?: {
    confirmBtn?: string;
  };
  open: boolean;
}

const scrollableTargetId = "assignProductScrollableDialog";

export const AssignProductDialogMulti = (props: AssignProductDialogMultiProps) => {
  const {
    confirmButtonState,
    selectedChannels,
    productUnavailableText,
    hasMore,
    loading,
    products,
    onClose,
    onFetch,
    onFetchMore,
    onSubmit,
    selectedIds,
    labels,
    open,
  } = props;
  const classes = useStyles(props);
  const intl = useIntl();
  const [query, onQueryChange, queryReset] = useSearchQueryFromUrl(onFetch);
  const [productsDict, setProductsDict] = useState(selectedIds || {});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Access ConditionalFilter context (provided by AssignAttributeValueDialog wrapper)
  const conditionalFilterContext = useConditionalFilterContext();
  const { valueProvider, containerState } = conditionalFilterContext || {};

  // Keep selected product data to send them back when submitting
  const productsData = useRef<Products>([]);

  useEffect(() => {
    if (selectedIds) {
      setProductsDict(prev => {
        const prevIds = Object.keys(prev);
        const newIds = Object.keys(selectedIds);
        const preSelected = newIds
          .filter(n => !prevIds.includes(n))
          .reduce((p, c) => ({ ...p, [c]: true }), {});

        return { ...prev, ...preSelected };
      });
    }
  }, [selectedIds]);

  const handleSubmit = () => {
    const selectedProductsAsArray = Object.keys(productsDict)
      .filter(key => productsDict[key])
      .map(key => key);

    onSubmit(
      selectedProductsAsArray.map(id => {
        const productDetails = productsData.current.find(product => product.id === id);

        return {
          id,
          name: productDetails?.name,
          ...(productDetails ?? {}),
        };
      }),
    );
  };

  const handleChange = productId => {
    const productData = products.find(product => product.id === productId);

    if (productData) {
      productsData.current = [...productsData.current, productData];
    }

    setProductsDict(prev => ({
      ...prev,
      [productId]: prev[productId] ? false : true,
    }));
  };

  const handleClose = () => {
    queryReset();
    onClose();
  };

  useModalDialogOpen(open, {
    onOpen: () => {
      queryReset();
      setProductsDict(selectedIds || {});
    },
    onClose: handleClose,
  });

  return (
    <>
      <Box display="flex" gap={2} alignItems="flex-end">
        <Box flexGrow="1">
          <TextField
            name="query"
            value={query}
            onChange={onQueryChange}
            label={intl.formatMessage(messages.assignProductDialogSearch)}
            placeholder={intl.formatMessage(messages.assignProductDialogContent)}
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
        dataLength={products?.length ?? 0}
        next={onFetchMore}
        hasMore={hasMore}
        scrollThreshold="100px"
        scrollableTarget={scrollableTargetId}
      >
        <ResponsiveTable key="table">
          <TableBody>
            {products &&
              products.map(product => {
                const isSelected = productsDict[product.id] || false;
                const isProductAvailable = isProductAvailableInVoucherChannels(
                  product.channelListings,
                  selectedChannels,
                );

                return (
                  <TableRowLink key={product.id} data-test-id="assign-product-table-row">
                    <TableCell padding="checkbox" className={classes.checkboxCell}>
                      <Checkbox
                        checked={isSelected}
                        disabled={!isProductAvailable}
                        onChange={() => handleChange(product.id)}
                      />
                    </TableCell>
                    <TableCellAvatar
                      className={classes.avatar}
                      thumbnail={maybe(() => product.thumbnail.url)}
                      style={{
                        opacity: !isProductAvailable ? 0.5 : 1,
                      }}
                    />
                    <TableCell className={classes.colName}>
                      {product.name}
                      {!isProductAvailable && productUnavailableText && (
                        <Text display="block" size={1} color="default2">
                          {productUnavailableText}
                        </Text>
                      )}
                    </TableCell>
                  </TableRowLink>
                );
              })}
            {!loading && (products?.length ?? 0) === 0 && (
              <Text>
                <Text>{intl.formatMessage(messages.noProductsFound)}</Text>
              </Text>
            )}
          </TableBody>
        </ResponsiveTable>
      </InfiniteScroll>

      <DashboardModal.Actions>
        <BackButton onClick={handleClose} />
        <ConfirmButton
          data-test-id="submit"
          transitionState={confirmButtonState}
          type="submit"
          onClick={handleSubmit}
        >
          {labels?.confirmBtn ?? <FormattedMessage {...messages.assignProductDialogButton} />}
        </ConfirmButton>
      </DashboardModal.Actions>
    </>
  );
};
