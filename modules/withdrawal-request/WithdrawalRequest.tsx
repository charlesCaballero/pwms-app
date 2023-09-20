import SearchRecordDialog from "@components/Dialogs/SearchRecordDialog";
import { SelectedFormat, TableHeader } from "@helpers/interface";
import Search from "@mui/icons-material/Search";
import { Grid, Box, Typography, Fab, Button } from "@mui/material";
import { useState } from "react";
import Cookie from "js-cookie";
import RequestTableList from "@components/DataTable/RequestTableList";
import Add from "@mui/icons-material/Add";
import { Save } from "@mui/icons-material";
import EditWithdrawalDialog from "@components/Dialogs/EditWithdrawalDialog";
import ConfirmRequestDialog from "@components/Dialogs/ConfirmRequestDialog";
import RequestFormDialog from "@components/Dialogs/RequestFormDialog";
import { useMutation } from "react-query";
import { withdrawalRequestMutation } from "@helpers/api-mutations";
import { Method, api } from "@utils/queryUtils";
import { AxiosPromise } from "axios";

const officeID = Cookie.get("office_id");

const thead: TableHeader[] = [
  {
    label: "Box Code",
    type: "string",
    name: "box_code",
  },
  {
    label: "Document Description",
    type: "string",
    name: "remarks",
  },
  {
    label: "Copy type",
    type: "string",
    name: "type",
  },
  {
    label: "Location",
    type: "string",
    name: "location",
  },
];


export default function WithdrawalRequest () {
    const [find, setFind] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openRequestForm, setOpenRequestForm] = useState(false);
    const [editID, setEditID] = useState(null);
    const [selected, setSelected] = useState<SelectedFormat[]>([]);
    const [requestDetails, setRequestDetails] = useState([]);

    const withdrawal = useMutation((data: any) => {
        return api(Method.POST, `${withdrawalRequestMutation}`, data) as AxiosPromise<any>;
    });

    const handleCloseSearch = () => {
        setFind(false);
    }

    const handleAddItem = (selections) => {
        let updateSelection:SelectedFormat[] = [...selected];
        selections.map((selection)=> {
            const newSelection: SelectedFormat = {
                inventory_id: selection.id,
                box_code: selection.box_code,
                remarks: "Entire box",
                type: "Original copy",
                location: selection.location  
            }
            updateSelection.push(newSelection);
        })
        setSelected(updateSelection);
        setFind(false);
    }

    const handleDeleteItem = (id) => {
        setSelected(selected.filter(row => row.inventory_id !== id));
    }

    const handleEditItem = (id) => {
        // console.log('edit id: '+id);
        setEditID(id);
    }

    const handleSaveEdit = (newValue) => {

        selected.map((value, i) => {
            if (value.inventory_id === newValue.inventory_id) {
                selected[i] = newValue;
            } 
        });
        setEditID(null);
    }

    const handleSaveRequest = async () => {
        await withdrawal.mutate(selected, {
            onSuccess: (result) => {
              if (result) {
                // console.log("result: " + JSON.stringify(result.data));
                if (result.data.code === 200) {
                    
                  setOpenConfirm(false);
                  setOpenRequestForm(true);
                  setRequestDetails(result.data);
                }
                // Router.push("/");
                // setAnchorEl(null);
              }
            },
            onError: (error) => {
              console.log("Error: " + error);
            },
          });
    }

    return (
        <Box>
        {
            selected.length<=0?
            (<Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                >
                {/* <ActionAlert show={showAlert} close={handleCloseAlert} action={action} /> */}
                
                
                <Grid className="empty-state" item sx={{ display: 'flex' , width: 1, height: window.innerHeight-150 }}  alignItems="center"
                justifyContent="center">
                    <Box >
                    <img
                    src='/empty_states/search-document.png'
                    width="400px"
                    alt="empty list"
                    style={{borderRadius: 50}}
                    />
                    <Typography variant="h5" component="h6" color="#00c69d" align="center" >
                    Nothing in the withdrawal list.
                    </Typography>
                    <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 1,
                    m: 1,
                    bgcolor: 'transparent',
                    }}
                    >
                    
                    <Fab variant="extended" color="secondary" onClick={()=>{setFind(true)}} sx={{boxShadow:1}}>
                        <Search sx={{ mr: 1 }} />
                        Find a Document
                    </Fab>
                    </Box>
                    
                    </Box>
                </Grid> 
                
                
            </Grid>  )
            :
            (
            <Box>
                <Box display={"flex"} flexDirection="row-reverse">
                    <Button
                    variant="contained"
                    color="secondary"
                    endIcon={<Save />}
                    sx={{ m: 1 }}
                    onClick={() => {
                        // console.log("boxes: " + JSON.stringify(boxes));
                        setOpenConfirm(true);
                    }}
                    >
                    Save
                    </Button>
                    <Button
                    variant="contained"
                    endIcon={<Add />}
                    sx={{ m: 1 }}
                    onClick={() => {
                        setFind(true)
                    }}

                    >
                    Add Box
                    </Button>
                </Box>
                <RequestTableList 
                    thead={thead} 
                    rows={selected} 
                    onDeleteItem={(id)=>handleDeleteItem(id)}
                    onEditItem={(id)=>{handleEditItem(id)}}
                /> 
            </Box>
            )         
        }
         
        <SearchRecordDialog 
            isOpen={find} 
            onClose={()=>handleCloseSearch()}  
            onAddItem={(selections)=>handleAddItem(selections)}
            onList={selected.map((val)=>{return val.inventory_id})}
        />
        <EditWithdrawalDialog
            isOpen={editID!==null}
            onClose={()=>setEditID(null)}
            toEdit={selected[editID]}
            onSave={(newValue)=>{handleSaveEdit(newValue)}}
        />
        <ConfirmRequestDialog
            isOpen={openConfirm}
            onClose={(save) => (save ? handleSaveRequest() : setOpenConfirm(false))}
            request={"withdrawal"}
            action={"save"}
            isLoading={withdrawal.isLoading}
        />
        <RequestFormDialog
            isOpen={openRequestForm}
            onClose={() => {
            setOpenRequestForm(false);
            setSelected([]);
            // newBoxCode.refetch();
            }}
            type={"withdrawal"}
            data={requestDetails}
        />
        </Box>
    )
}