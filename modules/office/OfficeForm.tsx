import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FormProps } from "@helpers/interface";
import { AddToPhotos, ModeEdit } from "@mui/icons-material";
import { officeMutation } from "@helpers/api-mutations";
import { useMutation } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import { grey } from "@mui/material/colors";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import FormHelperText from "@mui/material/FormHelperText";
import DialogActions from "@mui/material/DialogActions";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";

type FormValues = {
  name: string;
  acronym: string;
  code: string;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("You forgot the name of the office."),
  acronym: Yup.string().required("Office acronym is needed."),
  code: Yup.string().required("Please specify the office code."),
});

export default function OfficeForm(props: FormProps) {
  const { isOpen, onClose, rowData, } = props;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(validationSchema),
  });

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

  const onSubmit = async (values: FormValues) => {
    rowData
      ? await updateOffice.mutateAsync(values, {
          onSuccess: (result) => {
            // console.log("result: " + JSON.stringify(result));
            if (result) {
              clearForm();
              onClose(true);
            }
          },
          onError: () => {},
        })
      : await addOffice.mutateAsync(values, {
          onSuccess: (result) => {
            // console.log("result: " + JSON.stringify(result));
            if (result.data) {
              clearForm();
              onClose(true);
            }
          },
          onError: () => {},
        });
  };

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
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <FormControl
            error={errors?.name !== undefined}
            fullWidth
            variant="standard"
            sx={{ my: 2 }}
          >
            <Typography
              variant="subtitle2"
              fontWeight={"bold"}
              color={errors?.name !== undefined ? "error" : "default"}
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
            {errors?.name !== undefined ? (
              <FormHelperText>{errors?.name?.message}</FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
          <Box display={"flex"} sx={{ my: 2 }}>
            <Box flexGrow={1} pr={2}>
              <FormControl
                error={errors?.acronym !== undefined}
                fullWidth
                variant="standard"
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={"bold"}
                  color={errors?.acronym !== undefined ? "error" : "default"}
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
                {errors?.acronym !== undefined ? (
                  <FormHelperText>{errors?.acronym?.message}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Box>
            <Box flexGrow={1} pl={2}>
              <FormControl
                error={errors?.code !== undefined}
                fullWidth
                variant="standard"
              >
                <Typography
                  variant="subtitle2"
                  fontWeight={"bold"}
                  color={errors?.code !== undefined ? "error" : "default"}
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
                {errors?.code !== undefined ? (
                  <FormHelperText>{errors?.code?.message}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
              
          <LoadingButton loading={addOffice.isLoading || updateOffice.isLoading} onClick={() => handleFormClose()} color={"inherit"}>
            Cancel
          </LoadingButton>
          <LoadingButton loading={addOffice.isLoading || updateOffice.isLoading} type="submit" variant={"contained"}>
            Save
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
