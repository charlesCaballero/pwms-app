import { Box } from "@mui/material";
import { api, Method } from "helpers/api/helper";
import { userDetails } from "helpers/api/queries";
import { useQuery } from "react-query";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import Loading from "@components/Loading";
import AppLayout from "@components/Layouts/AppLayout";
import Dashboard from "./home/dashboard";

export default function HomePage() {
  const [userData, setUserData] = useState<any>({});
  const userID = Cookies.get("user_id");
  const queryUserDetails = useQuery(
    "userDetails",
    async () => (await api(Method.GET, `${userDetails}/${userID}`)) as any,
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    queryUserDetails.data ? setUserData(queryUserDetails?.data[0]) : null;
  }, [queryUserDetails.isFetched]);

  return (
    <Box sx={{ width: "100vw" }}>
      {userData === undefined ? (
        <Loading isOpen={userData === undefined} />
      ) : (
        <AppLayout userData={userData}>
          <Dashboard />
        </AppLayout>
      )}
    </Box>
  );
}
