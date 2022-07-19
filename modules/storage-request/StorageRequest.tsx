import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { boolean, string } from "yup/lib/locale";
import { Box, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import AddStorageDialog from "@components/Dialogs/AddStorageDialog";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number
) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

type ColumnType = string | number | boolean;

interface TableHeader {
  label: string;
  type: ColumnType;
}

const thead: TableHeader[] = [
  {
    label: "Box Code",
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

export default function StorageRequest() {
  const [openAddBox, setOpenAddBox] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  return (
    <Box>
      <Box display={"flex"} flexDirection="row-reverse">
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
        onClose={() => setOpenAddBox(!openAddBox)}
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
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
