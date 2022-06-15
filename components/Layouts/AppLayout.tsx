import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  IconButton,
  Toolbar,
} from "@mui/material";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SideNav from "@components/Drawers/SideNav";

const drawerWidth = 240;

export default function AppLayout(props) {
  const { userData, children } = props;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#fafafa",
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
              <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
                {userData.first_name?.charAt(0) + userData.last_name?.charAt(0)}
                {/* GC */}
              </Avatar>
            </Box>
            <IconButton color="primary" aria-label="delete" size="large">
              <NotificationsRoundedIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <SideNav drawerWidth={drawerWidth} />
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
    </Box>
  );
}
