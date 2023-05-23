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

type Requests = "storage" | "withdrawal" | "return" | "disposal";
type Actions = "delete" | "save";
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
          {"Save and continue?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Save " +
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
          ) : (
            ""
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
