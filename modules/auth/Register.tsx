import { api, Method } from "@utils/queryUtils";
import { registerMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import AlertDialog from "@components/Dialogs/AlertDialog";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { RegisterFormProps } from "@helpers/interface";
import { getOfficesQuery, getRolesQuery } from "@helpers/api-queries";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";

const validationSchema = Yup.object().shape({
  company_id_number: Yup.string()
    .required("You forgot to give the id number.")
    .matches(/^[0-9]+$/, "ID number should not contain any letter or symbol")
    .min(8, "Id number should be 8 digits")
    .max(8, "Id number can't exceed 8 digits"),
  first_name: Yup.string().required("First name is empty."),
  middle_name: Yup.string().required("Middle name is empty."),
  last_name: Yup.string().required("Last name is empty."),
  position: Yup.string().required("Position is empty."),
  contact_number: Yup.string(),
  email: Yup.string()
    .email("Please provide a valid email.")
    .required("You forgot to provide an email."),
  office_id: Yup.string()
    .matches(/^[1-9]+$/, "Please select which office the user belongs.")
    .required("You forgot to choose the office where the user belongs."),
  role_id: Yup.string()
    .matches(/^[1-9]+$/, "Please select what role the user belongs.")
    .required("You forgot to choose the role where the user belongs."),
  password: Yup.string()
    .required("Password is empty.")
    .min(6, "Password should at at least contain 6 characters."),
});

interface RegisterProps {
  onClose(): void;
}

export default function Register(props: RegisterProps) {
  const { onClose } = props;
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: { office_id: "1", role_id: "2" },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const registerUser = useMutation((data: any) => {
    return api(Method.POST, registerMutation, data) as AxiosPromise<any>;
  });

  const officeList = useQuery(
    "officeList",
    async () => (await api(Method.GET, `${getOfficesQuery}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const rolesList = useQuery(
    "rolesList",
    async () => (await api(Method.GET, `${getRolesQuery}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const onSubmit = async (data: RegisterFormProps) => {
    // console.log("form data: "+JSON.stringify(data));

    await registerUser.mutate(data, {
      onSuccess: (result: any) => {
        // console.log("result: " + JSON.stringify(result));
        if (result.status === "Error") {
          setRegistrationError(result.message);
        } else {
          setIsAlertOpen(true);
        }
      },
      onError: (result: any) => {
        setRegistrationError(result.message);
        reset(data);
      },
    });
  };

  const onCloseSuccessAlert = () => {
    setIsAlertOpen(false);
    onClose();
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          // marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            {registrationError ? (
              <Grid item xs={12}>
                <Alert severity="error">{registrationError}</Alert>
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={6}>
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
            <Grid item xs={6}>
              <FormControl fullWidth error={errors.role_id !== undefined}>
                <InputLabel required id="role-id" color="success">
                  Role
                </InputLabel>
                <Select
                  labelId="role-id-select-label"
                  id="role-id-select"
                  label="Role"
                  defaultValue="2"
                  required
                  {...register("role_id")}
                >
                  {rolesList?.data?.map((role) => {
                    return (
                      <MenuItem key={role.id} value={role.id}>
                        {role.name + " (" + role.abbreviation + ")"}
                      </MenuItem>
                    );
                  })}
                </Select>
                {errors.role_id !== undefined ? (
                  <FormHelperText>{errors.role_id?.message}</FormHelperText>
                ) : (
                  ""
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
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
                id="middle-name"
                label="Middle Name"
                {...register("middle_name")}
                error={errors.middle_name !== undefined}
                helperText={errors.middle_name?.message}
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
                id="position"
                label="Position"
                autoComplete="position"
                {...register("position")}
                error={errors.position !== undefined}
                helperText={errors.position?.message}
              />
            </Grid>
            <Grid item xs={12} sm={7}>
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
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                id="contact-number"
                label="Contact Number"
                autoComplete="contact_number"
                {...register("contact_number")}
                error={errors.contact_number !== undefined}
                helperText={errors.contact_number?.message}
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
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="new-password"
                {...register("password")}
                error={errors.password !== undefined}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    value={showPassword}
                    onChange={() => setShowPassword(!showPassword)}
                  />
                }
                label="Show password"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Button
                onClick={onClose}
                type="button"
                fullWidth
                variant="text"
                color="inherit"
              >
                Cancel
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="secondary"
              >
                Register
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 5 }} /> */}

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => onCloseSuccessAlert()}
        type="info"
        title="User Successfully Added"
        message="You can activate and change the role of the user anytime in the users module."
      />
    </Container>
  );
}
