import { officeMutation } from "@helpers/api-mutations";
import { officesQuery } from "@helpers/api-queries";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import { api, Method, url } from "@utils/queryUtils";
import { useMutation } from "react-query";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Suspense, useState } from "react";
import { AxiosPromise } from "axios";
import { Actions, SnackBarData } from "@helpers/interface";

// const DataTable = dynamic(() => import("@components/DataTable"), {
//   suspense: true,
// });
const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
  suspense: true,
});

const DeleteDialog = dynamic(() => import("@components/Dialogs/DeleteDialog"), {
  suspense: true,
});
const SnackbarAlert = dynamic(
  () => import("@components/SnackBar/SnackBarAlert"),
  {
    suspense: true,
  }
);
const OfficeForm = dynamic(() => import("@modules/office/OfficeForm"), {
  suspense: true,
});

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
  const [isDeleteDailogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selection, setSelection] = useState<any>();
  const [action, setAction] = useState<Actions>(null);
  const [snackbarData, setSnackBarData] = useState<SnackBarData>({
    isOpen: false,
    message: "",
    type: "error",
  });

  const deleteRow = useMutation(() => {
    return api(
      Method.DELETE,
      `${officeMutation}/${selection?.id}`
    ) as AxiosPromise<any>;
  });

  const handleFormOpen = (action: Actions, selections: any) => {
    setAction(action);
    setSelection(selections);
    if (action === "delete") setIsDeleteDialogOpen(true);
    else setIsFormOpen(true);
  };

  const handleFormClose = (isSubmitted) => {
    if (isSubmitted) {
      handleRefetch(true);
    } else {
      setAction(null);
    }
    setIsFormOpen(false);
  };

  const handleDeleteDialogClose = (isDeleted) => {
    if (isDeleted) {
      deleteRow.mutateAsync(null, {
        onSuccess: (result) => {
          if (result) {
            handleRefetch(true);
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
  };

  const handleCloseSnackbar = () => {
    setSnackBarData({
      isOpen: false,
      message: snackbarData.message,
      type: snackbarData.type,
    });
    setAction(null);
  };

  const handleRefetch = (fetch) => {
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
    return fetch;
  };

  return (
    <Box pt={2}>
      <Box display={"flex"}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent={"flex-end"}
          flexGrow={1}
        >
          <Typography component={"h1"} variant="h3">
            Office
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
            sx={{ height: 40, my: 1 }}
            onClick={() => handleFormOpen("add", null)}
          >
            Add Office
          </Button>
        </Box>
      </Box>
      <Suspense>
        <DataTable
          header={tableHeader}
          dataQuery={url + "/" + officesQuery}
          token={Cookies.get("token")}
          getSelection={(action, selections) => {
            handleFormOpen(action, selections);
          }}
          refetch={(fetch) => handleRefetch(fetch)}
          disablePrint={true}
        />
      </Suspense>
      <DeleteDialog
        isOpen={isDeleteDailogOpen}
        onClose={(isDeleted) => handleDeleteDialogClose(isDeleted)}
        rowData={selection}
      />
      <SnackbarAlert
        isOpen={snackbarData.isOpen}
        type={snackbarData.type}
        message={snackbarData.message}
        onClose={() => handleCloseSnackbar()}
      />
      <OfficeForm
        isOpen={isFormOpen}
        onClose={(isSubmitted) => handleFormClose(isSubmitted)}
        rowData={selection}
      />
    </Box>
  );
}
