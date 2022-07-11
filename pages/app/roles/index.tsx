import Box from "@mui/material/Box";
import Roles from "@modules/roles/Roles";
import Router, { useRouter } from "next/router";
import { routeGuard } from "@utils/authUtils";
import { useState } from "react";
import SkeletonLoading from "@components/Loader/SkeletonLoading";

export default function RolesPage() {
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
      {isAllowed ? <Roles /> : <SkeletonLoading />}
    </Box>
  );
}
