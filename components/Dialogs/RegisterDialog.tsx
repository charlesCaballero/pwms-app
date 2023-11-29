import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import { DialogProps } from "@helpers/interface";
import Register  from "@modules/auth/Register";

export default function RegisterDialog(props: DialogProps) {
  const { isOpen, onClose } = props;

  return (
    <div>
      <Dialog
        open={isOpen}
        // onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Add a  New User</DialogTitle>
        <DialogContent>
          {/* <Box display={"flex"}>
            
            <DialogContentText
              sx={{ whiteSpace: "pre-line" }}
              id="alert-dialog-description"
              pt={2}
              variant={"body1"}
            >
              {"Register a new user."}
            </DialogContentText>
          </Box> */}
          <Register onClose={()=>onClose()}/>
        </DialogContent>
        
      </Dialog>
    </div>
  );
}
