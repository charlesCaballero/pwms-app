import * as React from 'react';
/**
 * Material Components Used
 */
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';
import Toolbar from '@mui/material/Toolbar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Popover from '@mui/material/Popover';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Switch from '@mui/material/Switch';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { alpha } from '@mui/material';
import Input from '@mui/material/Input';
import TableHead from '@mui/material/TableHead';
import TableSortLabel from '@mui/material/TableSortLabel';

/**
 * Material Icons Used
 */
import Delete from '@mui/icons-material/Delete';
import Archive from '@mui/icons-material/Archive';
import Add from '@mui/icons-material/Add';
import Search from '@mui/icons-material/Search';
import Print from '@mui/icons-material/Print';
import FilterList from '@mui/icons-material/FilterList';
import FilterAlt from '@mui/icons-material/FilterAlt';
import ViewColumn from '@mui/icons-material/ViewColumn';
import ViewComfyAlt from '@mui/icons-material/ViewComfyAlt';
import ViewCompactAlt from '@mui/icons-material/ViewCompactAlt';
import Edit from '@mui/icons-material/Edit';
import Feed from '@mui/icons-material/Feed';
import CheckCircle from '@mui/icons-material/CheckCircleOutlineRounded';
import DoDisturb from '@mui/icons-material/DoDisturbAltRounded';
import DataObject from '@mui/icons-material/DataObject';
import DeleteRounded from '@mui/icons-material/DeleteRounded';
/**
 * Others
 */
import { grey } from '@mui/material/colors';
import { visuallyHidden } from '@mui/utils';
// import { BooleanCell, HeadCell, Order } from './interface';
import { useQuery } from 'react-query';
import { Inventory2, Task } from '@mui/icons-material';
import { BooleanCell, HeadCell, Order } from '@helpers/interface';

type FilterOperators =
  | 'contains'
  | 'matches with'
  | 'starts with'
  | 'ends with'
  | 'is empty'
  | 'not empty';

interface FilterType {
  column: string;
  operator: FilterOperators;
  value: string;
}
interface PopoverProps {
  anchorEl: any;
  onClose(): void;
  id: string;
}

interface ActiveColumns {
  id: string;
  active: boolean;
  label: string;
  from?: string;
  boolean?: BooleanCell;
}

type FilterFields = 'column' | 'operator' | 'value';

interface FilterProps extends PopoverProps {
  header: HeadCell[];
  filters: FilterType[];
  onFilterChange(value: string, field: FilterFields, column: string): void;
  onAddFilter(): void;
  onDeleteFilter(column: string): void;
}

type TableActions = 'edit' | 'view' | 'delete' | 'multiple-delete' | null;
type MultipleSelectionType =
  | 'Return'
  | 'Dispose'
  | 'Delete'
  | 'Store'
  | 'Signed'
  | 'Received';

type EmptyState = string | JSX.Element | JSX.Element[];

interface DataTableProps {
  header: Array<HeadCell>;
  dataQuery: string;
  token?: string;
  disableRowEdit?: boolean;
  disableRowDelete?: boolean;
  disableRowInfo?: boolean;
  disableSelection?: boolean;
  disableFilter?: boolean;
  disablePrint?: boolean;
  setMultipleSelection?: MultipleSelectionType;
  getSelection?(action: TableActions, row: object[]): void;
  loadingState?(isLoading:boolean): void;
  refetch?: boolean;
  emptyState?: EmptyState;
  disableToolbar?:boolean;
}

