import Loading from "@components/Loader/Loading";
<<<<<<< HEAD
import Container from "@mui/material/Container";
=======
import { Container } from "@mui/material";
>>>>>>> 7d72df272bd091455348f46a566f25d3ed838983
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Login = dynamic(() => import("@modules/auth/Login"), {
  suspense: true,
});

export default function LoginAuth() {
  return (
    <Container maxWidth={"sm"}>
      <Suspense fallback={<Loading isOpen />}>
        <Login />
      </Suspense>
    </Container>
  );
}
