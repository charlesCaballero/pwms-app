import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FormProps, RegisterFormProps } from "@helpers/interface";
import { AddToPhotos, ModeEdit } from "@mui/icons-material";
import { userDetailsMutation } from "@helpers/api-mutations";
import { useMutation, useQuery } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { getOfficesQuery } from "@helpers/api-queries";

const validationSchema = Yup.object().shape({
  company_id_number: Yup.string()
    .required("You forgot to give your id number.")
    .matches(
      /^[0-9]+$/,
      "Your id number should not contain any letter or symbol"
    )
    .min(8, "Id number should be 8 digits")
    .max(8, "Id number can't exceed 8 digits"),
  first_name: Yup.string().required("Your first name is empty."),
  last_name: Yup.string().required("Your last name is empty."),
  email: Yup.string()
    .email("Please provide a valid email.")
    .required("You forgot to provide an email."),
  office_id: Yup.string()
    .matches(/^[1-9]+$/, "Please select which office you belong.")
    .required("You forgot to choose the office where you belong."),
});

export default function UserForm(props: FormProps) {
  const { isOpen, onClose, rowData } = props;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: { office_id: "1" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState("");

  const updateUser = useMutation((values: any) => {
    return api(
      Method.PUT,
      `${userDetailsMutation}/${rowData.id}`,
      values
    ) as AxiosPromise<any>;
  });

  const officeList = useQuery(
    "officeList",
    async () => (await api(Method.GET, `${getOfficesQuery}`)) as any,
    { refetchOnWindowFocus: false }
  );

  useMemo(() => {
    if (rowData) {
      reset(rowData);
    }
  }, [rowData]);

  const onSubmit = async (data: RegisterFormProps) => {
    await updateUser.mutate(data, {
      onSuccess: (result: any) => {
        // console.log("result: " + JSON.stringify(result));
        if (result.status === "Error") {
          setRegistrationError(result.message);
        } else {
          onClose(true);
        }
      },
      onError: (result: any) => {
        setRegistrationError(result.message);
        reset(data);
      },
    });
  };

  return (
    <Dialog
      fullWidth
      maxWidth={"sm"}
      open={isOpen}
      onClose={() => onClose(false)}
    >
      <DialogTitle variant="h6" fontWeight={"bold"}>
        {rowData ? (
          <ModeEdit sx={{ mb: -0.8, color: "primary.main", mr: 2 }} />
        ) : (
          <AddToPhotos sx={{ mb: -0.8, color: "primary.main", mr: 2 }} />
        )}
        {rowData ? "Edit User" : " New User"}
      </DialogTitle>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            {registrationError ? (
              <Grid item xs={12}>
                <Alert severity="error">{registrationError}</Alert>
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="company-id-number"
                label="ID Number"
                {...register("company_id_number")}
                error={
                  errors.company_id_number !== undefined ||
                  registrationError.length > 0
                }
                helperText={errors.company_id_number?.message}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="first-name"
                label="First Name"
                {...register("first_name")}
                error={errors.first_name !== undefined}
                helperText={errors.first_name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="last-name"
                label="Last Name"
                autoComplete="family-name"
                {...register("last_name")}
                error={errors.last_name !== undefined}
                helperText={errors.last_name?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                {...register("email")}
                error={errors.email !== undefined}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={errors.office_id !== undefined}>
                <InputLabel required id="office-id" color="success">
                  Office
                </InputLabel>
                <Select
                  labelId="office-id-select-label"
                  id="office-id-select"
                  label="Office"
                  defaultValue="1"
                  required
                  {...register("office_id")}
                >
                  {officeList?.data?.map((office) => {
                    return (
                      <MenuItem key={office.id} value={office.id}>
                        {office.name + " (" + office.acronym + ")"}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.office_id !== undefined ? (
                  <FormHelperText>{errors.office_id?.message}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => onClose(false)} color={"inherit"}>
            Cancel
          </Button>
          <Button type="submit" variant={"contained"}>
            Update
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
