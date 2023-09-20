import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import LoadingButton from '@mui/lab/LoadingButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Skeleton from '@mui/material/Skeleton';
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
// import dataFetch from "../hooks/dataFetch";
import { DialogProps } from '@helpers/interface';
import { useQuery } from 'react-query';
import { Method, api } from '@utils/queryUtils';
import { searchInventoryQuery } from '@helpers/api-queries';
import Cookie from "js-cookie";

const officeID = Cookie.get("office_id");

function SkeletonLoading(props) {
  const { skelyLoad = false } = props;

  return (
    <div>
        <ListItem >
            <ListItemIcon >
            <Skeleton
                variant="rectangular"
                sx={{m:2}}
                width={25}
                height={25}
                />
            </ListItemIcon>
            <ListItemText
            primary={
                <Typography
                    component="span"
                    variant="h5"
                >
                    <Skeleton />
                </Typography>
            }
            secondary={
                <React.Fragment>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                >
                    <Skeleton />
                </Typography>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                >
                    <Skeleton />
                </Typography>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                >
                    <Skeleton />
                </Typography>
                <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                >
                    <Skeleton />
                </Typography>
                </React.Fragment>
            }
            />
        </ListItem>
        <Divider variant="inset" component="li"/>
    </div>
  );
}

SkeletonLoading.propTypes = {
    skelyLoad: PropTypes.bool,
  };

interface SearchDocProps extends DialogProps {
    onAddItem: any;
    onList: number[];
}

export default function SearchRecordDialog(props: SearchDocProps) {
  const { isOpen, onClose, onAddItem, onList } = props;
  const [checked, setChecked] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [keyword, setKeyword] = React.useState('');

  const searchBox = useQuery(
    "search-results",
    async () => (await api(Method.GET, `${searchInventoryQuery}/${officeID}/${keyword}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const handleSearch = () => {
    // console.log("keyword: "+keyword);
    searchBox.refetch();

  }

  const handleAddItem = () => {
    
    onAddItem(selected);
    setChecked([]);
    setSelected([]);
  }


  const handleToggle = (value) => () => {
    if(checked.includes(value.id)){
        setChecked(checked.filter(a => a !== value.id));
        setSelected(selected.filter(a => a.id !== value.id))
    }
    else {
        setChecked([...checked, value.id]);
        setSelected([...selected, value]);
    }
  };


  return (
    <Dialog
    fullWidth
    maxWidth={"md"}
    open={isOpen}
    onClose={onClose}
    >
    <DialogTitle>Search record to withdraw</DialogTitle>
    <DialogContent>
        <DialogContentText>
            You can search any keyword to find the record you want to withdraw.
        </DialogContentText>
        <Box sx={{display: 'flex', p:1}}>
            <TextField autoFocus sx={{flexGrow: 1, m:1}} id="outlined-basic" onChange={(event) => {setKeyword(event.target.value)}} label="Search records" placeholder="e.g. Box code, Series title and description" variant="outlined" />
            <LoadingButton
                sx={{m:1}}
                color="secondary"
                loading={searchBox.isFetching}
                loadingPosition="start"
                startIcon={<SearchIcon />}
                variant="contained"
                onClick={handleSearch}
            >
                Search
            </LoadingButton>
        </Box>
        
        <Typography sx={{px:2}} variant="caption" display="block" gutterBottom>
        <strong>{searchBox.data?.length>0?searchBox.data?.length:'No'}</strong> record{searchBox.data?.length>1?'s':''} matches with the search keyword...
        </Typography>
       
        <Collapse in={searchBox.isFetching} >
        <List key={"list-loading-skeletons"}>
            <SkeletonLoading skelyLoad />
        </List>
        </Collapse>
        
        <Collapse in={!searchBox.isFetching}>
        <List sx={{width: '100%', bgcolor: 'background.paper' }}>
            {searchBox.data?.map((value,index) => {
                const labelId = `search-list-label-${index}`;
                
                return (
                <div>
                <ListItem key={`list-${index}`}>
                    <ListItemButton disabled={onList.includes(value.id)} role={undefined} onClick={handleToggle(value)} dense>
                    <ListItemIcon >
                        <Checkbox
                        edge="start"
                        checked={checked.indexOf(value.id)>-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': labelId }}
                        />
                    </ListItemIcon>
                    <ListItemText
                    id={labelId}
                    primary={
                        <Typography
                            component="span"
                            variant="subtitle2"
                            color="text.primary"
                        >
                            {value.box_code}
                        </Typography>
                    }
                    secondary={
                        <React.Fragment>
                        
                        {
                            JSON.parse(value.box_details).map((details, count)=>{
                                return (
                                    <React.Fragment key={"document-"+count}>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                            key={"document-"+count}
                                        >
                                            Document {count+1}: 
                                        </Typography>
                                        {" "+details.document_title+" ,"+details.document_date}
                                        <br></br>
                                        
                                    </React.Fragment>
                                )
                            })
                        }
                        
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            Remarks: 
                        </Typography>
                        {"  "+value.remarks!==null&&value.remarks}
                        <br></br>
                        <Typography
                            sx={{ display: 'inline' }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                        >
                            Disposal Date: 
                        </Typography>
                        {" "+value.disposal_date}
                        </React.Fragment>
                    }
                    />
                    </ListItemButton>
                </ListItem>
                <Divider variant="inset" component="li" key={`list-divider-${index}`}/>
                </div>
                );
            })}
        </List>
        </Collapse>
    </DialogContent>
    <DialogActions sx={{p:2}}>
        <Button onClick={()=>onClose()} color="inherit">Cancel</Button>
        <Button onClick={handleAddItem} variant="contained" color="secondary" disabled={checked.length===0}>Add to List</Button>
    </DialogActions>
    </Dialog>
  );
}
