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
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import { registerMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import {
  isInputNumber,
  isInputEmpty,
  isInputEmail,
  isInputPassword,
  isAllTrue,
} from "helpers/validate";
import { useState } from "react";
import { useMutation } from "react-query";
import app from "@helpers/app-version.json";
import Router from "next/router";
import AlertDialog from "@components/Dialogs/AlertDialog";
import AppLogo from "@assets/images/pwms-logo-2.png";

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
  const [officeID, setOfficeID] = useState("");
  const [idError, setIdError] = useState<any>({});
  const [firstNameError, setFirstNameError] = useState<any>({});
  const [lastNameError, setLastNameError] = useState<any>({});
  const [emailError, setEmailError] = useState<any>({});
  const [passwordError, setPasswordError] = useState<any>({});
  const [officeIdError, setOfficeIdError] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);
  const [registrationError, setRegistrationError] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const register = useMutation((data: any) => {
    return api(Method.POST, registerMutation, data) as AxiosPromise<any>;
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    data.append("office_id", officeID);
    const isIdError = isInputNumber(
      "ID Number",
      data.get("company_id_number"),
      8
    );
    const isfirstNameError = isInputEmpty("First Name", data.get("first_name"));
    const islastNameError = isInputEmpty("Last Name", data.get("last_name"));
    const isemailError = isInputEmail(data.get("email"));
    const ispasswordError = isInputPassword(data.get("password"));
    const isofficeIdError = isInputEmpty("Office", data.get("office_id"));

    if (
      isAllTrue([
        !isIdError.error,
        !isfirstNameError.error,
        !islastNameError.error,
        !isemailError.error,
        !ispasswordError.error,
        !isofficeIdError.error,
      ])
    ) {
      register.mutateAsync(data, {
        onSuccess: () => {
          console.log("employee: " + JSON.stringify(data));
          setIsAlertOpen(true);
        },
        onError: () => {
          setRegistrationError(true);
        },
      });
    } else {
      setIdError(isIdError);
      setFirstNameError(isfirstNameError);
      setLastNameError(islastNameError);
      setOfficeIdError(isofficeIdError);
      setEmailError(isemailError);
      setPasswordError(ispasswordError);
    }
  };

  const handleOfficeChange = (event: SelectChangeEvent) => {
    setOfficeID(event.target.value as string);
  };

  const onCloseSuccessAlert = () => {
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
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            {registrationError ? (
              <Grid item xs={12}>
                <Alert severity="error">
                  An error was encoutered while registering. Please try again.
                </Alert>
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
                name="company_id_number"
                error={idError.error}
                helperText={idError.message}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="first_name"
                required
                fullWidth
                id="first-name"
                label="First Name"
                error={firstNameError.error}
                helperText={firstNameError.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="last-name"
                label="Last Name"
                name="last_name"
                autoComplete="family-name"
                error={lastNameError.error}
                helperText={lastNameError.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                error={emailError.error}
                helperText={emailError.message}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={officeIdError.error}>
                <InputLabel required id="office-id" color="success">
                  Office
                </InputLabel>
                <Select
                  labelId="office-id-select-label"
                  id="office-id-select"
                  value={officeID}
                  label="Office"
                  onChange={handleOfficeChange}
                  required
                >
                  <MenuItem value={1}>ITMS</MenuItem>
                  <MenuItem value={2}>GSU</MenuItem>
                  <MenuItem value={3}>Thirty</MenuItem>
                </Select>
                {officeIdError.error ? (
                  <FormHelperText>{officeIdError.message}</FormHelperText>
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
                error={passwordError.error}
                helperText={passwordError.message}
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
