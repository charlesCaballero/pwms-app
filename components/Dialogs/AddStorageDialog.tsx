import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@helpers/interface";
import {
  Alert,
  Collapse,
  Divider,
  IconButton,
  Link,
  TextField,
} from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";
import { Delete } from "@mui/icons-material";
import { useQuery } from "react-query";
import { api, Method } from "@utils/queryUtils";
import { getRetentionsQuery } from "@helpers/api-queries";
import DocumentDate from "@components/Popper/DocumentDatePopper";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const filter = createFilterOptions();
interface DocumentDetails {
  id: number;
  document_title: string;
  description: string;
  rds_number: string;
  retention_period: string;
  document_date: string;
}
interface BoxDetails {
  uID: string;
  office_id: string;
  box_code: string;
  box_details: DocumentDetails[];
  disposal_date: string;
}

interface StorageDialogProps extends DialogProps {
  getBoxData(data: any): void;
}

export default function AddStorageDialog(props: StorageDialogProps) {
  const { isOpen, onClose, getBoxData } = props;
  const [addDetail, setAddDetail] = React.useState([false]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentYear, setCurrentYear] = React.useState(0);
  const [largestMonth, setLargestMonth] = React.useState(0);
  const [largestRetention, setLargestRetention] = React.useState(0);
  const [boxData, setBoxData] = React.useState<BoxDetails>({
    uID: "",
    office_id: "",
    box_code: "",
    box_details: [
      {
        id: 0,
        document_title: "",
        description: "",
        rds_number: "",
        retention_period: "",
        document_date: "",
      },
    ],
    disposal_date: "",
  });

  const retentions = useQuery(
    "document-retentions",
    async () => (await api(Method.GET, `${getRetentionsQuery}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const handleBoxData = () => {
    getBoxData(boxData);
  };

  const handleDocumentDateChange = (date, year, largest, index) => {
    console.log("year: " + year);
    if (parseInt(year) > 0 && !date.includes("undefined")) {
      boxData.box_details[index].document_date = date;
      setBoxData({
        ...boxData,
        box_details: boxData.box_details,
        disposal_date:
          months[largest] + " " + (parseInt(year) + largestRetention),
      });
      setCurrentYear(year);
      setLargestMonth(largest);
    }
  };

  const handleChangeValue = (selected, index) => {
    // console.log("selected: " + JSON.stringify(selected));
    // console.log("index: " + index);
    let newSelected = boxData.box_details;
    if (newSelected[index] !== undefined) {
      newSelected[index] = {
        id: index,
        document_title:
          selected.series_title_desciption + " (" + selected.dept_title + ")",
        description: "",
        rds_number: selected.rds_no + " #" + selected.rds_item_no,
        retention_period: selected.retention_period,
        document_date: "",
      };
    } else {
      newSelected.push({
        id: index,
        document_title:
          selected.series_title_desciption + " (" + selected.dept_title + ")",
        description: "",
        rds_number: selected.rds_no + " #" + selected.rds_item_no,
        retention_period: selected.retention_period,
        document_date: "",
      });
    }

    setBoxData({ ...boxData, box_details: [...newSelected] });
  };

  React.useEffect(() => {
    let retention_array = [];
    boxData.box_details.map((details) => {
      retention_array.push(parseInt(details.retention_period));
    });
    setLargestRetention(Math.max(...retention_array));
  }, [boxData]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={isOpen}
        onClose={() => onClose(false)}
      >
        <DialogTitle>Add Box</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText>
          <TextField
            autoFocus
            required
            fullWidth
            id="box_code"
            name="box_code"
            label="Box Code"
            type="text"
            value={boxData.box_code}
            onChange={(event) => {
              setBoxData({ ...boxData, box_code: event.target.value });
            }}
            variant="outlined"
          />
          <Box sx={{ p: 1, my: 1, border: "1px dashed gray", borderRadius: 2 }}>
            {boxData.box_details.map((row, idx) => {
              return (
                <React.Fragment key={idx}>
                  <Box display="flex" alignItems={"center"} sx={{ pt: 1 }}>
                    <Autocomplete
                      freeSolo
                      id={"retentions" + idx}
                      sx={{ flexGrow: 1, mr: 1 }}
                      options={retentions?.data}
                      groupBy={(option: any) => option.dept_unit}
                      getOptionLabel={(option: any) =>
                        option.series_title_description
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Document Title" />
                      )}
                      onChange={(_event, newTitle) =>
                        handleChangeValue(newTitle, idx)
                      }
                      filterOptions={(options, params) =>
                        getFilteredOptions(options, params)
                      }
                      renderOption={(props, option, { inputValue }) => {
                        const matches = match(
                          option.series_title_description,
                          inputValue
                        );
                        const parts = parse(
                          option.series_title_description,
                          matches
                        );

                        return (
                          <li {...props}>
                            <div>
                              {parts.map((part, index) => (
                                <span
                                  key={index}
                                  style={{
                                    fontWeight: part.highlight ? 700 : 400,
                                  }}
                                >
                                  {part.text}
                                </span>
                              ))}
                            </div>
                          </li>
                        );
                      }}
                    />
                    <TextField
                      sx={{ mr: 1, width: 120 }}
                      inputProps={{ readOnly: true }}
                      value={boxData.box_details[idx].rds_number}
                      id="rds_no"
                      name="rds_no"
                      label="RDS No."
                      disabled
                    />
                    <TextField
                      sx={{ width: 120, mr: 1 }}
                      inputProps={{ readOnly: true }}
                      value={
                        parseInt(boxData.box_details[idx].retention_period) > 1
                          ? boxData.box_details[idx].retention_period + " years"
                          : parseInt(
                              boxData.box_details[idx].retention_period
                            ) == 1
                          ? boxData.box_details[idx].retention_period + " year"
                          : ""
                      }
                      id="retention_period"
                      label="Retention"
                      disabled
                      // helperText="Read-only"
                    />
                    <DocumentDate
                      boxDetails={boxData.box_details[idx]}
                      idx={idx}
                      anchorEl={anchorEl}
                      setAnchorEl={(el) => setAnchorEl(el)}
                      saveDocumentDate={(document_date, year, largest, index) =>
                        handleDocumentDateChange(
                          document_date,
                          year,
                          largest,
                          index
                        )
                      }
                      currentYear={currentYear}
                      largestMonth={largestMonth}
                    />
                    <IconButton
                      aria-label="delete"
                      color="error"
                      disabled={boxData.box_details.length <= 1}
                      onClick={() => {
                        boxData.box_details.splice(idx, 1);

                        setBoxData({
                          ...boxData,
                          box_details: boxData.box_details,
                        });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                  <Link
                    component="button"
                    variant="body2"
                    underline="hover"
                    color={addDetail[idx] ? "red" : "green"}
                    onClick={() => {
                      if (addDetail[idx]) {
                        setAddDetail(updateArray(addDetail, idx, false));
                        boxData.box_details[idx].description = "";
                        setBoxData({
                          ...boxData,
                          box_details: boxData.box_details,
                        });
                      } else {
                        setAddDetail(updateArray(addDetail, idx, true));
                      }
                    }}
                  >
                    {addDetail[idx] ? "Remove Description" : "Add Description"}
                  </Link>
                  <Collapse in={addDetail[idx]}>
                    <TextField
                      id="outlined-multiline-static"
                      hiddenLabel
                      variant="filled"
                      multiline
                      rows={3}
                      fullWidth
                      value={boxData.box_details[idx].description}
                      onChange={(event) => {
                        boxData.box_details[idx].description =
                          event.target.value;
                        setBoxData({
                          ...boxData,
                          box_details: boxData.box_details,
                        });
                      }}
                      InputProps={{ disableUnderline: true }}
                    />
                  </Collapse>
                  <Divider sx={{ mt: 1, mb: 2 }} />
                </React.Fragment>
              );
            })}
          </Box>
          <Box sx={{ pb: 2, textAlign: "center", m: "auto" }}>
            <Button
              color="primary"
              variant="contained"
              sx={{ mx: 1 }}
              onClick={() => {
                setBoxData({
                  ...boxData,
                  box_details: boxData.box_details.concat({
                    id: boxData.box_details.length + 1,
                    document_title: "",
                    description: "",
                    rds_number: "",
                    retention_period: "",
                    document_date: "",
                  }),
                });
              }}
            >
              Add more
            </Button>
          </Box>
          <Box>
            <Alert severity="info" sx={{ mb: 1 }}>
              The document with largest retention period is the basis for the
              disposal date.
            </Alert>
            <TextField
              autoFocus
              required
              fullWidth
              id="disposal_date"
              name="disposal_date"
              label="Disposal Date"
              type="text"
              value={boxData.disposal_date}
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button color="inherit" onClick={() => onClose(false)}>
            Close
          </Button>
          <Button variant="contained" onClick={() => handleBoxData()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

const getFilteredOptions = (options, params) => {
  const filtered = filter(options, params);

  const { inputValue } = params;
  // Suggest the creation of a new value
  const isExisting = options.some((option) => inputValue === option.title);
  if (inputValue !== "" && !isExisting) {
    filtered.push({
      rds_no: "No RDS",
      rds_item_no: "",
      series_title_description: `${inputValue}`,
      retention_period: "0",
      dept_unit: "Others",
    });
  }

  return filtered;
};

function updateArray(arr, index, value) {
  let updatedArray = arr;
  updatedArray[index] = value;

  return [...updatedArray];
}
// const DocumentDate = (props) => {
//     const [open, setOpen] = React.useState(false);
//     const [val, setVal] = React.useState(0);
//     const handleTabChange = (event, newValue) => {
//       setVal(newValue);
//     };

//     const handleClick = () => (event) => {
//       props.setAnchorEl(event.currentTarget);
//       if (open) setOpen(false);
//       else setOpen(true);

//     };

//     return (
//       <Box>
//         <TextField label="Document Date" value={props.box_details.document_date} required inputProps={{ readOnly: true, }} onClick={handleClick()}/>
//         <Popper open={open} anchorEl={props.anchorEl} placement={"bottom"} transition style={{zIndex: 1500}}>
//           {({ TransitionProps }) => (
//             <Fade {...TransitionProps} timeout={350}>
//               <Paper sx={{p:1,}} elevation={3}>
//               <Box sx={{ width: '100%' }}>
//                 <Box sx={{ borderBottom: 1, borderColor: 'divider', }}>
//                   <Tabs value={val} onChange={handleTabChange} aria-label="basic tabs example" sx={{minHeight:20}}>
//                     <Tab label="Month" sx={{minHeight:15, fontSize:12, py:0}} />
//                     <Tab label="Year" sx={{minHeight:15, fontSize:12, py:0}} />
//                   </Tabs>
//                 </Box>
//                 <TabPanel value={val} index={0}>
//                   <Grid container sx={{ width: 310}} spacing={1}>
//                   {
//                     months.map((month,index)=>(
//                       <Grid key={index} item xs={4}>
//                         <Paper sx={{
//                             padding: 0,
//                             color: 'text.secondary',
//                             height: 80,
//                             boxShadow: 0,
//                             textAlign: 'center',
//                             border: "1px solid black",
//                             display: 'flex',
//                             justifyContent: 'center',
//                             alignContent: 'center',
//                             flexDirection: 'column',
//                             backgroundColor: props.selectedMonths.includes(month)?"#6aa84f":props.inDateRange.includes(month)?"#b6d7a8":""
//                         }}
//                           onClick={()=>props.selectedMonthRange(month)}
//                         >
//                           {month.substring(0,3)}
//                         </Paper>
//                       </Grid>
//                     ))
//                   }
//                   </Grid>
//                 </TabPanel>
//                 <TabPanel value={val} index={1} >
//                   <Grid container sx={{ width: 310}} spacing={1}>
//                     {
//                       getYears().map((year,index)=>(
//                         <Grid key={index} item xs={4}>
//                           <Paper
//                             onClick={()=>{props.idx>0?null:props.setSelectedYear(year)}}
//                             sx={{
//                                 padding: 0,
//                                 color: 'text.secondary',
//                                 height: 80,
//                                 boxShadow: 0,
//                                 textAlign: 'center',
//                                 border: "1px solid black",
//                                 display: 'flex',
//                                 justifyContent: 'center',
//                                 alignContent: 'center',
//                                 flexDirection: 'column',
//                                 backgroundColor: props.selectedYear===year?"#6aa84f":""
//                             }}
//                           >
//                             {year}
//                           </Paper>
//                         </Grid>
//                       ))
//                     }
//                     </Grid>
//                 </TabPanel>

//                 </Box>
//                 <Box display="flex" flexDirection="row-reverse" justifyContent="space-between" paddingTop={1}>
//                   <Button size="small" onClick={()=> {props.saveDocumentDate(props.idx); setOpen(false);}} variant="contained">Save</Button>
//                   <Button size="small" onClick={()=> props.clearDocumentDate(props.idx)} variant="text" color="warning">Clear</Button>
//                 </Box>
//               </Paper>
//             </Fade>
//           )}
//         </Popper>
//       </Box>
//     )
//   }

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: "Pulp Fiction", year: 1994 },
  {
    title: "The Lord of the Rings: The Return of the King",
    year: 2003,
  },
  { title: "The Good, the Bad and the Ugly", year: 1966 },
  { title: "Fight Club", year: 1999 },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: 2001,
  },
  {
    title: "Star Wars: Episode V - The Empire Strikes Back",
    year: 1980,
  },
  { title: "Forrest Gump", year: 1994 },
  { title: "Inception", year: 2010 },
  {
    title: "The Lord of the Rings: The Two Towers",
    year: 2002,
  },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { title: "Goodfellas", year: 1990 },
  { title: "The Matrix", year: 1999 },
  { title: "Seven Samurai", year: 1954 },
  {
    title: "Star Wars: Episode IV - A New Hope",
    year: 1977,
  },
  { title: "City of God", year: 2002 },
  { title: "Se7en", year: 1995 },
  { title: "The Silence of the Lambs", year: 1991 },
  { title: "It's a Wonderful Life", year: 1946 },
  { title: "Life Is Beautiful", year: 1997 },
  { title: "The Usual Suspects", year: 1995 },
  { title: "Léon: The Professional", year: 1994 },
  { title: "Spirited Away", year: 2001 },
  { title: "Saving Private Ryan", year: 1998 },
  { title: "Once Upon a Time in the West", year: 1968 },
  { title: "American History X", year: 1998 },
  { title: "Interstellar", year: 2014 },
  { title: "Casablanca", year: 1942 },
  { title: "City Lights", year: 1931 },
  { title: "Psycho", year: 1960 },
  { title: "The Green Mile", year: 1999 },
  { title: "The Intouchables", year: 2011 },
  { title: "Modern Times", year: 1936 },
  { title: "Raiders of the Lost Ark", year: 1981 },
  { title: "Rear Window", year: 1954 },
  { title: "The Pianist", year: 2002 },
  { title: "The Departed", year: 2006 },
  { title: "Terminator 2: Judgment Day", year: 1991 },
  { title: "Back to the Future", year: 1985 },
  { title: "Whiplash", year: 2014 },
  { title: "Gladiator", year: 2000 },
  { title: "Memento", year: 2000 },
  { title: "The Prestige", year: 2006 },
  { title: "The Lion King", year: 1994 },
  { title: "Apocalypse Now", year: 1979 },
  { title: "Alien", year: 1979 },
  { title: "Sunset Boulevard", year: 1950 },
  {
    title:
      "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    year: 1964,
  },
  { title: "The Great Dictator", year: 1940 },
  { title: "Cinema Paradiso", year: 1988 },
  { title: "The Lives of Others", year: 2006 },
  { title: "Grave of the Fireflies", year: 1988 },
  { title: "Paths of Glory", year: 1957 },
  { title: "Django Unchained", year: 2012 },
  { title: "The Shining", year: 1980 },
  { title: "WALL·E", year: 2008 },
  { title: "American Beauty", year: 1999 },
  { title: "The Dark Knight Rises", year: 2012 },
  { title: "Princess Mononoke", year: 1997 },
  { title: "Aliens", year: 1986 },
  { title: "Oldboy", year: 2003 },
  { title: "Once Upon a Time in America", year: 1984 },
  { title: "Witness for the Prosecution", year: 1957 },
  { title: "Das Boot", year: 1981 },
  { title: "Citizen Kane", year: 1941 },
  { title: "North by Northwest", year: 1959 },
  { title: "Vertigo", year: 1958 },
  {
    title: "Star Wars: Episode VI - Return of the Jedi",
    year: 1983,
  },
  { title: "Reservoir Dogs", year: 1992 },
  { title: "Braveheart", year: 1995 },
  { title: "M", year: 1931 },
  { title: "Requiem for a Dream", year: 2000 },
  { title: "Amélie", year: 2001 },
  { title: "A Clockwork Orange", year: 1971 },
  { title: "Like Stars on Earth", year: 2007 },
  { title: "Taxi Driver", year: 1976 },
  { title: "Lawrence of Arabia", year: 1962 },
  { title: "Double Indemnity", year: 1944 },
  {
    title: "Eternal Sunshine of the Spotless Mind",
    year: 2004,
  },
  { title: "Amadeus", year: 1984 },
  { title: "To Kill a Mockingbird", year: 1962 },
  { title: "Toy Story 3", year: 2010 },
  { title: "Logan", year: 2017 },
  { title: "Full Metal Jacket", year: 1987 },
  { title: "Dangal", year: 2016 },
  { title: "The Sting", year: 1973 },
  { title: "2001: A Space Odyssey", year: 1968 },
  { title: "Singin' in the Rain", year: 1952 },
  { title: "Toy Story", year: 1995 },
  { title: "Bicycle Thieves", year: 1948 },
  { title: "The Kid", year: 1921 },
  { title: "Inglourious Basterds", year: 2009 },
  { title: "Snatch", year: 2000 },
  { title: "3 Idiots", year: 2009 },
  { title: "Monty Python and the Holy Grail", year: 1975 },
];
