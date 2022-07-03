import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@helpers/interface";
import { Box } from "@mui/system";
import { Upload } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { changePhotoMutation } from "@helpers/api-mutations";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";

interface ChangeProfileProps extends DialogProps {
  userInitials: string;
  photoRef: any;
}

interface FormProp {
  photo: any;
}

export default function ChangeProfilePhoto(props: ChangeProfileProps) {
  const { isOpen, onClose, userInitials, photoRef } = props;
  const { register, handleSubmit, setValue } = useForm<FormProp>();
  const [img, setImg] = React.useState<any | null>(null);
  const [uploadError, setUploadError] = React.useState<string>("");

  const onImageChange = (e: any) => {
    const [file]: any = e.target.files;
    // console.log("file size: " + file.size);
    const myReader = new FileReader();
    myReader.onloadend = function (event) {
      setValue("photo", myReader.result);
    };
    myReader.readAsDataURL(file);
    setUploadError("");
    setImg(URL.createObjectURL(file));
  };

  const changePhoto = useMutation((data: any) => {
    return api(Method.POST, changePhotoMutation, data) as AxiosPromise<any>;
  });

  const onSubmit = async (data: FormProp) => {
    // console.log("data - readAsDataURL: " + JSON.stringify(data.photo));
    if (data.photo.length > 0) {
      await changePhoto.mutate(data, {
        onSuccess: (result: any) => {
          //   console.log("result: " + JSON.stringify(result));
          if (result.status === "Error") {
            setUploadError(result.message);
          } else {
            onClose(true);
          }
        },
      });
    } else setUploadError("You have to select a photo.");
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={isOpen}
      onClose={() => onClose(false)}
    >
      <DialogTitle>Profile Picture</DialogTitle>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText pb={2}>
            A picture helps you know that you are actually signed-in in your own
            account.
          </DialogContentText>
          <Box display="flex" flexDirection={"column"} alignItems={"center"}>
            <Avatar
              alt={userInitials}
              src={img ? img : photoRef}
              sx={{
                width: 250,
                height: 250,
                fontSize: 150,
                bgcolor: "#111827",
                fontWeight: "bold",
              }}
            >
              {!img ? userInitials : ""}
            </Avatar>
            {uploadError && (
              <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
                {uploadError}
              </Alert>
            )}
            <Box p={3}>
              <Button
                fullWidth
                component={"label"}
                variant={"contained"}
                startIcon={<Upload />}
              >
                Upload Photo
                <input
                  {...register("photo")}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={onImageChange}
                />
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => onClose(false)}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" color="info">
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
