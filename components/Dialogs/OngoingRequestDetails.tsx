import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogProps } from '@helpers/interface';
import Grid from '@mui/material/Grid';
import { Box, Divider, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';

interface RequestDetailsProps extends DialogProps {
    data: any;
    getRemarks?(val:any):void;
    getLocation?(val:any):void;
    type: string;
}


export default function OngoingRequestDetails(props:RequestDetailsProps) {
    const {isOpen,onClose,data, getRemarks,getLocation,type} = props;
    const [remarks, setRemarks]= React.useState('');
    const [location, setLocation] = React.useState({
        floor: '',
        rack: '',
        bay: '',
        level: '',
        position: '',
    })

    function formatDate(d) {
        const date = new Date(d);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        
        return monthNames[monthIndex]+ ' ' + day + ',' + year;
    }

    React.useEffect(()=>{
        type!=="withdrawal"?getRemarks(remarks):setRemarks(data.remarks);
    },[remarks])

    React.useEffect(()=>{
        if(type==='storage'){
            getLocation(location.floor+""+location.rack+"-"+location.bay+""+location.level+"-"+location.position);
        }
    },[location])

    return (
        <div>
        
        <Dialog 
            open={isOpen} 
            onClose={()=>onClose(false)}
            fullWidth
            maxWidth={'md'}
        >
            <DialogTitle>Request Details</DialogTitle>
            <DialogContent>
            <Grid container >
                <Grid item xs={3}>
                    <Typography>
                        Box Code :
                    </Typography>
                </Grid>
                <Grid item xs={9} >
                    <Typography sx={{fontWeight:'bold'}}>
                        {data.box_code}
                    </Typography>
                </Grid>
                <Grid item xs={3}>
                    <Typography>
                        Request Form No. :
                    </Typography>
                </Grid>
                <Grid item xs={9} >
                    <Typography sx={{fontWeight:'bold'}}>
                        {
                        type==="storage"?data.storage?.form_no:
                        type==="withdrawal"?data.withdrawal?.form_no:
                        type==="return"?data.return?.form_no:
                        type==="disposal"?data.disposal?.form_no:
                        ''
                        }
                    </Typography>
                </Grid>
                <Grid  xs={3} >
                    <Typography>
                        Requested by :
                    </Typography>
                </Grid>
                <Grid xs={9} >
                    <Typography sx={{fontWeight:'bold'}}>
                        {data.user?.first_name + " " + data.user?.last_name}
                    </Typography>
                </Grid>
                <Grid xs={3} >
                    <Typography >
                        Department/Unit :
                    </Typography>
                </Grid>
                <Grid xs={9} >
                    <Typography sx={{fontWeight:'bold'}}>
                        {data.office?.name}
                    </Typography>
                </Grid>
                <Grid xs={3} >
                    <Typography >
                        Date requested :
                    </Typography>
                </Grid>
                <Grid xs={9} >
                    <Typography sx={{fontWeight:'bold'}}>
                        {formatDate(data.storage?.created_at)}
                    </Typography>
                </Grid>
                {
                    type==="withdrawal"&&
                    (
                        <React.Fragment>
                            <Grid xs={3} >
                                <Typography >
                                    Location :
                                </Typography>
                            </Grid>
                            <Grid xs={9} >
                                <Typography sx={{fontWeight:'bold'}}>
                                    {data.location}
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    )
                }
                
            </Grid>
            {
            type==='storage'&&
            (
            <React.Fragment>
            <DialogContentText sx={{py:1}}>
                Please specify the location where the document/record is stored.
            </DialogContentText>
            <Box display="flex" justifyContent='center' alignItems='center' >
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Floor</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={location.floor}
                    onChange={(event)=>{
                        setLocation({...location,floor:event.target.value})
                    }}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    <MenuItem value={"G"}>Ground</MenuItem>
                    <MenuItem value={"M"}>Mezzanine</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Rack</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={location.rack}
                    onChange={(event)=>{
                        setLocation({...location,rack:event.target.value})
                    }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {[...Array(36)].map((e, i) => (<MenuItem key={'menu-item-'+i} value={(i+1).toString().padStart(2, '0')}>Rack {(i+1).toString().padStart(2, '0')}</MenuItem>))}
                    </Select>
                </FormControl>
                <span>&#8211;</span>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Bay</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={location.bay}
                    onChange={(event)=>{
                        setLocation({...location,bay:event.target.value})
                    }}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {[...Array(4)].map((e, i) => (<MenuItem key={'menu-item-'+i} value={(i+1).toString().padStart(2, '0')}>Bay {(i+1).toString().padStart(2, '0')}</MenuItem>))}
                    </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Level</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={location.level}
                    onChange={(event)=>{
                        setLocation({...location,level:event.target.value})
                    }}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {[...Array(4)].map((e, i) => (<MenuItem key={'menu-item-'+i} value={(i+1).toString().padStart(2, '0')}>Level {(i+1).toString().padStart(2, '0')}</MenuItem>))}
                    </Select>
                </FormControl>
                <span>&#8211;</span>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
                    <InputLabel id="demo-simple-select-filled-label">Position</InputLabel>
                    <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={location.position}
                    onChange={(event)=>{
                        setLocation({...location,position:event.target.value})
                    }}
                    MenuProps={{ PaperProps: { sx: { maxHeight: 200 } } }}
                    >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {[...Array(9)].map((e, i) => (<MenuItem key={'menu-item-'+i} value={(i+1).toString().padStart(2, '0')}>Position {(i+1).toString().padStart(2, '0')}</MenuItem>))}
                    </Select>
                </FormControl>
            </Box>
            <Box display="flex" justifyContent='center' alignItems='center' sx={{p:2}}>
                <Typography sx={{pr:1}}>Location code: </Typography>
                <Typography color="text.disabled">{location.floor+""+location.rack+"-"+location.bay+""+location.level+"-"+location.position}</Typography>
            </Box>
            </React.Fragment>
            )}
            
            {
            type==="withdrawal" || type==="return"&&<Typography >Withdrawal Details :</Typography>
            }
            {
                type==="return"&&(
                    <TextField
                            id="withdrawal-remarks"
                            multiline
                            rows={3}
                            sx={{mb:2, mt:1}}
                            fullWidth
                            value={data.withdrawal?.remarks}
                            inputProps={{ readOnly: true}}
                        />
                )
            }
            {
            type!=="withdrawal" &&
            <React.Fragment>
            <Divider sx={{mt:2}}/>
            <DialogContentText sx={{py:1}}>You can leave remarks if you have comments regarding this request</DialogContentText>
            </React.Fragment>
            }
            <TextField
                    id="remarks"
                    label={type!=="withdrawal"?"Remarks":null}
                    multiline
                    rows={3}
                    sx={{mb:2, mt:1}}
                    fullWidth
                    value={type==="withdrawal"?data.withdrawal?.remarks:remarks}
                    onChange={(event) => {
                        setRemarks(event.target.value);
                      }}
                    inputProps={{ readOnly: type==="withdrawal" }}
                />
            </DialogContent>
            <DialogActions sx={{p:2}}>
            <Button color='inherit' onClick={()=>onClose(false)}>Cancel</Button>
            <Button 
                variant='contained' 
                disabled={type==='storage'&&(Object.values(location).includes(undefined) || Object.values(location).includes(""))} 
                onClick={()=>onClose(true)}
            >
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
