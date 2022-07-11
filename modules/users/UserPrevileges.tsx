import { userModulesQuery } from "@helpers/api-queries";
import {
  Box,
  Button,
  Checkbox,
  Collapse,
  FormControlLabel,
  FormGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { api, Method } from "@utils/queryUtils";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import { userDetailsMutation } from "@helpers/api-mutations";
import { AxiosPromise } from "axios";
import SnackbarAlert from "@components/SnackBar/SnackBarAlert";
import LoadingButton from "@mui/lab/LoadingButton";

interface UserPermissionProps {
  userId: string;
  modules: any;
  update(): void;
}

export default function UserPrevileges(props: UserPermissionProps) {
  const { userId, modules, update } = props;
  const [currentUserModules, setCurrentUserModules] = useState<any>([]);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const queryAllModules = useQuery(
    "allModules",
    () => {
      return api(Method.GET, `${userModulesQuery}`, `?select=all`) as any;
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

  const revert = () => {
    let arrayMod = [];
    if (modules?.includes("*")) {
      queryAllModules?.data?.map((mod: any) => {
        if (!currentUserModules.includes(mod.id)) {
          arrayMod.push({ moduleId: mod.id, permissions: "rwud" });
        }
      });
      setCurrentUserModules(arrayMod);
    } else {
      if (modules) {
        setCurrentUserModules(JSON.parse(modules));
      } else setCurrentUserModules([]);
    }
  };

  const handleSubmit = () => {
    const values = {
      modules: currentUserModules,
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

  useEffect(() => {
    revert();
  }, [queryAllModules?.data, modules]);

  // useEffect(() => {
  //   // console.log("currentUserModules: " + JSON.stringify(currentUserModules));
  // }, [currentUserModules]);

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
        <LoadingButton
          loading={queryAllModules.isLoading}
          loadingPosition="start"
          startIcon={<SaveRoundedIcon />}
          variant="contained"
          size="small"
          sx={{ textTransform: "capitalize" }}
          onClick={() => handleSubmit()}
        >
          Save
        </LoadingButton>
      </Box>
      <Box mx={"-20px"} pt={1}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 340px)" }}>
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
                  <Row
                    key={"row-" + mod.id}
                    module={mod}
                    currentUserModules={currentUserModules}
                    setCurrentUserModules={(updates) =>
                      setCurrentUserModules(updates)
                    }
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <SnackbarAlert
        type="success"
        message="Successfully updated user previleges."
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
      />
    </React.Fragment>
  );
}

interface RowProps {
  module: any;
  currentUserModules: any;
  setCurrentUserModules(update: any): void;
}

const Row = (props: RowProps) => {
  const { module, currentUserModules, setCurrentUserModules } = props;
  const permissions = [
    { code: "r", label: "View Data" },
    { code: "w", label: "Add Data" },
    { code: "u", label: "Edit Data" },
    { code: "d", label: "Delete Data" },
  ];

  const handleChanges = (id, permit) => {
    let updateModules = currentUserModules;
    if (permit !== "deny") {
      if (!moduleExist(id, updateModules)) {
        // console.log("qwerty");
        updateModules.push({ moduleId: id, permissions: "rwud" });
      }
    } else {
      const idx = getIndex(updateModules, id);
      idx >= 0 && updateModules.splice(idx, 1);
    }

    // console.log("updateModules: " + JSON.stringify(updateModules));
    setCurrentUserModules([...updateModules]);
  };

  const handleChangePermission = (index, code) => {
    let updateModules = currentUserModules;
    let permissionArr =
      updateModules[getIndex(updateModules, module.id)].permissions.split("");

    if (permissionArr[index] === code) {
      permissionArr[index] = "-";
    } else {
      permissionArr[index] = code;
    }

    updateModules[getIndex(updateModules, module.id)].permissions =
      permissionArr.join("");

    setCurrentUserModules([...updateModules]);
  };

  const moduleExist = (id, arr) => {
    return arr?.some(function (el) {
      return el?.moduleId === id;
    });
  };

  const getIndex = (haystack, needle) => {
    return haystack.findIndex((item) => item.moduleId === needle);
  };

  return (
    <React.Fragment>
      <TableRow key={module.id}>
        <TableCell sx={{ borderBottom: "none" }}>
          <Typography variant="subtitle1">{module.name}</Typography>
        </TableCell>
        <TableCell sx={{ borderBottom: "none" }}>
          <Checkbox
            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            checked={moduleExist(module.id, currentUserModules)}
            onChange={() => handleChanges(module.id, "allow")}
          />
        </TableCell>
        <TableCell sx={{ borderBottom: "none" }}>
          <Checkbox
            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
            checked={!moduleExist(module.id, currentUserModules)}
            onChange={() => handleChanges(module.id, "deny")}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
          <Collapse
            in={moduleExist(module.id, currentUserModules)}
            timeout="auto"
            unmountOnExit
          >
            <Box pb={5}>
              <Box
                sx={{
                  margin: 1,
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  border: "1px dashed black",
                }}
              >
                <Typography variant="body2" px={4}>
                  Permissions:
                </Typography>
                <FormGroup
                  sx={{ flexGrow: 1, display: "flex", flexDirection: "row" }}
                >
                  {permissions.map((permission: any, index) => {
                    return (
                      <FormControlLabel
                        key={"permission-" + permission.code + index}
                        disabled={index === 0}
                        control={
                          <Checkbox
                            checked={
                              currentUserModules[
                                getIndex(currentUserModules, module.id)
                              ]?.permissions.charAt(index) === permission.code
                            }
                            onChange={() =>
                              handleChangePermission(index, permission.code)
                            }
                            size="small"
                            color="info"
                          />
                        }
                        label={permission.label}
                        sx={{ flexGrow: 1 }}
                      />
                    );
                  })}
                </FormGroup>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
