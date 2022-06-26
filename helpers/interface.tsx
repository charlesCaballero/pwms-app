import { HeadCell } from "material-ui-datatable-api/dist/table-interface";
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
  userModules?: string;
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

// export interface HeadCell {
//   disablePadding: boolean;
//   id: string;
//   label: string;
//   numeric: boolean;
// }

export type FilterOperators =
  | "contains"
  | "matches with"
  | "starts with"
  | "ends with"
  | "is empty"
  | "not empty";

// export interface DataTableProps {
//   header: Array<HeadCell>;
//   rows: any[];
//   rowsPerPage: number;
//   page: number;
//   rowsCount: number;
//   enableSelection?: boolean;
//   actionButtons?: boolean;
//   setPage(page: number): any;
//   setRowsPerPage(limit: number): any;
//   onRowEdit?(row: Object): any;
//   onRowDelete?(row: Object): any;
//   onColumnSort?(order: Order, column: string): void;
//   searchString?(str: string): void;
//   isDataLoading?: boolean;
//   onFilter?(filters: FilterType[]): void;
// }

export interface PopoverProps {
  anchorEl: any;
  onClose(): void;
  id: string;
}

// export interface EnhancedTableToolbarProps {
//   numSelected: number;
//   dense: boolean;
//   onDenseChange: any;
//   activeColumns: Array<ActiveColumns>;
//   onChangeActiveColumn(id: string): void;
//   searchString?(str: string): void;
//   header: HeadCell[];
//   filters?: FilterType[];
//   onFilterChange(value: string, field: FilterFields, column: string): void;
//   onAddFilter(): void;
//   onDeleteFilter(column: string): void;
//   noFilter: boolean;
// }

export type FilterFields = "column" | "operator" | "value";

// export type Order = "asc" | "desc";

export type Order = "asc" | "desc";
