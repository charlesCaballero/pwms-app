import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonLoading() {
  return (
    <Box sx={{ width: "100%" }}>
      <Skeleton width={"30%"} height={100} />
      <Skeleton />
      <Skeleton variant="rectangular" width={"100%"} height={350} />
    </Box>
  );
}
