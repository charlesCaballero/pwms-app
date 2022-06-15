import { Box, Button, Container, Typography } from "@mui/material";
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";
import DoNotTouchIcon from "@mui/icons-material/DoNotTouch";
import Router from "next/router";

export default function UnauthorizedEntry() {
  return (
    <Container maxWidth={"sm"}>
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        pt={10}
      >
        <DoNotTouchIcon color="warning" sx={{ fontSize: 300 }} />
        <Typography align="center" variant="h2" component={"h1"}>
          OOPS!
        </Typography>
        <Typography variant="h5" component={"h2"} align="center">
          Error 401: Unauthorized Request
        </Typography>
        <Button
          variant="contained"
          onClick={() => Router.push("/")}
          size={"small"}
          sx={{ maxWidth: 100, my: 2 }}
        >
          Log in
        </Button>
      </Box>
    </Container>
  );
}
