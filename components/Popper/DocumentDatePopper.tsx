import { styled } from "@mui/material/styles";
import {
  Box,
  TextField,
  Popper,
  Fade,
  Paper,
  Tabs,
  Tab,
  Grid,
  Button,
} from "@mui/material";
import React from "react";

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

const DocDate = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(0),
  color: theme.palette.text.secondary,
  height: 80,
  // boxShadow: 0,
  textAlign: "center",
  border: "1px solid black",
  display: "flex",
  justifyContent: "center",
  alignContent: "center",
  flexDirection: "column",
  // backgroundColor: "green",
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 1 }}>{children}</Box>}
    </div>
  );
}

function getYears() {
  var max = new Date().getFullYear();
  var min = max - 11;
  var years = [];

  for (var i = max; i >= min; i--) {
    years.push(i);
  }
  return years;
}

interface DocumentDateProps {
  anchorEl: any;
  setAnchorEl(target: any): void;
  boxDetails: any;
  idx: number;
  saveDocumentDate(
    document_date: string,
    selected_year: number,
    largest_month: number,
    index: number
  ): void;
  currentYear: number;
  largestMonth: number;
  date?: number;
}

export default function DocumentDate(props: DocumentDateProps) {
  const {
    anchorEl,
    setAnchorEl,
    boxDetails,
    idx,
    saveDocumentDate,
    currentYear,
    largestMonth,
    date,
  } = props;
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState(0);
  const [selectedDay, setSelectedDay] = React.useState([]);
  const [selectedMonths, setSelectedMonths] = React.useState([]);
  const [selectedYear, setSelectedYear] = React.useState(currentYear);

  const handleTabChange = (_event, newValue) => {
    setVal(newValue);
  };

  const handleClick = () => (event) => {
    setAnchorEl(event.currentTarget);
    if (open) setOpen(false);
    else setOpen(true);
  };

  const getDays = (): any[] => {
    const days = Array.apply(null, { length: 31 + 1 })
      .map(Number.call, Number)
      .slice(1);
    return days;
  };

  const selectedMonthRange = (month) => {
    // console.log("months: " + month);

    if (selectedMonths.length <= 1) {
      setSelectedMonths(selectedMonths.concat(month));
    } else setSelectedMonths(month);
  };

  const selectedDayRange = (day) => {
    // console.log("day: " + day);

    if (selectedDay.length <= 1) {
      setSelectedDay(selectedDay.concat(day));
    } else setSelectedDay(day);
  };

  const clearDocumentDate = () => {
    setSelectedMonths([]);
    setSelectedDay([]);
    setSelectedYear(null);
  };

  return (
    <Box>
      <TextField
        label="Document Date"
        value={boxDetails.document_date}
        required
        inputProps={{ readOnly: true }}
        onClick={handleClick()}
      />
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement={"bottom"}
        transition
        style={{ zIndex: 1500 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper sx={{ p: 1 }} elevation={3}>
              <Box sx={{ width: "100%" }}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={val}
                    onChange={handleTabChange}
                    aria-label="basic tabs example"
                    sx={{ minHeight: 20 }}
                  >
                    <Tab
                      label="Month"
                      sx={{ minHeight: 15, fontSize: 12, py: 0 }}
                    />
                    <Tab
                      label="Day"
                      disabled={selectedMonths.length > 1}
                      sx={{ minHeight: 15, fontSize: 12, py: 0 }}
                    />
                    <Tab
                      label="Year"
                      sx={{ minHeight: 15, fontSize: 12, py: 0 }}
                    />
                  </Tabs>
                </Box>
                <TabPanel value={val} index={0}>
                  <Grid container sx={{ width: 310 }} spacing={1}>
                    {months.map((month, index) => (
                      <Grid key={"month-" + index} item xs={4}>
                        <DocDate
                          onClick={() => selectedMonthRange(index)}
                          sx={{
                            backgroundColor:
                              index === selectedMonths[0] ||
                              index === selectedMonths[1]
                                ? "#6aa84f"
                                : index >= selectedMonths[0] &&
                                  index <= selectedMonths[1]
                                ? "#b6d7a8"
                                : "",
                          }}
                        >
                          {month.substring(0, 3)}
                        </DocDate>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel value={val} index={1}>
                  <Grid
                    container
                    sx={{ width: 310, height: 300, overflowY: "auto" }}
                    spacing={1}
                  >
                    {getDays().map((day) => (
                      <Grid key={"day-" + day} item xs={2}>
                        <DocDate
                          sx={{
                            height: 40,
                            backgroundColor:
                              day === selectedDay[0] || day === selectedDay[1]
                                ? "#6aa84f"
                                : day >= selectedDay[0] && day <= selectedDay[1]
                                ? "#b6d7a8"
                                : "",
                          }}
                          onClick={() => {
                            selectedDayRange(day);
                          }}
                        >
                          {day}
                        </DocDate>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
                <TabPanel value={val} index={2}>
                  <Grid container sx={{ width: 310 }} spacing={1}>
                    {getYears().map((year, index) => (
                      <Grid key={"year" + index} item xs={4}>
                        <DocDate
                          onClick={() => {
                            idx > 0 ? null : setSelectedYear(year);
                          }}
                          sx={{
                            backgroundColor:
                              selectedYear === year ? "#6aa84f" : "",
                          }}
                        >
                          {year}
                        </DocDate>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>
              </Box>
              <Box
                display="flex"
                flexDirection="row-reverse"
                justifyContent="space-between"
                paddingTop={1}
              >
                <Button
                  size="small"
                  onClick={() => {
                    let largest = 0;
                    if (largestMonth < selectedMonths[0])
                      largest = selectedMonths[0];
                    if (largestMonth < selectedMonths[1])
                      largest = selectedMonths[1];
                    else largest = largestMonth;
                    const day = () => {
                      if (selectedDay.length > 1) {
                        if (selectedDay[0] === selectedDay[1])
                          return selectedDay[0] + ", ";
                        else
                          return selectedDay[0] + "-" + selectedDay[1] + ", ";
                      } else if (selectedDay.length === 1)
                        return selectedDay[0] + ", ";
                      else return "";
                    };

                    let docDate =
                      selectedMonths.length > 1
                        ? selectedMonths[0] === selectedMonths[1]
                          ? months[selectedMonths[0]] +
                            " " +
                            day() +
                            selectedYear
                          : months[selectedMonths[0]] +
                            "-" +
                            months[selectedMonths[1]] +
                            " " +
                            selectedYear
                        : months[selectedMonths[0]] +
                          " " +
                          day() +
                          selectedYear;

                    saveDocumentDate(
                      docDate,
                      currentYear > 0 ? currentYear : selectedYear,
                      largest,
                      idx
                    );
                    clearDocumentDate();
                    setOpen(false);
                  }}
                  variant="contained"
                >
                  Save
                </Button>
                <Button
                  size="small"
                  onClick={() => clearDocumentDate()}
                  variant="text"
                  color="warning"
                >
                  Clear
                </Button>
              </Box>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
}
