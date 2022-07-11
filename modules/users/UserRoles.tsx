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
  role: string;
}

export default function UserRoles(props: UserPermissionProps) {
  const { userId, role } = props;
  const [userRole, setUserRole] = useState(role);

  return (
    <React.Fragment>
      <Box textAlign={"right"}>
        <Button
          variant="contained"
          size="small"
          color="info"
          sx={{ textTransform: "capitalize", mr: 2 }}
          startIcon={<HistoryRoundedIcon />}
          onClick={() => setUserRole(role)}
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
                <TableCell sx={{ fontWeight: "bold" }}>Roles</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* {userPermissionsArr?.map((type: string, index) => {
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
                  </TableRow>
                );
              })} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </React.Fragment>
  );
}
