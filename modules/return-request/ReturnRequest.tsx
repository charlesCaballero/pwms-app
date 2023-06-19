import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import dynamic from "next/dynamic";
import { useMutation, useQuery } from 'react-query';
import { Method, api, url } from '@utils/queryUtils';
import { returnsQuery } from '@helpers/api-queries';
import Cookies from "js-cookie";
import ConfirmRequestDialog from '@components/Dialogs/ConfirmRequestDialog';
import DataTable from '@components/DataTable';
import { AxiosPromise } from 'axios';
import { returnRequestMutation } from '@helpers/api-mutations';
import RequestFormDialog from '@components/Dialogs/RequestFormDialog';
import { SnackBarData } from '@helpers/interface';

// const DataTable = dynamic(() => import("material-ui-datatable-api-v2"), {
//     suspense: true,
// });

const SnackbarAlert = dynamic(
    () => import("@components/SnackBar/SnackBarAlert"),
    {
      suspense: true,
    }
  );

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

export default function ReturnRequest(){

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

    const returns = useMutation((data: any) => {
        return api(Method.POST, `${returnRequestMutation}`, data) as AxiosPromise<any>;
    });

    const handleFormOpen = (data) => {
        // console.log("data: "+ JSON.stringify(data));
        setSelected(data);
        setOpenConfirm(true);
    }

    const handleSaveRequest = async() => {
        const data = [];
        selected.map((val)=>{
            if(val !==undefined){
            // console.log("val: "+ JSON.stringify(val.id));
            data.push({
                withdrawal_id: val.id,
                inventory_id: val.inventory_id,
                box_code: val.inventory.box_code,
                remarks: val.remarks,
                copy_type: val.copy_type,
                location: val.inventory.location
            })
            }
        })
        await returns.mutate(data, {
            onSuccess: (result) => {
              if (result) {
                console.log("result: " + JSON.stringify(result.data));
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
                        dataQuery = { url + "/" + returnsQuery
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
                        setMultipleSelection = { "Return"}
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
                                src='/empty_states/check-document.png'
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
                isLoading={returns.isLoading}
            />
            <RequestFormDialog
            isOpen={openRequestForm}
            onClose={() => {
            setOpenRequestForm(false);
            setSelected([]);
            handleRefetch();
            }}
            type={"return"}
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
