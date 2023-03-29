// import { roleMutation } from "@helpers/api-mutations";
import { rolesQuery, userDetailsQuery } from "@helpers/api-queries";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { HeadCell } from "material-ui-datatable-api-v2/dist/interface";
import DataTable from "material-ui-datatable-api-v2";
// import { Router } from "next/router";
import { Suspense } from "react";
import Cookies from "js-cookie";
import { url } from "@utils/queryUtils";

const tableHeader: HeadCell[] = [
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
            Roles
          </Typography>
        </Box>
      </Box>
      <Suspense>
        <DataTable
          header={tableHeader}
          dataQuery={url + "/" + rolesQuery}
          token={Cookies.get("token")}
          // getSelection={(_action, selections: any) => {
          //   Router.push("/app/users/" + selections.company_id_number);
          // }}
          // refetch={(fetch) => handleRefetch(fetch)}
          disablePrint={true}
          disableRowInfo={true}
        />
      </Suspense>
    </Box>
  );
}
