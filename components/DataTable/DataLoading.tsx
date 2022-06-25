import * as React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { TableCell, TableRow } from "@mui/material";

interface DataLoadingProps {
  columnCount: number;
}

export default function DataLoading(props: DataLoadingProps) {
  const { columnCount } = props;
  return (
    <React.Fragment>
      <TableRow sx={{ width: "100%" }}>
        <TableCell colSpan={columnCount} sx={{ p: 0, borderBottom: "none" }}>
          <LinearProgress />
        </TableCell>
      </TableRow>
      <TableRow sx={{ width: "100%" }}>
        <TableCell
          colSpan={columnCount}
          sx={{ p: 3, borderBottom: "none" }}
          align={"center"}
        >
          Please wait. Loading..
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
