// import { HeadCell, Order } from "material-ui-datatable-api-v2/dist/interface";
import { AppProps } from "next/app";

export interface TableHeader {
  label: string;
  type: ColumnType;
  name: string;
  subname?: string;
  remarks?:string;
  datatype?:DataTypes;
  from?: string;
}

type CopyType = "Original copy" | "Photocopy" | string;

export interface SelectedFormat {
    inventory_id: any;
    box_code: string;
    remarks: string;
    type: CopyType;
    location: string;
}

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

export type ColumnType = string | number | boolean;

export type Actions =
  | "edit"
  | "add"
  | "delete"
  | "view"
  | "multiple-delete"
  | null;

export interface SideNavProps {
  drawerWidth: number;
  userModules?: string;
}

export interface PageLayoutProps {
  pageTitle: string;
  dataQuery: any;
  dataMutation: any;
  tableHeader: HeadCell[];
  disableAdd?: boolean;
}

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

export interface PopoverProps {
  anchorEl: any;
  onClose(): void;
  id: string;
}

//from datatable package
export type BooleanCell = [true: string, false: string];
export type DataTypes = "json" | "date";
export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
  from?: string;
  boolean?: BooleanCell;
  datatype?: DataTypes;//for json and date type of data
  concat?: string; //used to concat one column to original id
  remarks?: string // for adding remarks value to a specific cell
}

export declare type Order = "asc" | "desc";
