import OfficeForm from "@modules/office/OfficeForm";
import { officesQuery } from "@helpers/api/queries";
import { Box, Button, Typography } from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import DataTable from "@components/templates/DataTable";
import DeleteDialog from "@components/elements/Dialogs/DeleteDialog";
import { officeMutation } from "@helpers/api/mutations";
import { AxiosPromise } from "axios";
import SnackbarAlert from "@components/elements/SnackBar/SnackBarAlert";
import { Actions, OrderSetting, SnackBarData } from "@helpers/interface";

const tableHeader = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Office Name",
  },
  {
    id: "acronym",
    numeric: false,
    disablePadding: false,
    label: "Acronym",
  },
  {
    id: "code",
    numeric: false,
    disablePadding: false,
    label: "Office Code",
  },
];

export default function Offices() {
  const [offices, setOffices] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [rowData, setRowData] = useState<any>(null);
  const [isDeleteDailogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [orderSettings, setOrderSettings] = useState<OrderSetting>({
    order: "asc",
    column: "",
  });
  const [snackbarData, setSnackBarData] = useState<SnackBarData>({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [action, setAction] = useState<Actions>(null);

  const queryOffices = useQuery(
    "offices",
    async () =>
      (await api(
        Method.GET,
        `${officesQuery}`,
        `?page=${page}&limit=${limit}&order=${orderSettings.order}&orderBy=${orderSettings.column}`
      )) as any,
    { refetchOnWindowFocus: false }
  );

  const deleteOffice = useMutation(() => {
    return api(
      Method.DELETE,
      `${officeMutation}/${rowData?.id}`
    ) as AxiosPromise<any>;
  });

  const handleFormOpen = () => {
    setIsFormOpen(true);
    setAction("add");
  };

  const handleFormClose = (isSubmitted) => {
    if (isSubmitted) {
      queryOffices.refetch();
    }
    setIsFormOpen(false);
    setRowData(null);
  };

  const handleRowEdit = (row) => {
    setAction("edit");
    setRowData(row);
    setIsFormOpen(true);
  };

  const handleRowDelete = (row) => {
    setRowData(row);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackBarData({
      isOpen: false,
      message: snackbarData.message,
      type: snackbarData.type,
    });
    setAction(null);
  };

  const handleColumnSort = (order, column) => {
    setOrderSettings({
      order: order,
      column: column,
    });
  };

  const handleDeleteDialogClose = (isDeleted) => {
    if (isDeleted) {
      deleteOffice.mutateAsync(null, {
        onSuccess: (result) => {
          if (result) {
            queryOffices.refetch();
            setAction("delete");
          }
        },
        onError: (error) => {
          setSnackBarData({
            isOpen: true,
            message: JSON.stringify(error),
            type: "error",
          });
        },
      });
    }

    setIsDeleteDialogOpen(false);
    setRowData(null);
  };

  useEffect(() => {
    if (queryOffices.data) {
      setOffices([...queryOffices?.data.data]);
      setRowsCount(queryOffices?.data.rows);

      if (action === "edit") {
        setSnackBarData({
          isOpen: true,
          message: "Record is successfully updated.",
          type: "success",
        });
      } else if (action === "add") {
        setSnackBarData({
          isOpen: true,
          message: "New office is successfully added.",
          type: "success",
        });
      } else if (action === "delete") {
        setSnackBarData({
          isOpen: true,
          message: "Record is deleted successfully.",
          type: "success",
        });
      } else {
        setSnackBarData({
          isOpen: false,
          message: "",
          type: "error",
        });
      }
    }
  }, [queryOffices.data]);

  useEffect(() => {
    queryOffices.refetch();
  }, [page, limit, orderSettings]);

  return (
    <Box pt={1}>
      <Box display={"flex"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent={"flex-end"}
          flexGrow={1}
        >
          <Typography component={"h1"} variant="h3">
            Offices
          </Typography>
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-end"}
          justifyContent={"flex-end"}
        >
          <Button
            variant="contained"
            sx={{ height: 40, my: 2 }}
            onClick={() => handleFormOpen()}
          >
            Add Office
          </Button>
        </Box>
      </Box>
      <DataTable
        header={tableHeader}
        rows={offices}
        actionButtons={true}
        enableSelection={false}
        page={page}
        setPage={(newPage) => setPage(newPage)}
        rowsPerPage={limit}
        setRowsPerPage={(newLimit) => setLimit(newLimit)}
        rowsCount={rowsCount}
        onRowEdit={(row) => handleRowEdit(row)}
        onRowDelete={(id) => handleRowDelete(id)}
        onColumnSort={(order, column) => handleColumnSort(order, column)}
      />
      <OfficeForm
        isOpen={isFormOpen}
        onClose={(isSubmitted) => handleFormClose(isSubmitted)}
        rowData={rowData}
      />
      <DeleteDialog
        isOpen={isDeleteDailogOpen}
        onClose={(isDeleted) => handleDeleteDialogClose(isDeleted)}
        rowData={rowData}
      />
      <SnackbarAlert
        isOpen={snackbarData.isOpen}
        type={snackbarData.type}
        message={snackbarData.message}
        onClose={() => handleCloseSnackbar()}
      />
    </Box>
  );
}
