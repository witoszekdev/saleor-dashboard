import { TableCell } from "@material-ui/core";
import { Skeleton } from "@saleor/macaw-ui-next";

import { useStyles } from "./styles";
import { TableRowLink } from "../../../components/TableRowLink/TableRowLink";

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
