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
import { rolesQuery } from "@helpers/api-queries";
import { useMutation, useQuery } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import { userDetailsMutation } from "@helpers/api-mutations";
import SnackbarAlert from "@components/SnackBar/SnackBarAlert";

interface UserPermissionProps {
  userId: string;
  userRole: string;
  update(): void;
}

export default function UserRoles(props: UserPermissionProps) {
  const { userId, userRole, update } = props;
  const [myRole, setMyRole] = useState(userRole);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const queryAllRoles = useQuery(
    "allRoles",
    () => {
      return api(Method.GET, `${rolesQuery}`, `?select=all`) as any;
    },
    { refetchOnWindowFocus: false }
  );

  const updateUser = useMutation((values: any) => {
    return api(
      Method.PUT,
      `${userDetailsMutation}/${userId}`,
      values
    ) as AxiosPromise<any>;
  });

  const handleSubmit = () => {
    const values = {
      role_id: myRole,
    };
    updateUser.mutateAsync(values, {
      onSuccess: (result) => {
        // console.log("result: " + JSON.stringify(result));
        if (result) {
          setAlertOpen(true);
          update();
        }
      },
      onError: () => {},
    });
  };

  return (
    <React.Fragment>
      <Box textAlign={"right"}>
        <Button
          variant="contained"
          size="small"
          color="info"
          sx={{ textTransform: "capitalize", mr: 2 }}
          startIcon={<HistoryRoundedIcon />}
          onClick={() => setMyRole(userRole)}
        >
          Revert
        </Button>
        <Button
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" }}
          startIcon={<SaveRoundedIcon />}
          onClick={() => handleSubmit()}
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
              {queryAllRoles?.data?.map((role: any, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>{role.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={role.id === myRole}
                        onChange={() => setMyRole(role.id)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <SnackbarAlert
        type="success"
        message="Successfully changed user role."
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </React.Fragment>
  );
}
