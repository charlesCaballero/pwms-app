import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import app from "@helpers/app-version.json";
import { isAllTrue, isInputNumber, isInputPassword } from "helpers/validate";
import { api, Method } from "@utils/queryUtils";
import { loginMutation } from "helpers/api/mutations";
import { AxiosPromise } from "axios";
import { useMutation } from "react-query";
import Cookies from "js-cookie";
import Router from "next/router";
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

export default function Login() {

  const [showPassword, setShowPassword] = useState(false);
  const [idError, setIdError] = useState<any>({});
  const [passwordError, setPasswordError] = useState<any>({});
  const [loginError, setLoginError] = useState<any>(false);

  const login = useMutation((data: any) => {
    return api(Method.POST, loginMutation, data) as AxiosPromise<any>;
  });

  const handleLogin = async (data: any) => {
    await login.mutate(data, {
      onSuccess: (result: any) => {
        console.log("asdasdasd: " + JSON.stringify(result));
        if (result.status === "Error") {
          setLoginError(result.message);
        } else {
          Cookies.set("token", result?.data.data.token);
          Cookies.set("user_id", result?.data.data.user_id);
          Router.push("/app/home");
        }
      },
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    

    const isIdError = isInputNumber(
      "ID Number",
      data.get("company_id_number"),
      8
    );
    const ispasswordError = isInputPassword(data.get("password"));

    if (isAllTrue([!isIdError.error, !ispasswordError.error])) {
      handleLogin(data);
    }
    setIdError(isIdError);
    setPasswordError(ispasswordError);
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ height: 100, width:100 }} variant={'square'}
        alt="PWMS Logo"
        src={AppLogo.src}>
        </Avatar>
        <Typography component="h1" variant="h5" pt={3}>
          Log in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {loginError ? <Alert severity="error">{loginError}</Alert> : ""}
          <TextField
            margin="normal"
            required
            fullWidth
            id="company-id-number"
            label="User ID"
            name="company_id_number"
            autoComplete="company_id_number"
            autoFocus
            error={idError.error}
            helperText={idError.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="current-password"
            error={passwordError.error}
            helperText={passwordError.message}
          />
          <FormControlLabel
            control={
              <Checkbox
                value={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
            }
            label="Show password"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Log In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2" color={"info.main"}>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/auth/register" variant="body2" color={"info.main"}>
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
