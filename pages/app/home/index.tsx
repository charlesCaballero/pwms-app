import { Box } from "@mui/material";
import Dashboard from "@modules/home/Dashboard";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { routeGuard } from "@utils/authUtils";
import SkeletonLoading from "@components/Loader/SkeletonLoading";

export default function HomePage() {
  const route = useRouter();
  const [isAllowed, setIsAllowed] = useState<boolean>(false);
  const authRoute = routeGuard(route.pathname);
  (async () => {
    const res = await authRoute;
    // console.log("res: " + res);
    if (res !== undefined) {
      res ? setIsAllowed(res) : Router.back();
    }
  })();

  return (
    <Box sx={{ width: "100%" }}>
      {isAllowed ? <Dashboard /> : <SkeletonLoading />}
    </Box>
  );
}
