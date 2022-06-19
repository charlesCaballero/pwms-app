import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormProps } from "@helpers/interface";
import {
  Box,
  FormControl,
  Input,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { AddToPhotos, ModeEdit } from "@mui/icons-material";
import { officeMutation } from "@helpers/api/mutations";
import { useMutation } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import { grey } from "@mui/material/colors";

type FormValues = {
  name: string;
  acronym: string;
  code: string;
};

export default function OfficeForm(props: FormProps) {
  const { isOpen, onClose, rowData } = props;
  const { register, handleSubmit, reset } = useForm<FormValues>();

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
    resetForm();
    onClose(false);
  };

  const resetForm = () => {
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
    }
  }, [rowData]);

  const handleFormSubmit = handleSubmit((values) => {
    rowData
      ? updateOffice.mutateAsync(values, {
          onSuccess: () => {
            console.log("result: " + JSON.stringify(values));
            resetForm();
            onClose(true);
          },
          onError: () => {},
        })
      : addOffice.mutateAsync(values, {
          onSuccess: () => {
            resetForm();
            onClose(true);
          },
          onError: () => {},
        });
  });

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
      open={isOpen}
      onClose={() => handleFormClose()}
    >
      <DialogTitle>
        {rowData ? (
          <Typography variant="h6" fontWeight={"bold"}>
            <ModeEdit sx={{ mb: -0.8, color: "primary.main", mr: 2 }} />
            Edit Office
          </Typography>
        ) : (
          <Typography variant="h6" fontWeight={"bold"}>
            <AddToPhotos sx={{ mb: -0.8, color: "primary.main", mr: 2 }} />
            New Office
          </Typography>
        )}
      </DialogTitle>
      <Box component={"form"} onSubmit={handleFormSubmit}>
        <DialogContent>
          <FormControl fullWidth variant="standard" sx={{ my: 2 }}>
            <Typography variant="subtitle2" fontWeight={"bold"}>
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
          </FormControl>
          <Box display={"flex"} sx={{ my: 2 }}>
            <Box flexGrow={1} pr={2}>
              <FormControl fullWidth variant="standard">
                <Typography variant="subtitle2" fontWeight={"bold"}>
                  Acronym
                </Typography>
                <Input
                  placeholder=""
                  inputProps={{ "aria-label": "office-name" }}
                  {...register("acronym")}
                  sx={{
                    bgcolor: grey[200],
                    px: 1,
                    pt: 1,
                  }}
                />
              </FormControl>
            </Box>
            <Box flexGrow={1} pl={2}>
              <FormControl fullWidth variant="standard">
                <Typography variant="subtitle2" fontWeight={"bold"}>
                  Office Code
                </Typography>
                <Input
                  placeholder="Code"
                  inputProps={{ "aria-label": "office-name" }}
                  {...register("code")}
                  sx={{
                    bgcolor: grey[200],
                    px: 1,
                    pt: 1,
                  }}
                />
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
