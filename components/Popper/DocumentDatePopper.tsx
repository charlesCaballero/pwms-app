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
  } = props;
  const [open, setOpen] = React.useState(false);
  const [val, setVal] = React.useState(0);
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

  const selectedMonthRange = (month) => {
    console.log("months: " + month);

    if (selectedMonths.length <= 1) {
      setSelectedMonths(selectedMonths.concat(month));
    }
  };

  const clearDocumentDate = () => {
    setSelectedMonths([]);
    setSelectedYear(currentYear);
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
                  <Grid container sx={{ width: 310 }} spacing={1}>
                    {getYears().map((year, index) => (
                      <Grid key={"year" + index} item xs={4}>
                        <DocDate
                          onClick={() => {
                            idx > 0 ? null : setSelectedYear(year);
                          }}
                          sx={{
                            backgroundColor:
                              selectedYear === year || currentYear === year
                                ? "#6aa84f"
                                : "",
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
                    saveDocumentDate(
                      months[selectedMonths[0]] +
                        "-" +
                        months[selectedMonths[1]] +
                        " " +
                        selectedYear,
                      currentYear > 0 ? currentYear : selectedYear,
                      largest,
                      idx
                    );
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
