import { userDetailsQuery } from "@helpers/api-queries";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import BadgeIcon from "@mui/icons-material/Badge";
import EmailIcon from "@mui/icons-material/Email";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WorkIcon from "@mui/icons-material/Work";

interface UserDetailsProps {
  userId: string | string[];
}

export default function UserDetails(props: UserDetailsProps) {
  const { userId } = props;
  const [userInfo, setUserInfo] = useState<any>({});
  const queryUserDetails = useQuery(
    "user-info",
    async () => (await api(Method.GET, `${userDetailsQuery}/${userId}`)) as any,
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    queryUserDetails.data ? setUserInfo(queryUserDetails?.data[0]) : null;
  }, [queryUserDetails.isFetched, queryUserDetails.data]);

  return (
    <Box>
      <Box display={"flex"} py={2} px={3} bgcolor={"grey.300"} borderRadius={2}>
        <Avatar src={userInfo?.photo} sx={{ width: 200, height: 200, mx: 2 }} />
        <Box
          flexGrow={1}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
          px={2}
        >
          <Typography variant="h4" pl={2}>
            {userInfo.first_name + " " + userInfo.last_name}
          </Typography>
          <List dense={true} sx={{ p: 0 }}>
            <ListItem>
              <ListItemIcon>
                <BadgeIcon />
              </ListItemIcon>
              <ListItemText primary={userInfo.company_id_number} />
            </ListItem>
          </List>
          <List dense={true} sx={{ p: 0 }}>
            <ListItem>
              <ListItemIcon>
                <EmailIcon />
              </ListItemIcon>
              <ListItemText primary={userInfo.email} />
            </ListItem>
          </List>
          <List dense={true} sx={{ p: 0 }}>
            <ListItem>
              <ListItemIcon>
                <ApartmentIcon />
              </ListItemIcon>
              <ListItemText primary={userInfo?.office?.name} />
            </ListItem>
          </List>
          <List dense={true} sx={{ p: 0 }}>
            <ListItem>
              <ListItemIcon>
                <WorkIcon />
              </ListItemIcon>
              <ListItemText primary={userInfo?.role?.name} />
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
}
