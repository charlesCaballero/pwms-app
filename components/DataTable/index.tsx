import * as React from "react";
import { DataObject, DeleteRounded, Edit, Feed } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Fade,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import DataTableHeader from "./DataTableHeader";
import DataTableToolBar from "./DataTableToolBar";
import {
  ActiveColumns,
  FilterFields,
  FilterType,
  HeadCell,
  Order,
} from "@helpers/interface";
import DataLoading from "./DataLoading";

interface DataTableProps {
  header: Array<HeadCell>;
  rows: any[];
  rowsPerPage: number;
  page: number;
  rowsCount: number;
  setPage(page: number): void;
  setRowsPerPage(limit: number): void;
  onRowEdit?(row: Object): void;
  onRowDelete?(row: Object): void;
  onRowInfo?(row: Object): void;
  onColumnSort?(order: Order, column: string): void;
  searchString?(str: string): void;
  isDataLoading?: boolean;
  onFilter?(filters: FilterType[]): void;
  onMultipleDelete?(selected: string[]): void;
}

export default function DataTable(props: DataTableProps) {
  const {
    rows,
    header,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    rowsCount,
    onRowEdit,
    onRowDelete,
    onRowInfo,
    onColumnSort,
    searchString,
    isDataLoading,
    onFilter,
    onMultipleDelete,
  } = props;
  const [showRowActionButtons, setShowRowActionButtons] =
    React.useState<boolean>(false);
  const [enableSelection, setEnableSelection] = React.useState<boolean>(false);
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<any>("");
  const [selected, setSelected] = React.useState<string[]>([]);
  const [dense, setDense] = React.useState(false);
  const [activeColumns, setActiveColumns] = React.useState<any>([]);
  const [filters, setFilters] = React.useState<FilterType[]>([]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (_event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeActiveColumn = (id: string) => {
    let arr = activeColumns;

    arr.forEach((column: any, index: number) => {
      if (column.id === id) arr[index].active = !column.active;
    });

    setActiveColumns([...arr]);
  };

  const handleAddFilter = () => {
    let newFilter = filters;
    let unFilteredColumns: any[] = [];
    header.forEach((head) => unFilteredColumns.push(head.id));
    newFilter.forEach((obj) => {
      unFilteredColumns.forEach((value, index) => {
        if (obj.column === value) unFilteredColumns.splice(index, 1);
      });
    });
    newFilter.push({
      column: unFilteredColumns[0],
      operator: "contains",
      value: "",
    });
    setFilters([...newFilter]);
  };

  const handleDeleteFilter = (column: string) => {
    let newFilter = filters;
    newFilter.forEach((obj, index) => {
      if (obj.column === column) newFilter.splice(index, 1);
    });
    setFilters([...newFilter]);
  };

  const handleFilterChange = (
    value: any,
    field: FilterFields,
    column: string
  ) => {
    let newFilter = filters;
    newFilter.forEach((obj, index) => {
      if (obj.column === column) {
        if (field === "column") newFilter[index].column = value;
        else if (field === "operator") newFilter[index].operator = value;
        else newFilter[index].value = value;
      }
    });
    setFilters([...newFilter]);
  };

  const handleMultipleDelete = () => {
    onMultipleDelete !== undefined ? onMultipleDelete(selected) : null;
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsCount + 1) : 0;

  React.useMemo(() => {
    let arr: Array<ActiveColumns> = [];
    header.map((head) => {
      arr.push({
        id: head.id,
        active: true,
        label: head.label,
      });
    });
    setActiveColumns([...arr]);
    setShowRowActionButtons(
      onRowEdit !== undefined || onRowDelete !== undefined
    );
    setEnableSelection(onMultipleDelete !== undefined);
  }, []);

  React.useEffect(() => {
    onColumnSort?.(order, orderBy);
  }, [order, orderBy]);

  React.useEffect(() => {
    onFilter !== undefined ? onFilter(filters) : null;
  }, [filters]);

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <DataTableToolBar
          header={header}
          numSelected={selected.length}
          dense={dense}
          onDenseChange={() => setDense(!dense)}
          activeColumns={activeColumns}
          onChangeActiveColumn={(id) => handleChangeActiveColumn(id)}
          searchString={(str) => searchString?.(str)}
          filters={[...filters]}
          onFilterChange={(value, field, column) =>
            handleFilterChange(value, field, column)
          }
          onAddFilter={() => handleAddFilter()}
          onDeleteFilter={(column) => handleDeleteFilter(column)}
          noFilter={onFilter === undefined}
          onMultipleDelete={() => handleMultipleDelete()}
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
              actionButtons={showRowActionButtons}
              activeColumns={activeColumns}
            />
            <TableBody>
              {isDataLoading ? (
                <DataLoading
                  columnCount={
                    showRowActionButtons ? header.length + 1 : header.length
                  }
                />
              ) : (
                ""
              )}
              {rows.length <= 0 && !isDataLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      showRowActionButtons ? header.length + 1 : header.length
                    }
                    align={"center"}
                  >
                    <Fade in={rows.length <= 0} timeout={600}>
                      <Box
                        display={"flex"}
                        flexDirection={"column"}
                        p={2}
                        alignItems={"center"}
                      >
                        <DataObject color="error" sx={{ fontSize: 80 }} />
                        <Typography fontSize={15}>
                          Your query returned empty.
                        </Typography>
                      </Box>
                    </Fade>
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}
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
                        .filter((item: any) => item.id === headCell.id)
                        .map((item: any) => item.active);
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
                    {showRowActionButtons ? (
                      <TableCell>
                        <Box display={"flex"}>
                          {onRowEdit !== undefined ? (
                            <Tooltip title="Edit">
                              <IconButton
                                color="info"
                                size={dense ? "small" : "medium"}
                                onClick={() => onRowEdit?.(row)}
                              >
                                <Edit fontSize={dense ? "small" : "inherit"} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          {onRowDelete !== undefined ? (
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                size={dense ? "small" : "medium"}
                                onClick={() => onRowDelete?.(row)}
                              >
                                <DeleteRounded
                                  fontSize={dense ? "small" : "inherit"}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
                          {onRowInfo !== undefined ? (
                            <Tooltip title="View All Related Info">
                              <IconButton
                                color="success"
                                size={dense ? "small" : "medium"}
                                onClick={() => onRowInfo?.(row)}
                              >
                                <Feed fontSize={dense ? "small" : "inherit"} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ""
                          )}
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
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
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
