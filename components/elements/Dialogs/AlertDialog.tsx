import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import ErrorIcon from "@mui/icons-material/Error";
import { AlertDialogProps } from "@helpers/interface";

export default function AlertDialog(props: AlertDialogProps) {
  const { isOpen, onClose, message, type, title } = props;

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <Box display={"flex"}>
            {type === "info" ? (
              <InfoIcon color="info" sx={{ fontSize: 100, mr: 3 }} />
            ) : type === "warning" ? (
              <WarningIcon color="warning" sx={{ fontSize: 100, mr: 3 }} />
            ) : type === "error" ? (
              <ErrorIcon color="error" sx={{ fontSize: 100, mr: 3 }} />
            ) : (
              ""
            )}
            <DialogContentText
              sx={{ whiteSpace: "pre-line" }}
              id="alert-dialog-description"
              pt={2}
              variant={"body1"}
            >
              {message}
            </DialogContentText>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose} variant={"contained"} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
