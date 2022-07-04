import * as Icons from "@mui/icons-material";
import React, { createElement } from "react";

type IconSizes = "small" | "inherit" | "medium" | "large" | number;
type IconColors =
  | "inherit"
  | "primary"
  | "secondary"
  | "error"
  | "warning"
  | "success"
  | "info";

interface IconProps {
  name: string;
  size?: IconSizes;
  color?: IconColors;
}
export default function Icon(props: IconProps) {
  const { name, size = "inherit", color = "info" } = props;
  return (
    <React.Fragment>
      {createElement(Icons[name], { sx: { fontSize: size, color: color } })}
    </React.Fragment>
  );
}
