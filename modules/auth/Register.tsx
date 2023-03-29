<<<<<<< HEAD
=======
import {
  Alert,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
import { api, Method } from "@utils/queryUtils";
import { registerMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import app from "@helpers/app-version.json";
import Router from "next/router";
import AlertDialog from "@components/Dialogs/AlertDialog";
import AppLogo from "@assets/images/pwms-logo-2.png";
import { useForm } from "react-hook-form";
<<<<<<< HEAD
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { RegisterFormProps } from "@helpers/interface";
import { getOfficesQuery } from "@helpers/api-queries";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
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
import Link from "@mui/material/Link";

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
  password: Yup.string()
    .required("Your password is empty.")
    .min(6, "Password should at atleast contain 6 characters."),
=======
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { RegisterFormProps } from "@helpers/interface";
import { getOfficesQuery } from "@helpers/api-queries";

const validationSchema = Yup.object().shape({
  company_id_number: Yup.string()
    .required('You forgot to give your id number.')
    .matches(/^[0-9]+$/, "Your id number should not contain any letter or symbol")
    .min(8, 'Id number should be 8 digits')
    .max(8, "Id number can't exceed 8 digits"),
  first_name: Yup.string().required('Your first name is empty.'),
  last_name: Yup.string().required('Your last name is empty.'),
  email: Yup.string().email('Please provide a valid email.').required('You forgot to provide an email.'),
  office_id: Yup.string().matches(/^[1-9]+$/, 'Please select which office you belong.').required('You forgot to choose the office where you belong.'),
  password: Yup.string().required("Your password is empty.").min(6, "Password should at atleast contain 6 characters."),
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
});

function Copyright(props: any) {
  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Typography
        variant="body2"
        color="text.secondary"
        align="left"
        flexGrow={1}
        {...props}
      >
        {"Copyright © PhilHealth "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="right"
        {...props}
      >
        v{app.version}
      </Typography>
    </Box>
  );
}

export default function Register() {
<<<<<<< HEAD
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
=======
  const { register, reset, handleSubmit, formState: { errors } } = useForm<RegisterFormProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: { office_id: '1' }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const registerUser = useMutation((data: any) => {
    return api(Method.POST, registerMutation, data) as AxiosPromise<any>;
  });

  const officeList = useQuery(
    "result",
<<<<<<< HEAD
    async () => (await api(Method.GET, `${getOfficesQuery}`)) as any,
=======
    async () =>
      (await api(
        Method.GET,
        `${getOfficesQuery}`,
      )) as any,
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
    { refetchOnWindowFocus: false }
  );

  const onSubmit = async (data: RegisterFormProps) => {
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
<<<<<<< HEAD
  };

  const onCloseSuccessAlert = () => {
    console.log("im called.. yehey!!");
=======
  }

  const onCloseSuccessAlert = () => {
    console.log('im called.. yehey!!');
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983

    setIsAlertOpen(false);
    Router.push("/auth/login");
  };

  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{ height: 100, width: 100 }}
          variant={"square"}
          alt="PWMS Logo"
          src={AppLogo.src}
        ></Avatar>
        <Typography component="h1" variant="h5" pt={3}>
          Register
        </Typography>
<<<<<<< HEAD
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
=======
        <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {registrationError ? (
              <Grid item xs={12}>
                <Alert severity="error">
                  {registrationError}
                </Alert>
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
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
<<<<<<< HEAD
                error={
                  errors.company_id_number !== undefined ||
                  registrationError.length > 0
                }
=======
                error={errors.company_id_number !== undefined || registrationError.length > 0}
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
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
<<<<<<< HEAD
                  {officeList.data?.map((office) => {
                    return (
                      <MenuItem key={office.id} value={office.id}>
                        {office.name + " (" + office.acronym + ")"}
                      </MenuItem>
                    );
                  })}
=======
                  {
                    officeList.data?.map((office) => {
                      return <MenuItem value={office.id}>{office.name + " (" + office.acronym + ")"}</MenuItem>
                    })
                  }
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/auth/login" variant="body2" color={"info.main"}>
                Already have an account? Log in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 5 }} />

      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => onCloseSuccessAlert()}
        type="info"
        title="Registration Complete"
        message="The admin has been notified of your registration. Please wait for a confimation to log-in in your account."
      />
    </Container>
  );
}
