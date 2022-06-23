import {
  Search,
  Delete,
  Print,
  FilterList,
  ViewColumn,
  ViewComfyAlt,
  ViewCompactAlt,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Switch,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { alpha } from "@mui/material/styles";
import {
  EnhancedTableToolbarProps,
  HideShowColumnProps,
} from "@helpers/interface";

const HideShowColumn = (props: HideShowColumnProps) => {
  const { anchorEl, id, onClose, columns, onChangeActiveColumn } = props;

  const open = Boolean(anchorEl);
  const handleChangeActiveColumn = (id) => {
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

export default function DataTableToolBar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    dense,
    onDenseChange,
    activeColumns,
    onChangeActiveColumn,
    searchString,
  } = props;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [subString, setSubString] = useState<string>('');
  const handleOpenHideShowMenu = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHideShowMenuClose = () => {
    setAnchorEl(null);
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
                <IconButton onClick={() => { searchString(subString) }} aria-label="search" edge="end">
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
          <Tooltip title="Filter Data">
            <IconButton>
              <FilterList />
            </IconButton>
          </Tooltip>
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
        onClose={handleHideShowMenuClose}
        columns={activeColumns}
        onChangeActiveColumn={(id) => onChangeActiveColumn(id)}
      />
    </Toolbar>
  );
}
