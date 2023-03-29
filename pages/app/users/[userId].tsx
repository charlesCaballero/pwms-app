import SkeletonLoading from "@components/Loader/SkeletonLoading";
import UserDetails from "@modules/users/UserDetails";
import { Box } from "@mui/material";
import { routeGuard } from "@utils/authUtils";
import Router, { useRouter } from "next/router";
import { useState } from "react";

export default function User() {
  const router = useRouter();
  const { userId } = router.query;
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const authRoute = routeGuard(router.pathname);

  (async () => {
    const res = await authRoute;
    // console.log("res: " + res);
    if (res !== undefined) {
      res ? setIsAllowed(res) : Router.replace("/app/home");
    }
  })();

  return (
    <Box>
      {isAllowed ? <UserDetails userId={userId} /> : <SkeletonLoading />}
    </Box>
  );
}
