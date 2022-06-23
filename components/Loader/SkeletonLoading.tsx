import * as React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function SkeletonLoading() {
  return (
    <Box sx={{ width: "100%", }}>
      <Skeleton animation="wave" height={60} />
      <Skeleton animation="wave" height={60} />
      <Skeleton animation="wave" height={400} />
    </Box>
  );
}
