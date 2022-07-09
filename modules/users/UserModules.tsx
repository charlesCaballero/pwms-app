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
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface UserPermissionProps {
  userId: string;
  modules: any;
}

export default function UserModules(props: UserPermissionProps) {
  const { userId, modules } = props;
  const [currentUserModules, setCurrentUserModules] = useState([]);

  const queryAllModules = useQuery(
    "allModules",
    () => {
      return api(Method.GET, `${userModulesQuery}`, `?modules=["*"]`) as any;
    },
    { refetchOnWindowFocus: false }
  );

  const handleChanges = (id, permit) => {
    let updateModules = currentUserModules;
    if (permit !== "deny") {
      console.log(id);

      if (!updateModules.includes(id)) {
        console.log("qwerty");
        updateModules.push(id);
      }
    } else {
      updateModules.splice(updateModules.indexOf(id), 1);
    }

    console.log("updateModules: " + updateModules);
    setCurrentUserModules([...updateModules]);
  };

  const revert = () => {
    let arrayMod = [];
    if (modules?.includes("*")) {
      queryAllModules?.data?.map((mod: any) => {
        if (!currentUserModules.includes(mod.id)) {
          arrayMod.push(mod.id);
        }
      });
      setCurrentUserModules(arrayMod);
    } else {
      if (modules) modules.replaceAll("[", "").replaceAll("]", "").split(",");
      else setCurrentUserModules([]);
    }
  };

  useEffect(() => {
    revert();
  }, [queryAllModules?.data, modules]);

  useEffect(() => {
    console.log("currentUserModules: " + currentUserModules);
  }, [currentUserModules]);

  return (
    <React.Fragment>
      <Box textAlign={"right"}>
        <Button
          variant="contained"
          size="small"
          color="info"
          sx={{ textTransform: "capitalize", mr: 2 }}
          startIcon={<HistoryRoundedIcon />}
          onClick={() => revert()}
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
                <TableCell sx={{ fontWeight: "bold" }}>Modules</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Allow</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Deny</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {queryAllModules?.data?.map((mod: any) => {
                return (
                  <TableRow key={mod.id}>
                    <TableCell>{mod.name}</TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={currentUserModules.includes(mod.id)}
                        onChange={() => handleChanges(mod.id, "allow")}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                        checked={!currentUserModules.includes(mod.id)}
                        onChange={() => handleChanges(mod.id, "deny")}
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
