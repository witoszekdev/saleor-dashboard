// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { TransactionActionEnum } from "@dashboard/graphql";
import { TransactionFakeEvent } from "@dashboard/orders/types";
import * as React from "react";
import { ExtendedOrderTransaction } from "./types";
import { getTransactionEvents } from "./utils";
import { OrderTransactionCardTitle } from "./components/CardTitle/index";
import { TransactionEvents } from "./components/TransactionEvents/TransactionEvents";

export interface OrderTransactionProps {
  transaction: ExtendedOrderTransaction;
  fakeEvents?: TransactionFakeEvent[];
  onTransactionAction: (transactionId: string, actionType: TransactionActionEnum) => void;
  showActions?: boolean;
  cardFooter?: React.ReactNode;
  disabled?: boolean;
}

const OrderTransaction = ({
  transaction,
  fakeEvents,
  onTransactionAction,
  showActions,
  cardFooter,
  disabled = false,
}: OrderTransactionProps) => {
  const events = getTransactionEvents(transaction, fakeEvents);

  return (
    <DashboardCard __opacity={disabled ? "0.6" : "1"} data-test-id="orderTransactionsList">
      <DashboardCard.Header>
        <OrderTransactionCardTitle
          transaction={transaction}
          onTransactionAction={onTransactionAction}
          showActions={showActions}
        />
      </DashboardCard.Header>

      <DashboardCard.Content paddingX={0}>
        <TransactionEvents events={events} />
        {cardFooter}
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export { OrderTransaction };
