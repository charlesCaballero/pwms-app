export interface HeadCell {
  disablePadding: boolean;
  id: string;
  label: string;
  numeric: boolean;
}

export interface DataTableProps {
  header: Array<HeadCell>;
  rows: any[];
  rowsPerPage: number;
  page: number;
  actionButtons?: boolean;
  enableSelection?: boolean;
  rowsCount: number;
  setPage(page: number): any;
  setRowsPerPage(limit: number): any;
  onRowEdit?(row: Object): any;
  onRowDelete?(row: Object): any;
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