export default function DataTable(props: DataTableProps) {
  const {
    header,
    dataQuery,
    getSelection=()=>{},
    loadingState=()=>{},
    token,
    disableRowEdit = false,
    disableRowDelete = false,
    disableRowInfo = false,
    disableSelection = true,
    disableFilter = false,
    disablePrint = false,
    setMultipleSelection = 'Delete',
    refetch,
    emptyState,
    disableToolbar=false,
  } = props;

  const [showRowActionButtons, setShowRowActionButtons] = React.useState<
    boolean
  >(false);
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<any>('');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [dense, setDense] = React.useState(false);
  const [activeColumns, setActiveColumns] = React.useState<any>([]);
  const [filters, setFilters] = React.useState<FilterType[]>([]);
  const [data, setdata] = React.useState<any>([]);
  const [page, setPage] = React.useState<number>(0);
  const [limit, setLimit] = React.useState<number>(5);
  const [rowsCount, setRowsCount] = React.useState<number>(0);
  const [searchString, setSearchString] = React.useState<string>('');
  const [queryError, setQueryError] = React.useState<string>('');

  const querydata = useQuery(
    'result',
    async () =>
      (await axios({
        method: 'GET',
        url:
          `${dataQuery}` +
          `?page=${page}&limit=${limit}` +
          `&search=${searchString}` +
          `&order=${order}&orderBy=${orderBy}` +
          `&filters=${JSON.stringify(filters)}`,
        data:
          `?page=${page}&limit=${limit}` +
          `&search=${searchString}` +
          `&order=${order}&orderBy=${orderBy}` +
          `&filters=${JSON.stringify(filters)}`,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*',
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: token ? `Bearer ${token}` : 'Bearer',
        },
      })
        .then((response: any) => response.data)
        .catch((err: any) => {
          setQueryError(err.response.message);
          // return null;
        })) as any,
    { refetchOnWindowFocus: false }
  );

  React.useEffect(() => {
    if (querydata.data) {
      setdata([...querydata?.data.data]);
      setRowsCount(querydata?.data.rows);
      // refetch?.(false);
    }
  }, [querydata.data]);

  React.useEffect(()=>{
    loadingState(querydata.isLoading);
  },[querydata.isLoading])

  React.useEffect(() => {
    if (!disableFilter && filters.length > 0) setSearchString('');
    querydata.refetch();
  }, [page, limit, order, orderBy, searchString, filters]);

  React.useEffect(() => {
    if (refetch) {
      setSelected([]);
      querydata.refetch();
    }
  }, [refetch]);

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: any
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n: any) => n.id);
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
    setLimit(parseInt(event.target.value, 10));
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
    header.forEach(head => unFilteredColumns.push(head.id));
    newFilter.forEach(obj => {
      unFilteredColumns.forEach((value, index) => {
        if (obj.column === value) unFilteredColumns.splice(index, 1);
      });
    });
    newFilter.push({
      column: unFilteredColumns[0],
      operator: 'contains',
      value: '',
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
        if (field === 'column') newFilter[index].column = value;
        else if (field === 'operator') newFilter[index].operator = value;
        else newFilter[index].value = value;
      }
    });
    setFilters([...newFilter]);
  };

  const handleMultipleDelete = () => {
    const selectedRows = [];
    selected.map((index)=>{
      data.map((value)=>{
        if (value.id===index){
          selectedRows.push(value);
        }
      })
    })
    getSelection("multiple-delete", selectedRows) ;
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty data.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * limit - rowsCount + 1) : 0;

  React.useMemo(() => {
    let arr: Array<ActiveColumns> = [];
    header.map((head: HeadCell) => {
      arr.push({
        id: head.id,
        active: true,
        label: head.label,
        from: head.from,
        boolean: head.boolean,
      });
    });
    setActiveColumns([...arr]);
    setShowRowActionButtons(
      disableRowEdit && disableRowDelete && disableRowInfo
    );
  }, []);

  React.useEffect(() => {
    disableFilter && setFilters(filters);
  }, [filters]);

  const setNewCellData = (from,id)=> {
    return (
      <List sx={{pt:0}}>
        {
          JSON.parse(from).map((val,index)=>{
            const numbering = JSON.parse(from).length>1?(index+1)+". ":'';
            return (
              <ListItem sx={{pt:0}} key={"newCellData"+index}>
                {numbering.concat(val[id])}
              </ListItem>
            )
          })
        }
      </List>
    );
  }

  function getFormattedDate(val) {
    const date = new Date(val);
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return month + '/' + day + '/' + year;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        {!disableToolbar&&
        <DataTableToolBar
          header={header}
          numSelected={selected.length}
          dense={dense}
          onDenseChange={() => setDense(!dense)}
          activeColumns={activeColumns}
          onChangeActiveColumn={id => handleChangeActiveColumn(id)}
          searchString={str => setSearchString(str)}
          filters={[...filters]}
          onFilterChange={(value, field, column) =>
            handleFilterChange(value, field, column)
          }
          onAddFilter={() => handleAddFilter()}
          onDeleteFilter={column => handleDeleteFilter(column)}
          noFilter={disableFilter}
          noPrint={disablePrint}
          onMultipleDelete={() => handleMultipleDelete()}
          multipleSelectionType={setMultipleSelection}
        />
        }
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <DataTableHeader
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={data.length}
              headCells={header}
              enableSelection={!disableSelection}
              actionButtons={showRowActionButtons}
              activeColumns={activeColumns}
            />
            <TableBody>
              {querydata.isLoading || querydata.isFetching &&(
                <React.Fragment>
                  <TableRow sx={{ width: '100%' }}>
                    <TableCell
                      colSpan={
                        !showRowActionButtons ? header.length + 1 : header.length
                      }
                      sx={{ p: 0, borderBottom: 'none' }}
                    >
                      <LinearProgress />
                    </TableCell>
                  </TableRow>
                  <TableRow sx={{ width: '100%' }}>
                    <TableCell
                      colSpan={
                        !showRowActionButtons ? header.length + 1 : header.length
                      }
                      sx={{ p: 3, borderBottom: 'none' }}
                      align={'center'}
                    >
                      Please wait. Loading..
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ) }
              {data.length <= 0 && (!querydata.isLoading || !querydata.isFetching) && (
                <TableRow>
                  <TableCell
                    colSpan={
                      !showRowActionButtons ? header.length + 1 : header.length
                    }
                    align={'center'}
                  >
                    <Fade in={data.length <= 0} timeout={600}>
                      <Box
                        display={'flex'}
                        flexDirection={'column'}
                        p={2}
                        alignItems={'center'}
                      >
                        {
                          emptyState?
                          (
                            <React.Fragment>
                              {emptyState}
                            </React.Fragment>
                          )
                          :
                          (
                            <React.Fragment>
                              <DataObject color="error" sx={{ fontSize: 80 }} />
                              <Typography fontSize={15}>
                                Your query returned empty. {queryError}
                              </Typography>
                              {queryError ? (
                                <Typography fontSize={15}>
                                  Error: {queryError}
                                </Typography>
                              ) : (
                                <Typography fontSize={15}>
                                  An error occured while fetching the data you need.
                                </Typography>
                              )}
                            </React.Fragment>
                          )
                        }
                        
                      </Box>
                    </Fade>
                  </TableCell>
                </TableRow>
              )}
              {[...data].map((row: any, index) => {
                const isItemSelected = isSelected(row.id);
                const labelId = `enhanced-table-checkbox-${index}`;
                return (
                  <TableRow
                    hover
                    onClick={event =>
                      !disableSelection ? handleClick(event, row.id) : null
                    }
                    role={!disableSelection ? 'checkbox' : 'list'}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                  >
                    {!disableSelection &&(
                      <TableCell padding="checkbox" sx={{verticalAlign: 'top', py:1}}>
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>
                    ) }
                    {header.map(headCell => {
                      const active = activeColumns
                        .filter((item: any) => item.id === headCell.id)
                        .map((item: any) => item.active);
                      return (
                        <TableCell
                          key={
                            headCell.from
                              ? headCell.from + '-' + headCell.id
                              : headCell.id
                          }
                          align={headCell.numeric ? 'right' : 'left'}
                          padding={headCell.disablePadding ? 'none' : 'normal'}
                          sx={{
                            display: active[0] ? '' : 'none',
                            verticalAlign: 'top',
                          }}
                        >
                          {
                            headCell.from ? (
                              headCell.datatype==='json'?
                              row[headCell.from]&&setNewCellData(row[headCell.from],[headCell.id]):
                              headCell.datatype==='date'?
                              row[headCell.from]&&getFormattedDate(row[headCell.from][headCell.id]):
                              row[headCell.from]&&row[headCell.from][headCell.id]
                            ) : headCell.boolean && row[headCell.id] ? (
                              <Chip
                                icon={<CheckCircle />}
                                label={headCell.boolean[0]}
                                color="success"
                                size={dense ? 'small' : 'medium'}
                              />
                            ) : headCell.boolean && !row[headCell.id] ? (
                              <Chip
                                icon={<DoDisturb />}
                                label={headCell.boolean[1]}
                                color="error"
                                size={dense ? 'small' : 'medium'}
                              />
                            ) : (
                              headCell.datatype==='date'?getFormattedDate(row[headCell.id]):row[headCell.id]
                            )
                          }
                          {
                            (headCell.remarks && row[headCell.remarks]) && 
                            (
                            <Box sx={{px:2}}>
                            <Typography sx={{fontWeight:'bold'}} variant="body2" component="h1">
                              Remarks:
                            </Typography>
                            <Typography sx={{whiteSpace:'pre-wrap'}} variant="body2" component="p">
                              {row[headCell.remarks]}
                            </Typography>
                            </Box>
                            )
                          }
                          {
                          headCell.concat&&(headCell.from?" "+row[headCell.from][headCell.concat]:" "+row[headCell.concat])
                          }
                        </TableCell>
                      );
                    })}
                    {!showRowActionButtons && (
                      <TableCell>
                        <Box display={'flex'}>
                          {!disableRowEdit ? (
                            <Tooltip title="Edit">
                              <IconButton
                                color="info"
                                size={dense ? 'small' : 'medium'}
                                onClick={() => getSelection?.('edit', row)}
                              >
                                <Edit fontSize={dense ? 'small' : 'inherit'} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                          {!disableRowDelete ? (
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                size={dense ? 'small' : 'medium'}
                                onClick={() => getSelection?.('delete', row)}
                              >
                                <DeleteRounded
                                  fontSize={dense ? 'small' : 'inherit'}
                                />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                          {!disableRowInfo ? (
                            <Tooltip title="View All Related Info">
                              <IconButton
                                color="success"
                                size={dense ? 'small' : 'medium'}
                                onClick={() => getSelection?.('view', row)}
                              >
                                <Feed fontSize={dense ? 'small' : 'inherit'} />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            ''
                          )}
                        </Box>
                      </TableCell>
                    ) }
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
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

/**
 * DataTable Toolbar
 */
interface EnhancedTableToolbarProps {
  numSelected: number;
  dense: boolean;
  onDenseChange: any;
  activeColumns: Array<ActiveColumns>;
  onChangeActiveColumn(id: string): void;
  searchString?(str: string): void;
  header: HeadCell[];
  filters?: FilterType[];
  onFilterChange(value: string, field: FilterFields, column: string): void;
  onAddFilter(): void;
  onDeleteFilter(column: string): void;
  noFilter: boolean;
  noPrint: boolean;
  multipleSelectionType: MultipleSelectionType;
  onMultipleDelete(): void;
}

interface HideShowColumnProps extends PopoverProps {
  columns: Array<ActiveColumns>;
  onChangeActiveColumn(id: string): void;
}

interface FilterType {
  column: string;
  operator: FilterOperators;
  value: string;
}

const HideShowColumn = (props: HideShowColumnProps) => {
  const { anchorEl, id, onClose, columns, onChangeActiveColumn } = props;

  const open = Boolean(anchorEl);
  const handleChangeActiveColumn = (id: string) => {
    onChangeActiveColumn(id);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
          <List>
            {columns?.map(column => {
              return (
                <ListItem key={column.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleChangeActiveColumn(column.id)}
                  >
                    <Switch
                      checked={column.active}
                      inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <ListItemText primary={column.label} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </nav>
      </Box>
    </Popover>
  );
};

const Filter = (props: FilterProps) => {
  const {
    anchorEl,
    filters,
    onFilterChange,
    onClose,
    id,
    header,
    onAddFilter,
    onDeleteFilter,
  } = props;
  const operators = [
    'contains',
    'matches with',
    'starts with',
    'ends with',
    'is empty',
    'not empty',
  ];

  const open = Boolean(anchorEl);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 500, bgcolor: 'background.paper' }}>
        <nav aria-label="filter menu">
          <Typography variant="body1" fontWeight={'bold'} px={2} pt={2}>
            {filters.length <= 0 ? 'No Filters' : 'Filters'}
          </Typography>
          <List>
            {filters?.map((filter: FilterType) => {
              return (
                <ListItem key={filter.column} sx={{ display: 'flex' }}>
                  <TextField
                    id="filter-column"
                    select
                    label="Column"
                    value={filter.column}
                    onChange={event =>
                      onFilterChange(
                        event.target.value,
                        'column',
                        filter.column
                      )
                    }
                    variant="standard"
                    fullWidth
                  >
                    {header.map((column: HeadCell) => (
                      <MenuItem
                        key={column.id}
                        value={column.id}
                        disabled={
                          filter.column !== column.id &&
                          filters.some(el => el.column === column.id)
                        }
                      >
                        {column.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="filter-operator"
                    select
                    label="Operators"
                    value={filter.operator}
                    onChange={event =>
                      onFilterChange(
                        event.target.value,
                        'operator',
                        filter.column
                      )
                    }
                    variant="standard"
                    sx={{ mx: 1, width: 400 }}
                  >
                    {operators.map((operator, index) => (
                      <MenuItem key={index} value={operator}>
                        {operator}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="filter-value"
                    label="Value"
                    value={filter.value}
                    onChange={event =>
                      onFilterChange(event.target.value, 'value', filter.column)
                    }
                    variant="standard"
                    fullWidth
                  ></TextField>
                  <Tooltip title="Remove">
                    <span>
                      <IconButton
                        onClick={() => onDeleteFilter(filter.column)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </span>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
          <Button
            size="small"
            onClick={() => onAddFilter()}
            disabled={filters.length === header.length}
            variant={filters.length <= 0 ? 'contained' : 'text'}
            sx={{ mx: 2, mb: 2 }}
          >
            Add <Add />
          </Button>
        </nav>
      </Box>
    </Popover>
  );
};

const DataTableToolBar = (props: EnhancedTableToolbarProps) => {
  const {
    numSelected,
    dense,
    onDenseChange,
    activeColumns,
    onChangeActiveColumn,
    searchString,
    filters,
    header,
    onFilterChange,
    onAddFilter,
    onDeleteFilter,
    noFilter,
    noPrint,
    onMultipleDelete,
    multipleSelectionType,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [
    anchorElFilter,
    setAnchorElFilter,
  ] = React.useState<HTMLButtonElement | null>(null);
  const [subString, setSubString] = React.useState<string>('');

  const handleOpenFilterMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElFilter(event.currentTarget);
  };

  const handleOpenHideShowMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopOverClose = () => {
    setAnchorEl(null);
    setAnchorElFilter(null);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: theme =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%' }}>
          <Input
            sx={{ width: 300 }}
            placeholder="Search"
            inputProps={{ 'aria-label': 'description' }}
            onChange={(event: any) => setSubString(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    searchString?.(subString);
                  }}
                  aria-label="search"
                  edge="end"
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      )}
      {numSelected > 0 ? (
        <Button
          onClick={onMultipleDelete}
          variant="contained"
          color={
            multipleSelectionType === 'Return'
              ? 'warning'
              : multipleSelectionType === 'Dispose' ||
                multipleSelectionType === 'Delete'
              ? 'error'
              : 'success'
          }
          startIcon={
            multipleSelectionType === 'Return' ? (
              <Archive />
            ) : multipleSelectionType === 'Dispose' ||
              multipleSelectionType === 'Delete' ? (
              <Delete />
            ) : multipleSelectionType === 'Store' ? (
              <Inventory2 />
            ) : (
              <Task />
            )
          }
        >
          {multipleSelectionType}
        </Button>
      ) : (
        <Box display={'flex'}>
          {!noPrint && (
            <Tooltip title="Print Table">
              <IconButton>
                <Print />
              </IconButton>
            </Tooltip>
          )}
          {!noFilter && (
            <Tooltip title="Filter Data">
              <IconButton
                aria-describedby="filter-menu"
                onClick={handleOpenFilterMenu}
              >
                <Badge
                  badgeContent={filters?.length}
                  color="secondary"
                  sx={{ fontWeight: 'bold' }}
                >
                  {filters!.length <= 0 ? <FilterList /> : <FilterAlt />}
                </Badge>
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Hide/Show Column">
            <IconButton
              aria-describedby="hide-show-menu"
              onClick={handleOpenHideShowMenu}
            >
              <ViewColumn />
            </IconButton>
          </Tooltip>
          <Tooltip title={dense ? 'Wide Padding' : 'Compact Padding'}>
            <IconButton onClick={onDenseChange}>
              {dense ? <ViewComfyAlt /> : <ViewCompactAlt />}
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <HideShowColumn
        anchorEl={anchorEl}
        id="hide-show-menu"
        onClose={handlePopOverClose}
        columns={activeColumns}
        onChangeActiveColumn={id => onChangeActiveColumn(id)}
      />

      <Filter
        anchorEl={anchorElFilter}
        id={'filter-menu'}
        onClose={handlePopOverClose}
        filters={filters!}
        header={header}
        onFilterChange={(value, field, column) =>
          onFilterChange(value, field, column)
        }
        onAddFilter={() => onAddFilter()}
        onDeleteFilter={column => onDeleteFilter(column)}
      />
    </Toolbar>
  );
};

/**
 * DataTable Header
 */
interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
  headCells: any[];
  enableSelection: boolean;
  actionButtons: boolean;
  activeColumns: Array<ActiveColumns>;
}

const DataTableHeader = (props: EnhancedTableProps) => {
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
  const createSortHandler = (property: any) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead sx={{ bgcolor: grey[300] }}>
      <TableRow>
        {enableSelection ? (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        ) : (
          ''
        )}
        {headCells.map(headCell => {
          const active = activeColumns
            .filter(item => item.id === headCell.id)
            .map(item => item.active);

          return (
            <TableCell
              key={
                headCell.from ? headCell.from + '-' + headCell.id : headCell.id
              }
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{
                fontWeight: 'bold',
                fontSize: 15,
                display: active[0] ? '' : 'none',
              }}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
        {!actionButtons && <TableCell align="left"></TableCell>}
      </TableRow>
    </TableHead>
  );
};
