import { userDetailsQuery } from "@helpers/api-queries";
import {
  Avatar,
  Badge,
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WorkIcon from "@mui/icons-material/Work";
import GppGoodIcon from "@mui/icons-material/GppGood";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import LockResetOutlinedIcon from "@mui/icons-material/LockResetOutlined";
import DeleteForeverRoundedIcon from "@mui/icons-material/DeleteForeverRounded";
// import RoomPreferencesRoundedIcon from "@mui/icons-material/RoomPreferencesRounded";
import UserPrevileges from "./UserPrevileges";
import UserRoles from "./UserRoles";
import ChangeStatusDialog from "@components/Dialogs/ChangeStatusDialog";
import { userDetailsMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import Router from "next/router";

interface UserDetailsProps {
  userId: string | string[];
}

export default function UserDetails(props: UserDetailsProps) {
  const { userId } = props;
  const [userInfo, setUserInfo] = useState<any>({});
  const [tabValue, setTabValue] = useState(0);
  const [openChangeStatus, setOpenChangeStatus] = useState(false);

  const queryUserDetails = useQuery(
    "user-info",
    async () => (await api(Method.GET, `${userDetailsQuery}/${userId}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const userDeleteMutation = useMutation(() => {
    return api(Method.DELETE, `${userDetailsMutation}/${userId}`) as AxiosPromise<any>;
  });

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDelete = async () => {
    await userDeleteMutation.mutate(null,{
      onSuccess: (result: any) => {
        if (result) {
          // console.log("result: " + JSON.stringify(result.data));
          if (result.code === 200) {
            Router.push('/app/users');
          }
          // Router.push("/");
          // setAnchorEl(null);
        }
      },
      onError: (error) => {
        console.log("Error: " + error);
      },
    });
  };

  // const handleChangeStatus = () => {};

  useEffect(() => {
    // console.log("userID 1: " + userId);
    queryUserDetails.data && setUserInfo(queryUserDetails?.data[0]);
  }, [queryUserDetails.isFetched, queryUserDetails.data]);

  useEffect(() => {
    userId && queryUserDetails.refetch();
  }, [userId, userInfo]);

  return (
    <Box>
      <Breadcrumbs aria-label="breadcrumb" sx={{ fontSize: "small", pb: 2 }}>
        <Link underline="hover" color="inherit" href="/app/users/">
          Users
        </Link>
        <Typography color="text.primary" fontSize={"small"}>
          User-Details
        </Typography>
      </Breadcrumbs>
      <Box display={"flex"}>
        <Box mr={1}>
          <Box
            py={2}
            px={3}
            bgcolor={"grey.200"}
            display={"flex"}
            borderRadius={2}
            flexDirection={"column"}
          >
            <Box mx={"auto"}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={
                  <Tooltip
                    title={
                      userInfo?.status ? "Access Allowed" : "Access Denied"
                    }
                  >
                    {userInfo?.status ? (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        sx={{
                          bgcolor: "success.main",
                          ":hover": { bgcolor: "success.dark" },
                          boxShadow: 3,
                        }}
                        onClick={() => setOpenChangeStatus(true)}
                      >
                        <CheckCircleOutlinedIcon
                          fontSize={"large"}
                          sx={{ color: "white" }}
                        />
                      </IconButton>
                    ) : (
                      <IconButton
                        aria-label="delete"
                        size="small"
                        sx={{
                          bgcolor: "error.main",
                          ":hover": { bgcolor: "error.dark" },
                          boxShadow: 3,
                        }}
                        onClick={() => setOpenChangeStatus(true)}
                      >
                        <BlockIcon fontSize={"large"} sx={{ color: "white" }} />
                      </IconButton>
                    )}
                  </Tooltip>
                }
              >
                <Avatar
                  src={userInfo?.photo}
                  sx={{ width: 200, height: 200 }}
                />
              </Badge>
            </Box>
            <Box
              flexGrow={1}
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"flex-end"}
              py={2}
            >
              <Typography variant="h4" pl={2}>
                {userInfo?.first_name + " " + userInfo?.last_name}
              </Typography>
              <List dense={true} sx={{ p: 0 }}>
                <ListItem>
                  <ListItemIcon>
                    <BadgeIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ ml: -1 }}
                    primary={userInfo?.company_id_number}
                  />
                </ListItem>
              </List>
              <List dense={true} sx={{ p: 0 }}>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText sx={{ ml: -1 }} primary={userInfo?.email} />
                </ListItem>
              </List>
              <List dense={true} sx={{ p: 0 }}>
                <ListItem>
                  <ListItemIcon>
                    <ApartmentIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ ml: -1 }}
                    primary={userInfo?.office?.name}
                  />
                </ListItem>
              </List>
              <List dense={true} sx={{ p: 0 }}>
                <ListItem>
                  <ListItemIcon>
                    <WorkIcon />
                  </ListItemIcon>
                  <ListItemText
                    sx={{ ml: -1 }}
                    primary={userInfo?.role?.name}
                  />
                </ListItem>
              </List>
            </Box>
            <Box mx={"auto"}>
              <Button
                color="warning"
                variant="outlined"
                sx={{
                  textTransform: "capitalize",
                  borderWidth: 2,
                  mr: 1,
                  ":hover": { borderWidth: 2 },
                }}
                startIcon={<LockResetOutlinedIcon />}
              >
                Reset Password
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={()=>handleDelete()}
                sx={{
                  textTransform: "capitalize",
                  borderWidth: 2,
                  ml: 1,
                  ":hover": { borderWidth: 2 },
                }}
                startIcon={<DeleteForeverRoundedIcon />}
              >
                Delete Account
              </Button>
            </Box>
          </Box>
        </Box>
        <Box flexGrow={1} bgcolor={"grey.200"} ml={1} borderRadius={2}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                icon={<HistoryEduIcon />}
                label="Activities"
                {...a11yProps(0)}
                sx={{ fontWeight: "bold", px: 5, fontSize: 12 }}
              />
              <Tab
                icon={<GppGoodIcon />}
                label="Previleges"
                {...a11yProps(1)}
                sx={{ fontWeight: "bold", px: 5, fontSize: 12 }}
              />
              <Tab
                icon={<WorkIcon />}
                label="Roles"
                {...a11yProps(2)}
                sx={{ fontWeight: "bold", px: 5, fontSize: 12 }}
              />
            </Tabs>
          </Box>
          <TabPanel value={tabValue} index={0}>
            Activities
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <UserPrevileges
              userId={userInfo?.company_id_number}
              modules={userInfo?.modules}
              update={() => queryUserDetails.refetch()}
            />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <UserRoles
              userId={userInfo?.company_id_number}
              userRole={userInfo?.role?.id}
              update={() => queryUserDetails.refetch()}
            />
          </TabPanel>
        </Box>
      </Box>
      <ChangeStatusDialog
        isOpen={openChangeStatus}
        onClose={(isSubmitted: boolean) => {
          isSubmitted && queryUserDetails.refetch();
          setOpenChangeStatus(!open);
        }}
        status={userInfo.status}
        user={userInfo.company_id_number}
      />
    </Box>
  );
}

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};
