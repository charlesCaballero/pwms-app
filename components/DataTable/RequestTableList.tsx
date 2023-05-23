import { TableHeader } from "@helpers/interface";
import { Edit, Delete } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip } from "@mui/material";

type CellAlignment = "right" | "left" | "inherit" | "center" | "justify";

interface TableListProps {
    thead: TableHeader[];
    rows: any[];
    onDeleteItem(id:number): void;
    onEditItem(id:number): void;
    alignCell?: CellAlignment;
}

export default function RequestTableList (props:TableListProps) {
    const {thead, rows, onDeleteItem, onEditItem, alignCell="left"} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                {thead.map((header, index) => {
                    return (
                    <TableCell
                        key={index}
                        sx={{ fontWeight: "bold", textAlign: alignCell }}
                    >
                        {header.label}
                    </TableCell>
                    );
                })}
                <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row,index)=>{ 
                    return (
                        <TableRow key={"row-"+index}>
                            {
                                thead.map((head,idx)=>{
                                    return (
                                        <TableCell align={alignCell} component={idx===0?"th":"td"} key={'cell-'+idx}>
                                            {row[head.name]}
                                        </TableCell>
                                    )
                                })
                            }
                            <TableCell
                                align="right"
                                sx={{ verticalAlign: "top" }}
                            >
                                <Tooltip title="Edit">
                                <IconButton
                                    color="info"
                                    onClick={() => {
                                        onEditItem(index)
                                    }}
                                >
                                    <Edit />
                                </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                <IconButton 
                                    color="error"
                                    onClick={() => {
                                        onDeleteItem(row.inventory_id)
                                    }}
                                    >
                                    <Delete />
                                </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    )}
                )}
            </TableBody>
            </Table>
        </TableContainer>
    )
}