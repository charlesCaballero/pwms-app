import { useState } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import app from "../../app-version.json";
import {
  isInputEmail,
  isInputEmpty,
  isInputNumber,
  isInputPassword,
} from "pages/helpers/validate";
import {
  Box,
  Grid,
  Link,
  Checkbox,
  TextField,
  CssBaseline,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  Button,
  Avatar,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
  Container,
  Typography,
} from "@mui/material";

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

const theme = createTheme();

export default function Register() {
  const [officeID, setOfficeID] = useState("");
  const [idError, setIdError] = useState<any>({});
  const [firstNameError, setFirstNameError] = useState<any>({});
  const [lastNameError, setLastNameError] = useState<any>({});
  const [emailError, setEmailError] = useState<any>({});
  const [passwordError, setPasswordError] = useState<any>({});
  const [officeIdError, setOfficeIdError] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setIdError(isInputNumber("ID Number", data.get("company_id_number"), 8));
    setFirstNameError(isInputEmpty("First Name", data.get("f_name")));
    setLastNameError(isInputEmpty("Last Name", data.get("l_name")));
    setOfficeIdError(isInputEmpty("Office ID", officeID));
    setEmailError(isInputEmail(data.get("email")));
    setPasswordError(isInputPassword(data.get("password")));

    console.log(
      JSON.stringify({
        email: data.get("email"),
        password: data.get("password"),
      })
    );
  };

  const handleOfficeChange = (event: SelectChangeEvent) => {
    setOfficeID(event.target.value as string);
  };

  return (
    <ThemeProvider theme={theme}>
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
          <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Register
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
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
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="f_name"
                  required
                  fullWidth
                  id="f-name"
                  label="First Name"
                  color="success"
                  error={firstNameError.error}
                  helperText={firstNameError.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="l-name"
                  label="Last Name"
                  name="l_name"
                  autoComplete="family-name"
                  color="success"
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
                  color="success"
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
                    color="success"
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
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
                  color="success"
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
                      color="success"
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
              color="success"
            >
              Register
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/auth/login" variant="body2">
                  Already have an account? Log in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
