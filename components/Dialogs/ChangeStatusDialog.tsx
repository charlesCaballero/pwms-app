import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@helpers/interface";
import { FormControlLabel, Switch } from "@mui/material";
import { useMutation } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { userDetailsMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";

interface ChangeStatusProps extends DialogProps {
  status: boolean;
  user: string;
}

export default function ChangeStatusDialog(props: ChangeStatusProps) {
  const { isOpen, onClose, status, user } = props;
  const [currentStatus, setCurrentStatus] = React.useState<boolean>(status);

  const updateUser = useMutation((values: any) => {
    return api(
      Method.PUT,
      `${userDetailsMutation}/${user}`,
      values
    ) as AxiosPromise<any>;
  });

  const handleChange = () => {
    const values = {
      status: currentStatus,
    };

    updateUser.mutateAsync(values, {
      onSuccess: (result) => {
        // console.log("result: " + JSON.stringify(result));
        if (result) {
          onClose(true);
        }
      },
      onError: () => {},
    });
  };

  return (
    <React.Fragment>
      <Dialog open={isOpen} onClose={() => onClose(false)}>
        <DialogTitle>Change Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Changing the status means that you are allowing or denying user's
            access to all previleges given to the user.
          </DialogContentText>
          <FormControlLabel
            control={
              <Switch
                checked={currentStatus}
                onChange={() => setCurrentStatus(!currentStatus)}
              />
            }
            label="Allow Access?"
            sx={{ p: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={() => handleChange()}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
