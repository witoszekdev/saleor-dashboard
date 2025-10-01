import { OrderGrantedRefundStatusEnum } from "@dashboard/graphql";

import { Pill } from "../../../../../components/Pill/Pill";

interface OrderTransactionRefundStatusPillProps {
  status: OrderGrantedRefundStatusEnum;
  label?: string;
  size?: "small" | "medium";
}

const getStatusColor = (status: OrderGrantedRefundStatusEnum) => {
  switch (status) {
    case OrderGrantedRefundStatusEnum.SUCCESS:
      return "success";
    case OrderGrantedRefundStatusEnum.FAILURE:
      return "error";
    case OrderGrantedRefundStatusEnum.NONE:
      return "generic";
    case OrderGrantedRefundStatusEnum.PENDING:
      return "info";
    default:
      return "generic";
  }
};

export const OrderTransactionRefundStatusPill = ({
  status,
  label,
  size,
}: OrderTransactionRefundStatusPillProps) => {
  return <Pill color={getStatusColor(status)} label={label ?? status} size={size} />;
};
