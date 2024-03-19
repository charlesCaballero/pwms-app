import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Suspense } from "react";
import Router from "next/router";
import { HeadCell } from "@helpers/interface";
import { userDetailsQuery } from "@helpers/api-queries";
import { url } from "@utils/queryUtils";
import { useState } from "react";
import RegisterDialog from "@components/Dialogs/RegisterDialog";

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
  const [openRegister, setOpenRegister] = useState(false);
  const handleRefetch = (fetch) => {
    return fetch;
  };
  const handleClose = () => {
    setOpenRegister(false);
  };

  return (
    <Box pt={2}>
      <Box display={"flex"} pb={1}>
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
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"flex-start"}
          justifyContent={"flex-end"}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenRegister(true)}
          >
            Add User
          </Button>
          <RegisterDialog isOpen={openRegister} onClose={() => handleClose()} />
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
