import { DialogProps } from "@helpers/interface";
import LoadingButton from "@mui/lab/LoadingButton";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

type Requests = "storage" | "withdrawal" | "return" | "disposal" | "confirm" | "close";
type Actions = "delete" | "save" | "continue";
interface ConfirmRequestDialog extends DialogProps {
  request: Requests;
  action: Actions;
  isLoading?: boolean;
}

export default function ConfirmRequestDialog(props: ConfirmRequestDialog) {
  const { isOpen, onClose, request, action, isLoading=false } = props;

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => onClose(false)}
        maxWidth={"xs"}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {request === "confirm"?"Confirm Request?":"Save and continue?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {
            request === "confirm"?
            "By continuing this action, you are confirming that you have recieved the request form with complete signatures in the signatory."
            :request === "close"?
            "By continuing this action, you are confirming that you have successfully completed the request for the selected record. "
            :"Save " +
              (request === "return" || request === "disposal"
                ? "selected"
                : "current list of") +
              " records and continue request for " +
              request +
              "."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" onClick={() => onClose(false)}>
            Cancel
          </Button>
          {action === "delete" ? (
            <LoadingButton
              variant="contained"
              color="error"
              onClick={() => onClose(true)}
              autoFocus
              loading={isLoading}
            >
              Continue
            </LoadingButton>
          ) : action === "save" ? (
            <LoadingButton
              // type={"submit"}
              loading={isLoading}
              onClick={() => onClose(true)}
              color={request === "disposal" ? "error" : "secondary"}
              variant="contained"
              form="saveForm"
            >
              Save
            </LoadingButton>
          ) : action === "continue" ? (
            <LoadingButton
              // type={"submit"}
              loading={isLoading}
              onClick={() => onClose(true)}
              color={request === "disposal" ? "error" : "secondary"}
              variant="contained"
              form="saveForm"
            >
              Continue
            </LoadingButton>
          ):null}
        </DialogActions>
      </Dialog>
    </div>
  );
}
