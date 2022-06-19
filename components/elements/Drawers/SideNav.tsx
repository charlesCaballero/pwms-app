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
import AppLogo from "@assets/images/web.png";
import AppText from "@assets/images/logo-text.png";
import Image from "next/image";
import Router, { useRouter } from "next/router";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { userModulesQuery } from "@helpers/api/queries";
import { grey } from "@mui/material/colors";
import { api, Method } from "@utils/queryUtils";

interface SideNavProps {
  drawerWidth: number;
  userModules: string;
}

export default function SideNav(props: SideNavProps) {
  const { drawerWidth, userModules } = props;
  const router = useRouter();
  const pathName = router.pathname;
  const [modules, setModules] = useState<any>([]);
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
          <Image src={AppLogo} alt="PWMS logo" width={60} height={60} />
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
              onClick={() => Router.push(module.reference)}
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
    </Drawer>
  );
}
