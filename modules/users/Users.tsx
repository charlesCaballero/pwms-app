import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import { Suspense } from "react";
import Router from "next/router";
import { HeadCell } from "material-ui-datatable-api-v2/dist/interface";
import { userDetailsQuery } from "@helpers/api-queries";
import { url } from "@utils/queryUtils";

const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
  suspense: true,
});

const tableHeader: HeadCell[] = [
  {
    id: "company_id_number",
    numeric: false,
    disablePadding: false,
    label: "ID Number",
  },
  {
    id: "first_name",
    numeric: false,
    disablePadding: false,
    label: "First Name",
  },
  {
    id: "last_name",
    numeric: false,
    disablePadding: false,
    label: "Last Name",
  },
  {
    id: "email",
    numeric: false,
    disablePadding: false,
    label: "Email",
  },
  {
    id: "acronym",
    numeric: false,
    disablePadding: false,
    label: "Office",
    from: "office",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Role",
    from: "role",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
    boolean: ["Allowed", "Denied"],
  },
];

export default function Users() {
  const handleRefetch = (fetch) => {
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
            Users
          </Typography>
        </Box>
      </Box>
      <Suspense>
        <DataTable
          header={tableHeader}
          dataQuery={url + "/" + userDetailsQuery}
          token={Cookies.get("token")}
          getSelection={(_action, selections: any) => {
            Router.push("/app/users/" + selections.company_id_number);
          }}
          refetch={(fetch) => handleRefetch(fetch)}
          disablePrint={true}
          disableRowDelete={true}
          disableRowEdit={true}
        />
      </Suspense>
    </Box>
  );
}
