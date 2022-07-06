import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import AppLogo from "@assets/images/pwms-logo-alt-2.png";
import AppText from "@assets/images/pwms-logo-text.png";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { api, Method } from "@utils/queryUtils";
import { SideNavProps } from "@helpers/interface";
import Loading from "../Loader/Loading";
import { userModulesQuery } from "@helpers/api-queries";
import { grey } from "@mui/material/colors";
import Icon from "@components/DynamicIcon/Icon";

export default function NavigationDrawer(props: SideNavProps) {
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
          <Box width={45}>
            <Image src={AppLogo} alt="PWMS logo" layout="responsive" />
          </Box>
          <Box width={80}>
            <Image src={AppText} alt="PWMS text" layout="responsive" />
          </Box>
        </Box>
      </Toolbar>
      <Divider />
      <List>
        {modules?.map((module) => (
          <ListItem key={module.id} sx={{ m: 0, py: 0.5, px: 1 }}>
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
                    module.reference === pathName
                      ? "primary.main"
                      : "info.main",
                }}
              >
                <Icon name={module.icon} size={20} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    color={
                      module.reference === pathName
                        ? "primary.main"
                        : "grey.600"
                    }
                    fontWeight="bold"
                    fontSize={"small"}
                  >
                    {module.name}
                  </Typography>
                }
                sx={{ marginLeft: "-20px" }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={{ height: 50 }}></ListItem>
      </List>
      <Loading isOpen={loading} />
    </Drawer>
  );
}
