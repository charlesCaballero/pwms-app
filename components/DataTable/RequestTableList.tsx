import { TableHeader } from "@helpers/interface";
import { Edit, Delete } from "@mui/icons-material";
import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Tooltip, Box, Typography, List, ListItem } from "@mui/material";

type CellAlignment = "right" | "left" | "inherit" | "center" | "justify";

interface TableListProps {
    thead: TableHeader[];
    rows: any[];
    onDeleteItem?(id:number): void;
    onEditItem?(id:number): void;
    alignCell?: CellAlignment;
    disableButtons?:boolean;
}

const setNewCellData = (from,id)=> {
    return (
      <List sx={{pt:0}}>
        {
          JSON.parse(from).map((val,index)=>{
            const numbering = JSON.parse(from).length>1?(index+1)+". ":'';
            return (
              <ListItem sx={{pt:0}} key={"newCellData"+index}>
                {numbering.concat(val[id])}
              </ListItem>
            )
          })
        }
      </List>
    );
}

export default function RequestTableList (props:TableListProps) {
    const {thead, rows, onDeleteItem, onEditItem, alignCell="left",disableButtons=false} = props;
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="Requests table" >
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
                {
                    !disableButtons&&<TableCell></TableCell>
                }
                
                </TableRow>
            </TableHead>
            <TableBody>
                {rows.map((row,index)=>{ 
                    return (
                        <TableRow key={"row-"+index}>
                            {
                                thead.map((head,idx)=>{
                                    return (
                                        <TableCell align={alignCell} component={idx===0?"th":"td"} key={'cell-'+idx} style={{ verticalAlign: 'top' }} >
                                            {
                                            head.datatype==='json'?
                                            setNewCellData(row[head.from],[head.name]):
                                            row[head.name]
                                            }
                                            {
                                                (head.remarks && row[head.remarks]) && 
                                                (
                                                <Box sx={{px:2}}>
                                                <Typography sx={{fontWeight:'bold'}} variant="body2" component="h1">
                                                Remarks:
                                                </Typography>
                                                <Typography sx={{whiteSpace:'pre-wrap'}} variant="body2" component="p">
                                                {row[head.remarks]}
                                                </Typography>
                                                </Box>
                                                )
                                            }
                                        </TableCell>
                                    )
                                })
                            }
                            {!disableButtons&&
                            (
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
                            )}
                        </TableRow>
                    )}
                )}
            </TableBody>
            </Table>
        </TableContainer>
    )
}