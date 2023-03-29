import { LoadingProp } from "@helpers/interface";
import { Backdrop, CircularProgress } from "@mui/material";

export default function Loading(props: LoadingProp) {
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
