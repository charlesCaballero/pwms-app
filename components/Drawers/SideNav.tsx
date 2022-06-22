import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import LanIcon from "@mui/icons-material/Lan";
import MailIcon from "@mui/icons-material/Mail";
import AppLogo from "@assets/images/pwms-logo-alt-2.png";
import AppText from "@assets/images/pwms-logo-text.png";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { grey } from "@mui/material/colors";
import { api, Method } from "@utils/queryUtils";
import { SideNavProps } from "@helpers/interface";
import Loading from "../Loader/Loading";
import { userModulesQuery } from "@helpers/api-queries";

export default function SideNav(props: SideNavProps) {
  const { drawerWidth, userModules } = props;
  const router = useRouter();
  const pathName = router.pathname;
  const [modules, setModules] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);

  Router.events.on("routeChangeStart", () => setLoading(true));
  Router.events.on("routeChangeComplete", () => setLoading(false));
  Router.events.on("routeChangeError", () => setLoading(false));

  const queryModules = useQuery(
    "modulesArr",
    () => {
      return userModules
        ? (api(
            Method.GET,
            `${userModulesQuery}`,
            `?modules=${userModules}`
          ) as any)
        : null;
    },
    { refetchOnWindowFocus: false }
  );

  const handleRoute = (ref) => {
    Router.push(ref);
    setLoading(true);
  };

  useEffect(() => {
    if (userModules) queryModules.refetch();
    queryModules.data ? setModules(queryModules?.data) : null;
  }, [queryModules.data, userModules]);

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
        bgcolor: "transparent !important",
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Box
          display={"flex"}
          p={1}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Image src={AppLogo} alt="PWMS logo" width={45} height={45} />
          <Image src={AppText} alt="PWMS text" />
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {modules?.map((module) => (
          <ListItem key={module.id}>
            <ListItemButton
              sx={{
                borderRadius: "8px",
                ":hover": { backgroundColor: grey[300] },
                backgroundColor:
                  module.reference === pathName ? grey[300] : "none",
              }}
              onClick={() => handleRoute(module.reference)}
            >
              <ListItemIcon
                sx={{
                  color:
                    module.reference === pathName ? "primary.main" : "inherit",
                }}
              >
                {module.icon === "office" ? <LanIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    color={
                      module.reference === pathName ? "primary.main" : "inherit"
                    }
                    fontWeight="bold"
                  >
                    {module.name}
                  </Typography>
                }
                sx={{ marginLeft: "-15px" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Loading isOpen={loading} />
    </Drawer>
  );
}
