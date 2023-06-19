import { inventoryQuery } from "@helpers/api-queries";
import Box from "@mui/material/Box";
import Cookies from "js-cookie";
import { api, Method, url } from "@utils/queryUtils";
import dynamic from "next/dynamic";
import Typography from "@mui/material/Typography";
import React, { Suspense, useState } from "react";
import { HeadCell } from "@helpers/interface";

const DataTable = dynamic(() => import("@components/DataTable"), {
  suspense: true,
});
// const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
//   suspense: true,
// });


const tableHeader:HeadCell[] = [
    {
      id: "box_code",
      numeric: false,
      disablePadding: false,
      label: "Box Code",
    },
    {
      id: "rds_number",
      numeric: false,
      disablePadding: false,
      label: "RDS #",
      from: "box_details",
      datatype: 'json'
    },
    {
      id: "document_title",
      numeric: false,
      disablePadding: false,
      label: "Document Title and Description",
      from: "box_details",
      datatype: 'json',
      remarks: 'remarks'
    },
    {
      id: "document_date",
      numeric: false,
      disablePadding: false,
      label: "Document Date",
      from: "box_details",
      datatype: 'json'
    },
    {
      id: "disposal_date",
      numeric: false,
      disablePadding: false,
      label: "Disposal Date",
      
    },
    {
      id: "location",
      numeric: false,
      disablePadding: false,
      label: "Location",

    },
];

export default function Inventory() {
  const [dataTableLoading, setDataTableLoading] = useState<boolean>(false);
  const handleFormOpen = (action,selected) => {
        
    }

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
                Inventory
            </Typography>
            </Box>
            
        </Box>
        <Suspense>
            <DataTable
            header={tableHeader}
            dataQuery={url + "/" + inventoryQuery + "/show"}
            token={Cookies.get("token")}
            getSelection={(action, selections) => {
                handleFormOpen(action, selections);
            }}
            loadingState={(isLoading)=> setDataTableLoading(isLoading)}
            disablePrint
            disableRowEdit
            disableRowDelete
            disableFilter
            />
        </Suspense>
        
        </Box>
    );
}
