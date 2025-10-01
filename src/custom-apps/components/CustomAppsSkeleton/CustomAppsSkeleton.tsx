import { TableCell } from "@material-ui/core";
import { Skeleton } from "@saleor/macaw-ui-next";

import { TableRowLink } from "../../../components/TableRowLink/TableRowLink";
import { useStyles } from "./styles";

const CustomAppsSkeleton = () => {
  const classes = useStyles();

  return (
    <TableRowLink className={classes.tableRow}>
      <TableCell colSpan={2} className={classes.colName}>
        <Skeleton />
      </TableCell>
    </TableRowLink>
  );
};

CustomAppsSkeleton.displayName = "CustomAppsSkeleton";
export { CustomAppsSkeleton };
