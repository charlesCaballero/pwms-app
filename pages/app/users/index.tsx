import Box from "@mui/material/Box";
import Users from "@modules/users/Users";
import Router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { routeGuard } from "@utils/authUtils";
import SkeletonLoading from "@components/Loader/SkeletonLoading";

export default function UserPage() {
  const route = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const authRoute = routeGuard(route.pathname);

  (async () => {
    const res = await authRoute;
    // console.log("res: " + res);
    if (res !== undefined) {
      res ? setIsAllowed(res) : Router.replace("/app/home");
    }
  })();

  return (
    <Box sx={{ width: "100%" }}>
      {isAllowed ? <Users /> : <SkeletonLoading />}
    </Box>
  );
}
