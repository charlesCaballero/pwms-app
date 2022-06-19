import { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { DeleteDialogProps } from "@helpers/interface";
import { Alert, AlertTitle, Box, Input, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

export default function DeleteDialog(props: DeleteDialogProps) {
  const { isOpen, onClose, rowData, isStrict = true } = props;
  const [confirmDelete, setConfirmDelete] = useState<string>("");

  return (
    <div>
      <Dialog
        open={isOpen}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth={"sm"}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h6" fontWeight={"bold"}>
            <Delete sx={{ mb: -0.8, color: "error.main", mr: 2 }} />
            Delete ?
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error">
            <AlertTitle>
              You are about to <strong>delete</strong> a record with the
              following data:
            </AlertTitle>
            <pre>{JSON.stringify(rowData, null, 2)}</pre>
          </Alert>

          {isStrict ? (
            <Box>
              <Typography variant="body1" py={2}>
                If this is not a mistake, Please write <b>Delete</b> to confirm.
              </Typography>
              <Input
                inputProps={{ "aria-label": "delete" }}
                fullWidth
                error
                autoFocus
                placeholder="Write here..."
                sx={{
                  bgcolor: grey[200],
                  px: 1,
                  pt: 1,
                }}
                onChange={(e) => setConfirmDelete(e.target.value)}
              />
            </Box>
          ) : (
            <Typography variant="body1" py={2}>
              Are you sure you want to delete the record?
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button
            onClick={() => onClose(false)}
            color={"error"}
            variant={"contained"}
            disabled={confirmDelete !== "Delete" && isStrict}
          >
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
