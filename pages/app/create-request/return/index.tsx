import Box from "@mui/material/Box";
import Router, { useRouter } from "next/router";
import { routeGuard } from "@utils/authUtils";
import { useState } from "react";
import SkeletonLoading from "@components/Loader/SkeletonLoading";
import ReturnRequest from "@modules/return-request/ReturnRequest";

export default function ReturnRequestPage() {
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
      {isAllowed ? <ReturnRequest /> : <SkeletonLoading />}
    </Box>
  );
}
