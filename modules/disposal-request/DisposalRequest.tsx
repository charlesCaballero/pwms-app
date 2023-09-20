import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import dynamic from "next/dynamic";
import { useMutation, useQuery } from 'react-query';
import { Method, api, url } from '@utils/queryUtils';
import { disposalQuery } from '@helpers/api-queries';
import Cookies from "js-cookie";
import ConfirmRequestDialog from '@components/Dialogs/ConfirmRequestDialog';
import DataTable from '@components/DataTable';
import { AxiosPromise } from 'axios';
import { disposalRequestMutation } from '@helpers/api-mutations';
import RequestFormDialog from '@components/Dialogs/RequestFormDialog';
import { HeadCell, SnackBarData } from '@helpers/interface';

// const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
//     suspense: true,
// });

const SnackbarAlert = dynamic(
    () => import("@components/SnackBar/SnackBarAlert"),
    {
      suspense: true,
    }
  );

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

export default function DisposalRequest(){

    const [selected, setSelected] = React.useState([]);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openRequestForm, setOpenRequestForm] = React.useState(false);
    const [refetch, setRefetch] = React.useState(false);
    const [requestDetails, setRequestDetails] = React.useState([]);
    const [snackbarData, setSnackBarData] = React.useState<SnackBarData>({
        isOpen: false,
        message: "",
        type: "error",
      });

    const disposal = useMutation((data: any) => {
        return api(Method.POST, `${disposalRequestMutation}`, data) as AxiosPromise<any>;
    });

    const handleFormOpen = (data) => {
        // console.log("data: "+ JSON.stringify(data));
        setSelected(data);
        setOpenConfirm(true);
    }

    const handleSaveRequest = async() => {
        await disposal.mutate(selected, {
            onSuccess: (result) => {
              if (result) {
                // console.log("result: " + JSON.stringify(result.data));
                if (result.data.code === 200) {
                  setOpenConfirm(false);
                  setOpenRequestForm(true);
                  setRequestDetails(result.data);
                }
              }
            },
            onError: (error) => {
              console.log("Error: " + error);
            },
          });
    }

    const handleRefetch = () => {
        setRefetch(true);
        setSnackBarData({
        isOpen: true,
        message: "Request is successfully created. The list just got updated.",
        type: "success",
        });
        
      };

    return (
        <Grid
        container
        spacing = { 0}
        direction = "column"
        alignItems = "center"
        justifyContent = "center"
        >
        {/* <ActionAlert show={showAlert} close={handleCloseAlert} action={action} /> */ }

            <Grid item>
                <Box sx={ { display: 'flex', m: '20px' } } justifyContent = "center">
                    <DataTable
                        header={ tableHeader }
                        dataQuery = { url + "/" + disposalQuery
                        }
                        token = { Cookies.get("token") }
                        getSelection = {(_, selections) => {
                            handleFormOpen(selections);
                        }}
                        disablePrint = { true}
                        disableSelection = { false}
                        disableRowDelete = {true}
                        disableRowEdit = {true}
                        disableRowInfo={true}
                        setMultipleSelection = { "Dispose"}
                        refetch={refetch}
                        emptyState={
                          <Grid 
                              className="empty-state" 
                              item 
                              sx={{ display: 'flex' , background: 'white', width: 1 }}  
                              alignItems="center"
                              justifyContent="center"
                          >
                            <Box >
                            <img
                                src='/empty_states/empty-box.png'
                                width="400px"
                                alt="empty list"
                            />
                            <Typography variant="h5" component="h6" color="#00c69d" align="center" >
                            Nothing to dispose.
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
                          </Grid> 
                        }
                    />
                </Box>
            </Grid> 
            <ConfirmRequestDialog
                isOpen={openConfirm}
                onClose={(save) => (save ? handleSaveRequest() : setOpenConfirm(false))}
                request={"return"}
                action={"save"}
                isLoading={disposal.isLoading}
            />
            <RequestFormDialog
            isOpen={openRequestForm}
            onClose={() => {
            setOpenRequestForm(false);
            setSelected([]);
            handleRefetch();
            }}
            type={"disposal"}
            data={requestDetails}
            />
            <SnackbarAlert
                isOpen={snackbarData.isOpen}
                type={snackbarData.type}
                message={snackbarData.message}
                onClose={() => {
                    setSnackBarData({
                        isOpen: false,
                        message: snackbarData.message,
                        type: snackbarData.type,
                    });
                    setRefetch(false);
                }}
            />
        </Grid>   

    
    )};
