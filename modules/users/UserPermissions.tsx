import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface UserPermissionProps {
  userId: string;
  permissions: string;
}

export default function UserPermissions(props: UserPermissionProps) {
  const { userId, permissions } = props;
  const [userPermissionsArr, setUserPermissionsArr] = useState(
    permissions?.split("")
  );
  const permissionLabels = [
    { code: "r", label: "View Data" },
    { code: "w", label: "Add Data" },
    { code: "u", label: "Edit Data" },
    { code: "d", label: "Delete Data" },
  ];

  const handlePermissionChange = (index, permit) => {
    let updatePermission = userPermissionsArr;
    if (permit !== "deny") {
      updatePermission[index] = permissionLabels[index].code;
    } else updatePermission[index] = "-";

    setUserPermissionsArr([...updatePermission]);
  };

  useEffect(() => {
    console.log("update: " + userPermissionsArr.toString().replaceAll(",", ""));
  }, [userPermissionsArr]);

  return (
    <React.Fragment>
      <Box textAlign={"right"}>
        <Button
          variant="contained"
          size="small"
          color="info"
          sx={{ textTransform: "capitalize", mr: 2 }}
          startIcon={<HistoryRoundedIcon />}
          onClick={() => setUserPermissionsArr(permissions?.split(""))}
        >
          Revert
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" }}
          startIcon={<SaveRoundedIcon />}
        >
          Save
        </Button>
      </Box>
      <Box mx={"-20px"} pt={1}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Permissions</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Allow</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Deny</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userPermissionsArr?.map((type: string, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{permissionLabels[index].label}</TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={type === permissionLabels[index].code}
                        onChange={() => handlePermissionChange(index, "allow")}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={type === "-"}
                        onChange={() => handlePermissionChange(index, "deny")}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
}
