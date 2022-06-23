import * as React from "react";
import { DeleteRounded, Edit } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
} from "@mui/material";
import DataTableHeader from "./DataTableHeader";
import DataTableToolBar from "./DataTableToolBar";
import { DataTableProps, Order } from "@helpers/interface";

export default function DataTable(props: DataTableProps) {
  const {
    rows,
    header,
    page,
    rowsPerPage,
    actionButtons = false,
    enableSelection = true,
    setPage,
    setRowsPerPage,
    rowsCount,
    onRowEdit,
    onRowDelete,
    onColumnSort,
    searchString,
  } = props;
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [dense, setDense] = React.useState(false);
  const [activeColumns, setActiveColumns] = React.useState<any>([]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = () => {
    setDense(!dense);
  };

  const handleChangeActiveColumn = (id) => {
    let arr = activeColumns;

    arr.forEach((column, index) => {
      if (column.id === id) arr[index].active = !column.active;
    });

    setActiveColumns([...arr]);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsCount + 1) : 0;

  React.useMemo(() => {
    let arr = [];
    header.map((head) => {
      arr.push({
        id: head.id,
        active: true,
        label: head.label,
      });
    });
    // arr !== activeColumns ? setActiveColumns(arr) : null;
    setActiveColumns([...arr]);
  }, []);

  React.useEffect(() => {
    onColumnSort(order, orderBy);
  }, [order, orderBy]);


  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataTableToolBar
          numSelected={selected.length}
          dense={dense}
          onDenseChange={handleChangeDense}
          activeColumns={activeColumns}
          onChangeActiveColumn={(id) => handleChangeActiveColumn(id)}
          searchString={(str) => searchString(str)}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <DataTableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={header}
              enableSelection={enableSelection}
              actionButtons={actionButtons}
              activeColumns={activeColumns}
            />
            <TableBody>
              {[...rows].map((row: any, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) =>
                      enableSelection ? handleClick(event, row.id) : null
                    }
                    role={enableSelection ? "checkbox" : "list"}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {enableSelection ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                    ) : (
                      ""
                    )}
                    {header.map((headCell) => {
                      const active = activeColumns
                        .filter((item) => item.id === headCell.id)
                        .map((item) => item.active);
                      return (
                        <TableCell
                          key={headCell.id}
                          align={headCell.numeric ? "right" : "left"}
                          padding={headCell.disablePadding ? "none" : "normal"}
                          sx={{
                            display: active[0] ? "" : "none",
                          }}
                        >
                          {row[headCell.id]}
                        </TableCell>
                      );
                    })}
                    {actionButtons ? (
                      <TableCell>
                        <Box display={"flex"}>
                          <Tooltip title="Edit">
                            <IconButton
                              color="info"
                              size={dense ? "small" : "medium"}
                              onClick={() => onRowEdit(row)}
                            >
                              <Edit fontSize={dense ? "small" : "inherit"} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              size={dense ? "small" : "medium"}
                              onClick={() => onRowDelete(row)}
                            >
                              <DeleteRounded
                                fontSize={dense ? "small" : "inherit"}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    ) : (
                      ""
                    )}
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={rowsCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
