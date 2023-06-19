import Box from "@mui/material/Box";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { routeGuard } from "@utils/authUtils";
import SkeletonLoading from "@components/Loader/SkeletonLoading";
import PendingRequests from "@modules/pending-requests/PendingRequests";

export default function OfficePage() {
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
      {isAllowed ? <PendingRequests /> : <SkeletonLoading />}
    </Box>
  );
}
