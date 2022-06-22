import { Container } from "@mui/material";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Login = dynamic(() => import("@modules/auth/Login"), {
  suspense: true,
});

export default function LoginAuth() {
  return (
    <Container maxWidth={"sm"}>
      <Suspense fallback={`Loading...`}>
        <Login />
      </Suspense>
    </Container>
  );
}
