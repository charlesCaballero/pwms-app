import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogProps, TableHeader } from '@helpers/interface';
import Grid from '@mui/material/Grid';
import { Box, Typography } from '@mui/material';
import RequestTableList from '@components/DataTable/RequestTableList';

interface RequestDetailsProps extends DialogProps {
    data: any;
    // getRemarks?(val:any):void;
    type: string;
}

export default function PendingRequestDetails(props:RequestDetailsProps) {
    const {
        isOpen,
        onClose,
        data, 
        // getRemarks, 
        type} = props;
    // const [remarks, setRemarks]= React.useState('');

    
const thead: TableHeader[] = 
type==='storage'?
[
    {
      label: "Box Code",
      type: "string",
      name: "box_code",
    },
    {
      label: "RDS#",
      type: "string",
      name: "rds_number",
      from: "box_details",
      datatype: 'json'
    },
    {
      label: "Document Title and Description",
      type: "string",
      name: "document_title",
      from: "box_details",
      datatype: 'json',
      remarks: 'remarks'
    },
    {
      label: "Document Date",
      type: "string",
      name: "document_date",
      from: "box_details",
      datatype: 'json'
    },
    {
        label: "Disposal Date",
        type: "string",
        name: "disposal_date",
    },
]:
type==='withdrawal'?
[
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
]:
type==='return'?
[
    {
        label: "From Withdrawal",
        type: "string",
        name: "withdrawal_form",
    },
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
]:
type==='disposal'?
[
    {
      label: "Box Code",
      type: "string",
      name: "box_code",
    },
    {
      label: "RDS#",
      type: "string",
      name: "rds_number",
      from: "box_details",
      datatype: 'json'
    },
    {
      label: "Document Title and Description",
      type: "string",
      name: "document_title",
      from: "box_details",
      datatype: 'json',
      remarks: 'remarks'
    },
    {
      label: "Document Date",
      type: "string",
      name: "document_date",
      from: "box_details",
      datatype: 'json'
    },
    {
        label: "Disposal Date",
        type: "string",
        name: "disposal_date",
    },
    {
        label: "Location",
        type: "string",
        name: "location",
    },
]
:[];
  

    function formatDate(d) {
        const date = new Date(d);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        
        return monthNames[monthIndex]+ ' ' + day + ',' + year;
    }

    // React.useEffect(()=>{
    //     getRemarks(remarks);
    // },[remarks])

    React.useMemo(()=>{
        var typeArray = thead.map(function (el) { return el.name; });
        if(type!=='storage' && !typeArray.includes('location')){thead.push({
            label: "Location",
            type: "string",
            name: "location",
        })}
    },[data])

    return (
        <div>
        
        <Dialog 
            open={isOpen} 
            onClose={()=>onClose(false)}
            fullWidth
            maxWidth={type==='storage'||type==='disposal'?'lg':'md'}
        >
            <DialogTitle>Request Details</DialogTitle>
            <DialogContent>
            
            <Grid container spacing={2}>
                <Grid item xs={type==='storage' || type==='disposal'?2:3}>
                    <Typography>
                        Request Form No. :
                    </Typography>
                </Grid>
                <Grid item xs={type==='storage' || type==='disposal'?10:9} >
                    <Typography sx={{fontWeight:'bold'}}>
                        {data.form_no}
                    </Typography>
                </Grid>
                <Grid  xs={type==='storage' || type==='disposal'?2:3} sx={{pl:2}}>
                    <Typography>
                        Prepared by :
                    </Typography>
                </Grid>
                <Grid xs={type==='storage' || type==='disposal'?10:9} sx={{pl:2}}>
                    <Typography sx={{fontWeight:'bold'}}>
                        {data.user_name}
                    </Typography>
                </Grid>
                <Grid xs={type==='storage' || type==='disposal'?2:3} sx={{pl:2}}>
                    <Typography >
                        Department/Unit :
                    </Typography>
                </Grid>
                <Grid xs={type==='storage' || type==='disposal'?10:9} sx={{pl:2}}>
                    <Typography sx={{fontWeight:'bold'}}>
                        {data.office?.name}
                    </Typography>
                </Grid>
                <Grid xs={type==='storage' || type==='disposal'?2:3} sx={{pl:2}}>
                    <Typography >
                        Date requested :
                    </Typography>
                </Grid>
                <Grid xs={type==='storage' || type==='disposal'?10:9} sx={{pl:2}}>
                    <Typography sx={{fontWeight:'bold'}}>
                        {formatDate(data.created_at)}
                    </Typography>
                </Grid>
                <Typography sx={{pl:2}}>
                    Details :
                </Typography>
                <Box sx={{p:2}}>
                    <RequestTableList
                        thead={thead} 
                        rows={data.details}
                        disableButtons={true}
                    />
                </Box>
            </Grid>
            {/* <DialogContentText sx={{py:1}}>
                You can leave remarks if you have comments/reactions regarding this request.
            </DialogContentText>
            <TextField
                    id="remarks"
                    label="Remarks"
                    multiline
                    rows={3}
                    sx={{mb:2}}
                    fullWidth
                    value={remarks}
                    onChange={(event) => {
                        setRemarks(event.target.value);
                      }}
                /> */}
            </DialogContent>
            <DialogActions sx={{p:2}}>
            <Button color='inherit' onClick={()=>onClose(false)}>Cancel</Button>
            <Button variant='contained' onClick={()=>onClose(true)}>Confirm</Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}
