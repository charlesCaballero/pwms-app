import { Box } from "@mui/material";
import PageLayout from "@components/layouts/PageLayout";
import { officeMutation } from "@helpers/api-mutations";
import { officesQuery } from "@helpers/api-queries";

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
