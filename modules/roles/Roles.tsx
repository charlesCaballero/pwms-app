import PageLayout from "@components/layouts/PageLayout";
import { roleMutation } from "@helpers/api-mutations";
import { rolesQuery } from "@helpers/api-queries";
import Box from "@mui/material/Box";

const tableHeader = [
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Role Name",
  },
  {
    id: "abbreviation",
    numeric: false,
    disablePadding: false,
    label: "Abbreviation",
  },
];

export default function Roles() {
  return (
    <Box pt={1}>
      <PageLayout
        pageTitle="Roles"
        dataQuery={rolesQuery}
        dataMutation={roleMutation}
        tableHeader={tableHeader}
      />
    </Box>
  );
}
