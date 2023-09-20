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
import { api, Method } from "@utils/queryUtils";
import { loginMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import { useMutation } from "react-query";
import Cookies from "js-cookie";
import Router from "next/router";
import AppLogo from "@assets/images/pwms-logo-alt-3.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { LoginFormProps } from "@helpers/interface";

const validationSchema = Yup.object().shape({
  company_id_number: Yup.string()
    .required("You forgot to give your id number.")
    .matches(
      /^[0-9]+$/,
      "Your id number should not contain any letter or symbol"
    )
    .min(8, "Id number should be 8 digits")
    .max(8, "Id number can't exceed 8 digits"),
  password: Yup.string()
    .required("Your password is empty.")
    .min(6, "Password should at atleast contain 6 characters."),
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

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormProps>({
    resolver: yupResolver(validationSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<any>(false);

  const login = useMutation((data: any) => {
    return api(Method.POST, loginMutation, data) as AxiosPromise<any>;
  });

  const onSubmit = async (data: LoginFormProps) => {
    await login.mutate(data, {
      onSuccess: (result: any) => {
        // console.log("result: " + JSON.stringify(result));
        if (result.status === "Error") {
          setLoginError(result.message);
        } else {
          Cookies.set("token", result?.data.data.token);
          Cookies.set("user_id", result?.data.data.user_id);
          Cookies.set("user_name", result?.data.data.user_name);
          Cookies.set("office_id", result?.data.data.office_id);
          Cookies.set("office_head", result?.data.data.office_head);
          Cookies.set("office_name", result?.data.data.office_name);
          Router.push("/app/home");
        }
      },
    });
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
        <Avatar
          sx={{ height: 100, width: 100 }}
          variant={"square"}
          alt="PWMS Logo"
          src={AppLogo.src}
        ></Avatar>
        <Typography component="h1" variant="h5" pt={3}>
          Log in
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          {loginError ? <Alert severity="error">{loginError}</Alert> : ""}
          <TextField
            margin="normal"
            required
            fullWidth
            id="company-id-number"
            label="User ID"
            autoComplete="company_id_number"
            autoFocus
            {...register("company_id_number")}
            error={errors.company_id_number !== undefined}
            helperText={errors.company_id_number?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="password"
            {...register("password")}
            error={errors.password !== undefined}
            helperText={errors.password?.message}
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
          {/* <Grid container>
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
          </Grid> */}
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}
