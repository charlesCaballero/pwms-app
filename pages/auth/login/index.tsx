import { Container } from "@mui/material";
import Login from "@modules/auth/Login";

export default function LoginAuth() {
  return (
    <Container maxWidth={"sm"}>
      <Login />
    </Container>
  );
}
