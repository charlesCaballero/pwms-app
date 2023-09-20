import * as React from "react";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import { DialogProps } from "@helpers/interface";
import BoxLabel from "@components/BoxLabel";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BoxDialogProps extends DialogProps {
  boxData: any;
}

export default function BoxLabelDialog(props: BoxDialogProps) {
  const { isOpen, onClose, boxData } = props;

  // console.log("boxData@Dialog: "+JSON.stringify(boxData));
  

  return (
    <div>
      <Dialog
        fullScreen
        open={isOpen}
        onClose={() => onClose(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Box Label
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              onClick={() => onClose(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <BoxLabel data={boxData} />
      </Dialog>
    </div>
  );
}
