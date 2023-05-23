import * as React from 'react';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { DialogProps, SelectedFormat } from '@helpers/interface';

interface EditDialogProps extends DialogProps{
    toEdit: SelectedFormat;
    onSave(val): void
}

export default function EditWithdrawalDialog (props: EditDialogProps){
    const {isOpen, onClose, toEdit, onSave} = props;
    const [error,setError] = React.useState("");
    const [edited,setEdited] = React.useState<SelectedFormat>({
      inventory_id: null,
      box_code: '',
      remarks: '',
      type: 'Photocopy',
      location: '',
    });
  
    const handleClose = () =>{
      onClose();
    }
  
    const handleSave = () =>{
    //   console.log('edited: '+JSON.stringify(edited));
      if(edited.remarks === ''){
          setError("You can't continue with an empty document description field. Please specify a document you want to withdraw from the box or write 'Entire Box' to withdraw the whole box.")
      }
      else onSave(edited);
      
    }
    
    React.useMemo(()=>{
        if(toEdit){
            setEdited({
                ...edited,
                inventory_id: toEdit.inventory_id,
                box_code: toEdit.box_code,
                remarks: toEdit.remarks,
                type: toEdit.type,
                location: toEdit.location,
            })
        }
    },[toEdit])

    return (
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Edit details</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Box code and location can't be changed.
          </DialogContentText>
          <Box sx={{width:1, padding: '5px'}}>
                <Typography variant="subtitle2" color="error" >{error ? 'Whoops! Something went wrong.' : ''}</Typography>
                {error?
                <Typography variant="caption" color="error" key="boxCode" >*{error}<br></br></Typography>:''}
          </Box>
          <Box >
          <TextField
            fullWidth
            id="boxCode"
            label="Box code"
            variant="outlined"
            value={edited.box_code}
            inputProps={{ readOnly: true, }}
            sx={{display: 'block',my:2}}
          />
          <TextField
            fullWidth
            autoFocus
            multiline
            rows={6}
            id="documentDescription"
            label="Document Description"
            variant="outlined"
            value={edited.remarks}
            onChange={(event)=>{
              setEdited({...edited, remarks: event.target.value})
            }}
            sx={{display: 'block',my:2}}
          />
          </Box>
          <Box sx={{display:'flex'}}>
            <FormControl sx={{ mb: 1,mr:1, width: 300 }}>
              <InputLabel id="demo-multiple-checkbox-label">Copy Type</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={edited.type}
                onChange={(event)=>{setEdited({...edited, type: event.target.value})}}
                input={<OutlinedInput label="Copy Type" />}
              >
                  <MenuItem key="Photocopy" value="Photocopy">
                    {"Photocopy"}
                  </MenuItem>
                  <MenuItem key="Original" value="Original copy">
                    {"Original copy"}
                  </MenuItem>
              </Select>
            </FormControl>
            <TextField
              rows={6}
              id="location"
              label="Location"
              variant="outlined"
              inputProps={{ readOnly: true, }}
              sx={{flexGrow:1,mb:1, ml:1}}
              value={edited.location}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="secondary">Edit</Button>
        </DialogActions>
      </Dialog>
    )
  }