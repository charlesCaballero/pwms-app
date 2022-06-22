import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SideNav from "@components/Drawers/SideNav";
import Cookies from "js-cookie";
import { api, Method } from "@utils/queryUtils";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import app from "@helpers/app-version.json";
import { userDetailsQuery } from "@helpers/api-queries";

const drawerWidth = 220;

function Copyright(props: any) {
  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Typography
        variant="body2"
        color="white"
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
        color="white"
        align="right"
        flexGrow={1}
        {...props}
      >
        version {app.version}
      </Typography>
    </Box>
  );
}

export default function AppLayout({ children }) {
  const [userData, setUserData] = useState<any>({});
  const userID = Cookies.get("user_id");
  const queryUserDetails = useQuery(
    "userDetails",
    async () => (await api(Method.GET, `${userDetailsQuery}/${userID}`)) as any,
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    queryUserDetails.data ? setUserData(queryUserDetails?.data[0]) : null;
  }, [queryUserDetails.isFetched]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#fafafa",
          boxShadow: 1,
        }}
      >
        <Toolbar sx={{ width: "100%" }}>
          <Box
            display={"flex"}
            flexDirection={"row-reverse"}
            alignItems={"center"}
            sx={{ width: "100%" }}
          >
            <Box mx={2}>
              <Avatar sx={{ bgcolor: "#111827", fontWeight: "bold" }}>
                {`${userData.first_name}`?.charAt(0) +
                  `${userData.last_name}`?.charAt(0)}
              </Avatar>
            </Box>
            <IconButton
              sx={{ color: "#111827" }}
              aria-label="delete"
              size="large"
            >
              <NotificationsRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <SideNav drawerWidth={drawerWidth} userModules={userData.modules} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar />
        <Box sx={{ width: "100%" }}>{children}</Box>
      </Box>
      <Box
        component={"footer"}
        sx={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          px: 1,
          py: 0.5,
          zIndex: 9999,
          bgcolor: "primary.main",
        }}
      >
        <Copyright />
      </Box>
    </Box>
  );
}
