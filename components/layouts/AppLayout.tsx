import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import NavigationDrawer from "@components/Drawers/NavigationDrawer";
import Cookies from "js-cookie";
import { api, Method } from "@utils/queryUtils";
import { useMutation, useQuery } from "react-query";
import { useEffect, useState } from "react";
import app from "@helpers/app-version.json";
import { userDetailsQuery } from "@helpers/api-queries";
import Apartment from "@mui/icons-material/Apartment";
import Edit from "@mui/icons-material/EditRounded";
import Email from "@mui/icons-material/EmailRounded";
import HealthAndSafety from "@mui/icons-material/HealthAndSafetyRounded";
import Logout from "@mui/icons-material/LogoutRounded";
import PhotoCamera from "@mui/icons-material/PhotoCameraRounded";
import WorkRounded from "@mui/icons-material/WorkRounded";
import { logoutMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import Router from "next/router";
import ChangeProfilePhoto from "@components/Dialogs/ChangePhotoDialog";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import Badge from "@mui/material/Badge";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import { PopoverProps } from "@helpers/interface";

const drawerWidth = 250;

export default function AppLayout({ children }) {
  const [userData, setUserData] = useState<any>({});
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const userID = Cookies.get("user_id");
  const queryUserDetails = useQuery(
    "userDetails",
    async () => (await api(Method.GET, `${userDetailsQuery}/${userID}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const logoutUser = useMutation(() => {
    return api(Method.POST, `${logoutMutation}`) as AxiosPromise<any>;
  });

  useEffect(() => {
    queryUserDetails.data ? setUserData(queryUserDetails?.data[0]) : null;
  }, [queryUserDetails.isFetched, queryUserDetails.data]);

  const handlePopOverClose = () => {
    setAnchorEl(null);
  };

  const handleChangePhoto = () => {
    queryUserDetails.refetch();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    logoutUser.mutateAsync(null, {
      onSuccess: (result) => {
        if (result) {
          Router.push("/");
          setAnchorEl(null);
        }
      },
      onError: (error) => {
        console.log("Error: " + error);
      },
    });
  };

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
              {userData.first_name !== undefined ? (
                <Avatar
                  onClick={(event: any) => handleClick(event)}
                  sx={{ bgcolor: "#111827", fontWeight: "bold", boxShadow: 5 }}
                  src={userData.photo}
                >
                  {`${userData.first_name}`?.charAt(0) +
                    `${userData.last_name}
                  `?.charAt(0)}
                </Avatar>
              ) : (
                <Avatar sx={{ bgcolor: "#111827", fontWeight: "bold" }} />
              )}
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
      <ProfilePopOver
        anchorEl={anchorEl}
        id={"profile-popover"}
        onClose={() => handlePopOverClose()}
        user={userData}
        handleLogout={() => handleLogout()}
        onPhotoUpdate={() => handleChangePhoto()}
      />
      <NavigationDrawer
        drawerWidth={drawerWidth}
        userModules={userData.modules}
      />
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
          zIndex: 99,
          bgcolor: "primary.main",
        }}
      >
        <Copyright />
      </Box>
    </Box>
  );
}

const Copyright = (props: any) => {
  return (
    <Box display={"flex"} flexDirection={"row"}>
      <Typography
        variant="body2"
        color="white"
        align="right"
        flexGrow={1}
        {...props}
      >
        {"Copyright © PhilHealth "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
      <Typography pl={2} variant="body2" color="white" align="right" {...props}>
        version {app.version}
      </Typography>
    </Box>
  );
};

interface PropfilePropoverProps extends PopoverProps {
  user: any;
  handleLogout(): void;
  onPhotoUpdate(): void;
}

const ProfilePopOver = (props: PropfilePropoverProps) => {
  const { user, onClose, anchorEl, id, handleLogout, onPhotoUpdate } = props;
  const [isChangePhotoDialogOpen, setIsChangePhotoDialogOpen] =
    useState<boolean>(false);
  const open = Boolean(anchorEl);

  const handleChangePhotoDialogClose = (isChanged: boolean) => {
    isChanged && onPhotoUpdate();
    setIsChangePhotoDialogOpen(false);
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        alignItems={"center"}
        width={350}
        p={2}
      >
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <IconButton
              size="small"
              color="primary"
              sx={{
                bgcolor: "whitesmoke",
                ":hover": { bgcolor: "whitesmoke" },
              }}
              onClick={() => setIsChangePhotoDialogOpen(true)}
            >
              <PhotoCamera />
            </IconButton>
          }
        >
          <Avatar
            alt={user.first_name + " " + user.last_name}
            sx={{
              width: 130,
              height: 130,
              fontSize: 70,
              bgcolor: "#111827",
              fontWeight: "bold",
            }}
            src={user.photo}
          >
            {`${user.first_name}`?.charAt(0) + `${user.last_name}`?.charAt(0)}
          </Avatar>
        </Badge>
        <Box p={1} textAlign={"center"}>
          <Typography variant={"h6"} fontWeight={"bold"}>
            {`${user.first_name}` + ` ` + `${user.last_name}`}
          </Typography>
          <Typography
            variant={"body1"}
          >{`${user.company_id_number}`}</Typography>
        </Box>
        <Box width={"100%"}>
          <List dense>
            <ListItem>
              <ListItemIcon>
                <Email />
              </ListItemIcon>
              <ListItemText primary={user.email} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Apartment />
              </ListItemIcon>
              <ListItemText primary={user.office?.name} />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <WorkRounded />
              </ListItemIcon>
              <ListItemText primary={user.role?.name} />
            </ListItem>
          </List>
        </Box>
        <Box display={"flex"} py={1}>
          <Box flexGrow={1} pr={1}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              sx={{
                textTransform: "none",
                borderWidth: 2,
                ":hover": { borderWidth: 2 },
              }}
              startIcon={<Edit />}
            >
              Update Profile
            </Button>
          </Box>
          <Box flexGrow={1} pl={1}>
            <Button
              fullWidth
              size="small"
              variant="outlined"
              color="warning"
              sx={{
                textTransform: "none",
                borderWidth: 2,
                ":hover": { borderWidth: 2 },
              }}
              startIcon={<HealthAndSafety />}
            >
              Update Password
            </Button>
          </Box>
        </Box>
        <Box p={1} width={"100%"}>
          <Button
            fullWidth
            size="small"
            variant="contained"
            color="info"
            endIcon={<Logout />}
            onClick={() => handleLogout()}
          >
            Logout
          </Button>
        </Box>
      </Box>
      <ChangeProfilePhoto
        isOpen={isChangePhotoDialogOpen}
        onClose={(isChanged: boolean) =>
          handleChangePhotoDialogClose(isChanged)
        }
        userInitials={user.first_name?.charAt(0) + user.last_name?.charAt(0)}
        photoRef={user.photo}
      />
    </Popover>
  );
};
