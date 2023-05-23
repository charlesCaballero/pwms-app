import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import dynamic from "next/dynamic";
import { useQuery } from 'react-query';
import { Method, api, url } from '@utils/queryUtils';
import { returnsQuery } from '@helpers/api-queries';
import Cookies from "js-cookie";

const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
    suspense: true,
});

const tableHeader = [
    {
        id: "box_code",
        numeric: false,
        disablePadding: false,
        label: "Box Code",
        from: "inventory",
    },
    {
        id: "remarks",
        numeric: false,
        disablePadding: false,
        label: "Document Description",
    },
    {
        id: "copy_type",
        numeric: false,
        disablePadding: false,
        label: "Copy type",
    },
    {
        id: "location",
        numeric: false,
        disablePadding: false,
        label: "Location",
        from: "inventory",
    },
];

export default function ReturnRequest() {
  
    const handleFormOpen = (action, data) => {

    }

    return (
        <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        >
        {/* <ActionAlert show={showAlert} close={handleCloseAlert} action={action} /> */}
        
        <Grid item >
            <Box sx={{display:'flex', m:'20px'}} justifyContent="center">
            <DataTable
            header={tableHeader}
            dataQuery={url + "/" + returnsQuery}
            token={Cookies.get("token")}
            getSelection={(action, selections) => {
                handleFormOpen(action, selections);
            }}
            disablePrint={true}
            disableSelection={false}
            disableRowDelete={true}
            disableRowEdit={true}
            
            />
            </Box>
        </Grid> 
        {/* <Grid 
            className="empty-state" 
            item 
            sx={{ display: count>0?'none':'flex' , background: 'white', width: 1 }}  
            alignItems="center"
            justifyContent="center"
        >
            <Box >
            <img
            src='/img/empty_states/check-document.png'
            width="400px"
            alt="empty list"
            />
            <Typography variant="h5" component="h6" color="#00c69d" align="center" >
            Nothing to return.
            </Typography>
            <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 1,
            m: 1,
            bgcolor: 'transparent',
            }}
            >
            </Box>
            
            </Box>
        </Grid>  */}
        
        </Grid>   
    
    
    );
}
