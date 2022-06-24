import {
  Search,
  Delete,
  Print,
  FilterList,
  ViewColumn,
  ViewComfyAlt,
  ViewCompactAlt,
  Add,
  FilterAlt,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  MenuItem,
  Popover,
  Switch,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  EnhancedTableToolbarProps,
  FilterProps,
  FilterType,
  HeadCell,
  HideShowColumnProps,
} from "@helpers/interface";
import React from "react";

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
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
        <nav aria-label="main mailbox folders">
          <List>
            {columns?.map((column) => {
              return (
                <ListItem key={column.id} disablePadding>
                  <ListItemButton
                    onClick={() => handleChangeActiveColumn(column.id)}
                  >
                    <Switch
                      checked={column.active}
                      inputProps={{ "aria-label": "controlled" }}
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
  const { anchorEl, filters, onFilterChange, onClose, id, header, onAddFilter, onDeleteFilter } = props;
  const operators = ['contains', 'matches with', 'starts with', 'ends with', 'is empty', 'not empty'];

  const open = Boolean(anchorEl);

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 500, bgcolor: "background.paper" }}>
        <nav aria-label="filter menu">
          <Typography variant="body1" fontWeight={'bold'} px={2} pt={2}>
            {filters.length <= 0 ? 'No Filters' : 'Filters'}
          </Typography>
          <List>
            {filters?.map((filter: FilterType) => {
              return (
                <ListItem
                  key={filter.column}
                  sx={{ display: 'flex' }}
                >
                  <TextField
                    id="filter-column"
                    select
                    label="Column"
                    value={filter.column}
                    onChange={(event) => onFilterChange(event.target.value, 'column', filter.column)}
                    variant="standard"
                    fullWidth
                  >
                    {header.map((column: HeadCell) => (
                      <MenuItem key={column.id} value={column.id} disabled={filter.column !== column.id && filters.some(el => el.column === column.id)}>
                        {column.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    id="filter-operator"
                    select
                    label="Operators"
                    value={filter.operator}
                    onChange={(event) => onFilterChange(event.target.value, 'operator', filter.column)}
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
                    onChange={(event) => onFilterChange(event.target.value, 'value', filter.column)}
                    variant="standard"
                    fullWidth
                  >

                  </TextField>
                  <Tooltip title="Remove">
                    <span>
                      <IconButton onClick={() => onDeleteFilter(filter.column)} color="error" >
                        <Delete />
                      </IconButton>
                    </span>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
          <Button size="small" onClick={() => onAddFilter()} disabled={filters.length === header.length} variant={filters.length <= 0 ? "contained" : "text"} sx={{ mx: 2, mb: 2 }}>
            Add <Add />
          </Button>
        </nav>
      </Box>
    </Popover>
  );
};

export default function DataTableToolBar(props: EnhancedTableToolbarProps) {
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
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [anchorElFilter, setAnchorElFilter] = useState<HTMLButtonElement | null>(null);
  const [subString, setSubString] = useState<string>('');

  const handleOpenFilterMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
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
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: "1 1 100%" }}>
          <Input
            sx={{ width: 300 }}
            placeholder="Search"
            inputProps={{ "aria-label": "description" }}
            onChange={(event: any) => setSubString(event.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton onClick={() => { searchString?.(subString) }} aria-label="search" edge="end">
                  <Search />
                </IconButton>
              </InputAdornment>
            }
          />
        </Box>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Delete />
          </IconButton>
        </Tooltip>
      ) : (
        <Box display={"flex"}>
          <Tooltip title="Print Table">
            <IconButton>
              <Print />
            </IconButton>
          </Tooltip>
          {noFilter ? '' : (<Tooltip title="Filter Data">
            <IconButton
              aria-describedby="filter-menu"
              onClick={handleOpenFilterMenu}
            >
              <Badge badgeContent={filters.length} color="secondary" sx={{ fontWeight: 'bold' }}>
                {filters.length <= 0 ? <FilterList /> : <FilterAlt />}
              </Badge>
            </IconButton>
          </Tooltip>)}
          <Tooltip title="Hide/Show Column">
            <IconButton
              aria-describedby="hide-show-menu"
              onClick={handleOpenHideShowMenu}
            >
              <ViewColumn />
            </IconButton>
          </Tooltip>
          <Tooltip title={dense ? "Wide Padding" : "Compact Padding"}>
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
        onChangeActiveColumn={(id) => onChangeActiveColumn(id)}
      />

      <Filter
        anchorEl={anchorElFilter}
        id={'filter-menu'}
        onClose={handlePopOverClose}
        filters={filters}
        header={header}
        onFilterChange={(value, field, column) => onFilterChange(value, field, column)}
        onAddFilter={() => onAddFilter()}
        onDeleteFilter={(column) => onDeleteFilter(column)}
      />
    </Toolbar>
  );
}
