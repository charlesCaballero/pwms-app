import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { DialogProps } from '@helpers/interface';
import RequestForStorage from '@request_forms/RequestForStorage';
import RequestForWithdrawal from '@request_forms/RequestForWithdrawal';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface RequestProps extends DialogProps {
    type: string;
    data: any;
}

export default function RequestFormDialog(props: RequestProps) {
  const { isOpen, onClose, type, data } = props;

  return (
    <div>
      
      <Dialog
        fullScreen
        open={isOpen}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>onClose()}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Request Form
            </Typography>
            <Button autoFocus color="inherit" onClick={()=>onClose()}>
              Close
            </Button>
          </Toolbar>
        </AppBar>
        {type==="storage"?<RequestForStorage data={data}/>: null}
        {type==="withdrawal"?<RequestForWithdrawal data={data}/>: null}
      </Dialog>
    </div>
  );
}