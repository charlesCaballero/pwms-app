import { AppProps } from "next/app";

export interface WithCacheAppProps extends AppProps {
  emotionCache: any;
}

export interface LoadingProp {
  isOpen: boolean;
}

export interface LoginFormProps {
  company_id_number: number;
  password: string;
}

export interface RegisterFormProps {
  company_id_number: number;
  first_name: string;
  last_name: string;
  email: string;
  office_id: string;
  password: string;
}

export type Actions = "edit" | "add" | "delete" | null;

export interface SideNavProps {
  drawerWidth: number;
  userModules: string;
}

export interface PageLayoutProps {
  pageTitle: string;
  dataQuery: any;
  dataMutation: any;
  tableHeader: HeadCell[];
}

// export interface HeadCell {
//   disablePadding: boolean;
//   id: string;
//   label: string;
//   numeric: boolean;
// }

export interface OrderType {
  order: Order;
  column: string;
}

// export interface FilterType {
//   column: string;
//   operator: string;
//   value: string;
// }

// export interface DataTableProps {
//   header: Array<HeadCell>;
//   rows: any[];
//   rowsPerPage: number;
//   page: number;
//   actionButtons?: boolean;
//   enableSelection?: boolean;
//   rowsCount: number;
//   setPage(page: number): any;
//   setRowsPerPage(limit: number): any;
//   onRowEdit?(row: Object): any;
//   onRowDelete?(row: Object): any;
//   onColumnSort?(order: Order, column: string): void;
//   searchString?(str: string): void;
// }

// export interface ActiveColumns {
//   id: string;
//   active: boolean;
//   label: string;
// }

// export interface EnhancedTableToolbarProps {
//   numSelected: number;
//   dense: boolean;
//   onDenseChange: any;
//   activeColumns: Array<ActiveColumns>;
//   onChangeActiveColumn(id: string): void;
//   searchString?(str: string): void;
// }
// export interface HideShowColumnProps {
//   anchorEl: any;
//   onClose(): void;
//   id: string;
//   columns: Array<ActiveColumns>;
//   onChangeActiveColumn(id: string): void;
// }

// export type Order = "asc" | "desc";

// export interface EnhancedTableProps {
//   numSelected: number;
//   onRequestSort: (event: React.MouseEvent<unknown>, property: any) => void;
//   onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
//   order: Order;
//   orderBy: string;
//   rowCount: number;
//   headCells: any[];
//   enableSelection: boolean;
//   actionButtons: boolean;
//   activeColumns: Array<ActiveColumns>;
// }

type DialogType = "info" | "warning" | "error";
export interface DialogProps {
  isOpen: boolean;
  onClose(isSubmitted?: boolean): void;
}

export interface AlertDialogProps extends DialogProps {
  message: string;
  type: DialogType;
  title: string;
}

export interface FormProps extends DialogProps {
  rowData?: any;
}

export interface DeleteDialogProps extends DialogProps {
  rowData: Object;
  isStrict?: boolean;
}

type SnackBarType = "success" | "error" | "info" | "warning";
export interface SnackBarData {
  type: SnackBarType;
  message: string;
  isOpen: boolean;
}

type Vertical = "top" | "bottom";
type Horizontal = "left" | "right";
export interface SnackBarProps extends DialogProps {
  type: SnackBarType;
  message: string;
  vertical?: Vertical;
  horizontal?: Horizontal;
}

//from datatable package

export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export type FilterOperators =
  | "contains"
  | "matches with"
  | "starts with"
  | "ends with"
  | "is empty"
  | "not empty";

export interface FilterType {
  column: string;
  operator: FilterOperators;
  value: string;
}

export interface PopoverProps {
  anchorEl: any;
  onClose(): void;
  id: string;
}

export interface ActiveColumns {
  id: string;
  active: boolean;
  label: string;
}

export type FilterFields = "column" | "operator" | "value";

export interface FilterProps extends PopoverProps {
  header: HeadCell[];
  filters: FilterType[];
  onFilterChange(value: string, field: FilterFields, column: string): void;
  onAddFilter(): void;
  onDeleteFilter(column: string): void;
}

export type Order = "asc" | "desc";
