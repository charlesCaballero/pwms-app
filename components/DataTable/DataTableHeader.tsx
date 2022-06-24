import {
  Box,
  Checkbox,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { visuallyHidden } from "@mui/utils";
import { EnhancedTableProps } from "material-ui-datatable-api/dist/interfaces";
import React from "react";

export default function DataTableHeader(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    enableSelection,
    actionButtons,
    activeColumns,
  } = props;
  const createSortHandler =
    (property: any) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead sx={{ bgcolor: grey[200] }}>
      <TableRow>
        {enableSelection ? (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
        ) : (
          ""
        )}
        {headCells.map((headCell) => {
          const active = activeColumns
            .filter((item) => item.id === headCell.id)
            .map((item) => item.active);

          return (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{
                fontWeight: "bold",
                fontSize: 15,
                display: active[0] ? "" : "none",
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
        {actionButtons ? <TableCell align="left"></TableCell> : ""}
      </TableRow>
    </TableHead>
  );
}
