import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormProps } from "@helpers/interface";
import { AddToPhotos, ModeEdit } from "@mui/icons-material";
import { officeMutation } from "@helpers/api-mutations";
import { useMutation } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import { grey } from "@mui/material/colors";
import { isAllTrue, isInputEmpty } from "@helpers/validate";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

type FormValues = {
  name: string;
  acronym: string;
  code: string;
};

export default function OfficeForm(props: FormProps) {
  const { isOpen, onClose, rowData } = props;
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [officeNameError, setOfficeNameError] = useState<any>({});
  const [officeAcronymError, setOfficeAcronymError] = useState<any>({});
  const [officeCodeError, setOfficeCodeError] = useState<any>({});

  const updateOffice = useMutation((values: any) => {
    return api(
      Method.PUT,
      `${officeMutation}/${rowData.id}`,
      values
    ) as AxiosPromise<any>;
  });
  const addOffice = useMutation((values: any) => {
    return api(Method.POST, `${officeMutation}`, values) as AxiosPromise<any>;
  });

  const handleFormClose = () => {
    clearForm();
    onClose(false);
  };

  const clearForm = () => {
    reset({
      name: "",
      acronym: "",
      code: "",
    });
  };

  useMemo(() => {
    if (rowData) {
      reset({
        name: rowData.name,
        acronym: rowData.acronym,
        code: rowData.code,
      });
    } else clearForm();
  }, [rowData]);

  const handleFormSubmit = handleSubmit((values) => {
    const isNameError = isInputEmpty("Office Name", values.name);
    const isAcronymError = isInputEmpty("Acronym", values.acronym);
    const isCodeError = isInputEmpty("Office Code", values.code);

    if (
      isAllTrue([!isNameError.error, !isAcronymError.error, !isCodeError.error])
    ) {
      rowData
        ? updateOffice.mutateAsync(values, {
            onSuccess: (result) => {
              // console.log("result: " + JSON.stringify(result));
              if (result) {
                clearForm();
                onClose(true);
              }
            },
            onError: () => {},
          })
        : addOffice.mutateAsync(values, {
            onSuccess: (result) => {
              // console.log("result: " + JSON.stringify(result));
              if (result.data) {
                clearForm();
                onClose(true);
              }
            },
            onError: () => {},
          });
    }

    setOfficeNameError(isNameError);
    setOfficeAcronymError(isAcronymError);
    setOfficeCodeError(isCodeError);
  });

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
      open={isOpen}
      onClose={() => handleFormClose()}
    >
      <DialogTitle variant="h6" fontWeight={"bold"}>
        {rowData ? (
          <ModeEdit sx={{ mb: -0.8, color: "primary.main", mr: 2 }} />
        ) : (
          <AddToPhotos sx={{ mb: -0.8, color: "primary.main", mr: 2 }} />
        )}
        {rowData ? "Edit Office" : " New Office"}
      </DialogTitle>
      <Box component={"form"} onSubmit={handleFormSubmit}>
        <DialogContent>
          <FormControl
            error={officeNameError.error}
            fullWidth
            variant="standard"
            sx={{ my: 2 }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={"bold"}
              color={officeNameError.error ? "error" : "default"}
            >
              Office Name
            </Typography>
            <Input
              placeholder="Name"
              inputProps={{ "aria-label": "office-name" }}
              {...register("name")}
              sx={{
                bgcolor: grey[200],
                px: 1,
                pt: 1,
              }}
            />
            {officeNameError.error ? (
              <FormHelperText>{officeNameError.message}</FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
          <Box display={"flex"} sx={{ my: 2 }}>
            <Box flexGrow={1} pr={2}>
              <FormControl
                error={officeAcronymError.error}
                fullWidth
                variant="standard"
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={"bold"}
                  color={officeAcronymError.error ? "error" : "default"}
                >
                  Acronym
                </Typography>
                <Input
                  placeholder="Acronym"
                  inputProps={{ "aria-label": "office-acronym" }}
                  {...register("acronym")}
                  sx={{
                    bgcolor: grey[200],
                    px: 1,
                    pt: 1,
                  }}
                />
                {officeAcronymError.error ? (
                  <FormHelperText>{officeAcronymError.message}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Box>
            <Box flexGrow={1} pl={2}>
              <FormControl
                error={officeCodeError.error}
                fullWidth
                variant="standard"
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={"bold"}
                  color={officeCodeError.error ? "error" : "default"}
                >
                  Office Code
                </Typography>
                <Input
                  placeholder="Code"
                  inputProps={{ "aria-label": "office-code" }}
                  {...register("code")}
                  sx={{
                    bgcolor: grey[200],
                    px: 1,
                    pt: 1,
                  }}
                />
                {officeCodeError.error ? (
                  <FormHelperText>{officeCodeError.message}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => handleFormClose()} color={"inherit"}>
            Cancel
          </Button>
          <Button type="submit" variant={"contained"}>
            Save
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
