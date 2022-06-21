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
import PageLayout from "@components/layouts/page/PageLayout";

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
  return (
    <Box pt={1}>
      <PageLayout
        pageTitle="Offices"
        dataQuery={officesQuery}
        dataMutation={officeMutation}
        tableHeader={tableHeader}
      />
    </Box>
  );
}
