import OfficeForm from "@modules/office/OfficeForm";
import { officesQuery } from "@helpers/api/queries";
import { Box, Button, Typography } from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import DataTable from "@components/templates/DataTable";
import DeleteDialog from "@components/elements/Dialogs/DeleteDialog";

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
  const [rowData, setFormData] = useState<Object>(null);
  const [isDeleteDailogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const queryOffices = useQuery(
    "offices",
    async () =>
      (await api(
        Method.GET,
        `${officesQuery}`,
        `?page=${page}&limit=${limit}`
      )) as any,
    { refetchOnWindowFocus: false }
  );

  const handleFormClose = (isSubmitted) => {
    if (isSubmitted) {
      queryOffices.refetch();
    }
    setIsFormOpen(false);
    setFormData(null);
  };

  const handleRowEdit = (row) => {
    setFormData(row);
    setIsFormOpen(true);
  };

  const handleRowDelete = (row) => {
    setFormData(row);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteDialogClose = (isDeleted) => {
    if (isDeleted) {
      queryOffices.refetch();
    }
    setIsDeleteDialogOpen(false);
    setFormData(null);
  };

  useEffect(() => {
    if (queryOffices.data) {
      setOffices([...queryOffices?.data.data]);
      setRowsCount(queryOffices?.data.rows);
    }
  }, [queryOffices.data]);

  useEffect(() => {
    queryOffices.refetch();
  }, [page, limit]);

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
            onClick={() => setIsFormOpen(true)}
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
    </Box>
  );
}
