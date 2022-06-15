import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading(props: any) {
  const { isOpen } = props;
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={isOpen}
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  );
}
