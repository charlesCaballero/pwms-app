import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { Add, Delete, Edit, Print, Save } from "@mui/icons-material";
import AddStorageDialog from "@components/Dialogs/AddStorageDialog";
import BoxLabelDialog from "@components/Dialogs/BoxLabelDialog";
import ConfirmRequestDialog from "@components/Dialogs/ConfirmRequestDialog";
import { useMutation } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { AxiosPromise } from "axios";
import {
  inventoryMutation,
  storageRequestMutation,
} from "@helpers/api-mutations";

type ColumnType = string | number | boolean;

interface TableHeader {
  label: string;
  type: ColumnType;
}
type TableActions = "add" | "edit" | "delete";

const thead: TableHeader[] = [
  {
    label: "Box Code",
    type: "string",
  },
  {
    label: "RDS #",
    type: "string",
  },
  {
    label: "Document Title and Description",
    type: "string",
  },
  {
    label: "Document Date",
    type: "string",
  },
  {
    label: "Disposal Date",
    type: "string",
  },
];

interface InventoryProps {
  office_id: number;
  box_code: any;
  box_details: any;
  disposal_date: any;
  locationg: string;
  status: string;
}

export default function StorageRequest() {
  const [openAddBox, setOpenAddBox] = React.useState(false);
  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [boxes, setBoxes] = React.useState([]);
  const [action, setAction] = React.useState<TableActions>("add");
  const [editIndex, setEditIndex] = React.useState(0);
  const [printIndex, setPrintIndex] = React.useState(0);
  const [showLabel, setShowLabel] = React.useState(false);

  const inventory = useMutation((data: any) => {
    return api(Method.POST, `${inventoryMutation}`, data) as AxiosPromise<any>;
  });

  const storageRequest = useMutation(() => {
    return api(Method.POST, `${storageRequestMutation}`) as AxiosPromise<any>;
  });

  const handleSave = async (data: InventoryProps[]) => {
    await inventory.mutate(data, {
      onSuccess: (result) => {
        if (result) {
          console.log("result: " + JSON.stringify(result));

          // Router.push("/");
          // setAnchorEl(null);
        }
      },
      onError: (error) => {
        console.log("Error: " + error);
      },
    });
  };

  return (
    <Box>
      <Box display={"flex"} flexDirection="row-reverse">
        <Button
          variant="contained"
          color="secondary"
          endIcon={<Save />}
          sx={{ m: 1 }}
          onClick={() => {
            console.log("boxes: " + JSON.stringify(boxes));
            setOpenConfirm(true);
          }}
        >
          Save
        </Button>
        <Button
          variant="contained"
          endIcon={<Add />}
          sx={{ m: 1 }}
          onClick={() => setOpenAddBox(true)}
        >
          Add Box
        </Button>
      </Box>
      <AddStorageDialog
        isOpen={openAddBox}
        onClose={() => {
          setOpenAddBox(!openAddBox);
          setAction("add");
        }}
        getBoxData={(data) => {
          // console.log(JSON.stringify(data));
          if (action === "edit") {
            boxes[editIndex] = data;
          } else {
            let addedBox = boxes;
            addedBox.push(data);
            // console.log(JSON.stringify(addedBox));
            setBoxes([...addedBox]);
          }
          setOpenAddBox(!openAddBox);
        }}
        boxID={boxes.length}
        editBoxData={action === "edit" ? boxes[editIndex] : null}
      />
      <BoxLabelDialog
        isOpen={showLabel}
        onClose={() => {
          setShowLabel(false);
        }}
        boxData={boxes[printIndex]}
      />
      <ConfirmRequestDialog
        isOpen={openConfirm}
        onClose={(save) => (save ? handleSave(boxes) : setOpenConfirm(false))}
        request={"storage"}
        action={"save"}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {thead.map((header, index) => {
                return (
                  <TableCell
                    key={index}
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {header.label}
                  </TableCell>
                );
              })}
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {boxes.map((box, count) =>
              box.box_details.map((detail, cnt) => {
                return (
                  <TableRow
                    key={box.box_code + count + "-" + cnt}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {cnt < 1 && (
                      <TableCell
                        component="th"
                        scope="row"
                        rowSpan={box.box_details.length}
                        sx={{ verticalAlign: "top" }}
                      >
                        {box.box_code}
                      </TableCell>
                    )}
                    <TableCell
                      align="left"
                      sx={{
                        p: box.box_details.length > 1 ? 1 : 2,
                        whiteSpace: "pre-line",
                        verticalAlign: "top",
                        border: cnt != box.box_details.length - 1 && "none",
                      }}
                    >
                      {(box.box_details.length > 1 ? cnt + 1 + ". " : "") +
                        detail.rds_number}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        p: box.box_details.length > 1 ? 1 : 2,
                        whiteSpace: "pre-line",
                        verticalAlign: "top",
                        border: cnt != box.box_details.length - 1 && "none",
                      }}
                    >
                      {(box.box_details.length > 1 ? cnt + 1 + ". " : "") +
                        detail.document_title +
                        "\r\n" +
                        detail.description}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        p: box.box_details.length > 1 ? 1 : 2,
                        whiteSpace: "pre-line",
                        verticalAlign: "top",
                        border: cnt != box.box_details.length - 1 && "none",
                      }}
                    >
                      {(box.box_details.length > 1 ? cnt + 1 + ". " : "") +
                        detail.document_date}
                    </TableCell>
                    {cnt < 1 && (
                      <TableCell
                        align="right"
                        rowSpan={box.box_details.length}
                        sx={{ verticalAlign: "top" }}
                      >
                        {box.disposal_date}
                      </TableCell>
                    )}
                    {cnt < 1 && (
                      <TableCell
                        align="right"
                        rowSpan={box.box_details.length}
                        sx={{ verticalAlign: "top" }}
                      >
                        <Tooltip title="Print box label">
                          <IconButton
                            color="warning"
                            onClick={() => {
                              setPrintIndex(count);
                              setShowLabel(true);
                            }}
                          >
                            <Print />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="info"
                            onClick={() => {
                              setEditIndex(count);
                              setOpenAddBox(true);
                              setAction("edit");
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error">
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
