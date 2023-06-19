import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import dynamic from "next/dynamic";
import { useMutation } from 'react-query';
import { Method, api, url } from '@utils/queryUtils';
import { storageQuery } from '@helpers/api-queries';
import Cookies from "js-cookie";
import ConfirmRequestDialog from '@components/Dialogs/ConfirmRequestDialog';
import DataTable from '@components/DataTable';
import { AxiosPromise } from 'axios';
import { storageRequestMutation } from '@helpers/api-mutations';
import { HeadCell, SnackBarData } from '@helpers/interface';
import RequestDetails from '@components/Dialogs/PendingRequestDetails';

// const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
//     suspense: true,
// });

const SnackbarAlert = dynamic(
    () => import("@components/SnackBar/SnackBarAlert"),
    {
      suspense: true,
    }
  );

const tableHeader: HeadCell[] = [
    {
      id: "form_no",
      numeric: false,
      disablePadding: false,
      label: "Request Form No.",
    },
    {
      id: "user_name",
      numeric: false,
      disablePadding: false,
      label: "End User",
    },
    {
      id: "acronym",
      numeric: false,
      disablePadding: false,
      label: "Dept/Unit",
      from:'office'
    },
    {
      id: "created_at",
      numeric: false,
      disablePadding: false,
      label: "Date Created",
      datatype: "date",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
      
    },
];

export default function ConfirmStorageRequest(){

    const [selected, setSelected] = React.useState([]);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [openRequestDetails, setOpenRequestDetails] = React.useState(false);
    const [refetch, setRefetch] = React.useState(false);
    // const [remarks,setRemarks] = React.useState('');
    const [snackbarData, setSnackBarData] = React.useState<SnackBarData>({
        isOpen: false,
        message: "",
        type: "error",
      });

    const updateStorageRequest = useMutation((data: any) => {
        return api(Method.PUT, `${storageRequestMutation}/${selected['form_no']}`, data) as AxiosPromise<any>;
    });

    const handleDetailsOpen = (data) => {
        // console.log("data: "+ JSON.stringify(data));
        setSelected(data);
        setOpenRequestDetails(true);
    }

    const handleSaveRequest = async() => {
      // selected['remarks'] = remarks;
        await updateStorageRequest.mutate(selected, {
            onSuccess: (result:any) => {
              if (result) {
                // console.log("result: " + JSON.stringify(result.code));
                if (result.code === 200) {
                  setOpenConfirm(false);
                  setOpenRequestDetails(false);
                  handleRefetch();
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
        message: "Request is now posted as ongoing request.",
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
                        dataQuery = { url + "/" + storageQuery
                        }
                        token = { Cookies.get("token") }
                        getSelection = {(_, selections) => {
                            handleDetailsOpen(selections);
                        }}
                        disablePrint = { true}
                        disableRowDelete = {true}
                        disableRowEdit = {true}
                        disableToolbar={true}
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
                                src='/empty_states/empty-state.png'
                                width="400px"
                                alt="empty list"
                            />
                            <Typography variant="h5" component="h6" color="#00c69d" align="center" >
                            No Pending Request
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
                request={"confirm"}
                action={"continue"}
                isLoading={updateStorageRequest.isLoading}
            />
            <RequestDetails 
                isOpen={openRequestDetails}
                onClose={(isSubmitted)=>isSubmitted?setOpenConfirm(true): setOpenRequestDetails(false)}
                data={selected}
                // getRemarks={(val)=>setRemarks(val)}
                type='storage'
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
