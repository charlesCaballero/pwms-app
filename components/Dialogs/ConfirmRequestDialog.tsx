import { DialogProps } from "@helpers/interface";
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
}

export default function ConfirmRequestDialog(props: ConfirmRequestDialog) {
  const { isOpen, onClose, request, action } = props;

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
            <Button
              variant="contained"
              color="error"
              onClick={() => onClose(true)}
              autoFocus
            >
              Continue
            </Button>
          ) : action === "save" ? (
            <Button
              // type={"submit"}
              onClick={() => onClose(true)}
              color={request === "disposal" ? "error" : "secondary"}
              variant="contained"
              form="saveForm"
            >
              Save
            </Button>
          ) : (
            ""
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
