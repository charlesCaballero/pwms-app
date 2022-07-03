import { userModulesQuery } from "@helpers/api-queries";
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
import { api, Method } from "@utils/queryUtils";
import React from "react";
import { useQuery } from "react-query";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface UserPermissionProps {
  userId: string;
  modules: string[];
}

export default function UserPermissions(props: UserPermissionProps) {
  const { userId, modules } = props;

  const queryAllModules = useQuery(
    "allModules",
    () => {
      return api(Method.GET, `${userModulesQuery}`, `?modules=["*"]`) as any;
    },
    { refetchOnWindowFocus: false }
  );

  return (
    <React.Fragment>
      <Box textAlign={"right"}>
        <Button
          variant="contained"
          size="small"
          color="info"
          sx={{ textTransform: "capitalize", mr: 2 }}
          startIcon={<HistoryRoundedIcon />}
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
        <TableContainer sx={{ maxHeight: "58vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Allow</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Deny</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queryAllModules?.data?.map((mod: any) => {
                return (
                  <TableRow>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={
                          modules.includes(mod.id) || modules.includes("*")
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={
                          !modules.includes(mod.id) && !modules.includes("*")
                        }
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
