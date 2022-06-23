import OfficeForm from "@modules/office/OfficeForm";
import { Box, Button, Typography } from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { AxiosPromise } from "axios";
import dynamic from "next/dynamic";
import {
  Actions,
  FilterSettings,
  OrderSetting,
  PageLayoutProps,
  SnackBarData,
} from "@helpers/interface";
import SkeletonLoading from "@components/Loader/SkeletonLoading";

const DataTable = dynamic(() => import("material-ui-datatable-api"), {
  suspense: false,
});
// const DataTable = dynamic(() => import("@components/DataTable"), {
//   suspense: false,
// });
const DeleteDialog = dynamic(() => import("@components/Dialogs/DeleteDialog"), {
  suspense: false,
});
const SnackbarAlert = dynamic(
  () => import("@components/SnackBar/SnackBarAlert"),
  {
    suspense: false,
  }
);

export default function PageLayout(props: PageLayoutProps) {
  const { pageTitle, dataQuery, dataMutation, tableHeader } = props;
  const [data, setdata] = useState<any>([]);
  const [page, setPage] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [rowsCount, setRowsCount] = useState<number>(0);
  const [rowData, setRowData] = useState<any>(null);
  const [isDeleteDailogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>('');
  const [orderSettings, setOrderSettings] = useState<OrderSetting>({
    order: "asc",
    column: "",
  });
  const [filters, setFilters] = useState<FilterSettings>({
    column: '',
    operator: '',
    value: '',
  })
  const [snackbarData, setSnackBarData] = useState<SnackBarData>({
    isOpen: false,
    message: "",
    type: "error",
  });
  const [action, setAction] = useState<Actions>(null);

  const querydata = useQuery(
    "result",
    async () =>
      (await api(
        Method.GET,
        `${dataQuery}`,
        `?page=${page}&limit=${limit}` +
        `&search=${searchString}` +
        `&order=${orderSettings.order}&orderBy=${orderSettings.column}` +
        `&filterBy=${filters.column}&filterUsing=${filters.operator}&filterValue=${filters.value}`
      )) as any,
    { refetchOnWindowFocus: false }
  );

  const deleteOffice = useMutation(() => {
    return api(
      Method.DELETE,
      `${dataMutation}/${rowData?.id}`
    ) as AxiosPromise<any>;
  });

  const handleFormOpen = () => {
    setIsFormOpen(true);
    setAction("add");
  };

  const handleFormClose = (isSubmitted) => {
    if (isSubmitted) {
      querydata.refetch();
    } else {
      setAction(null);
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
            querydata.refetch();
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
    if (querydata.data) {
      setdata([...querydata?.data.data]);
      setRowsCount(querydata?.data.rows);

      if (action === "edit") {
        setSnackBarData({
          isOpen: true,
          message: "Record is successfully updated.",
          type: "success",
        });
      } else if (action === "add") {
        setSnackBarData({
          isOpen: true,
          message: "New record is successfully added.",
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
  }, [querydata.data]);

  useEffect(() => {
    querydata.refetch();
  }, [page, limit, orderSettings, searchString]);

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
            {pageTitle}
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
            Add {pageTitle.slice(0, -1)}
          </Button>
        </Box>
      </Box>
      {
        !querydata.isFetched ? <SkeletonLoading /> :
          <DataTable
            header={tableHeader}
            rows={data}
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
            searchString={(str) => {
              setSearchString(str)
            }}
          />
      }

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
      {pageTitle === "Offices" ? (
        <OfficeForm
          isOpen={isFormOpen}
          onClose={(isSubmitted) => handleFormClose(isSubmitted)}
          rowData={rowData}
        />
      ) : (
        ""
      )}
    </Box>
  );
}
