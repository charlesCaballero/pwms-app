import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
// import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { DialogProps } from "@helpers/interface";
import {
  Alert,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { setPriority } from "os";

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
  rds_number: string;
  retention_period: string;
  document_date: string;
}

type PriorityLevel = "Red" | "Green" | "Black";

interface BoxDetails {
  // uID: any;
  office_id: number;
  box_code: any;
  priority_level: PriorityLevel;
  classification: string;
  box_details: DocumentDetails[];
  disposal_date: string;
  remarks: string;
}

interface StorageDialogProps extends DialogProps {
  getBoxData(data: any): void;
  editBoxData: any;
  officeID: number;
  newBoxCode: string;
}

export default function AddStorageDialog(props: StorageDialogProps) {
  const { isOpen, onClose, getBoxData, editBoxData, officeID, newBoxCode } =
    props;
  // const [addDetail, setAddDetail] = React.useState([false]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentYear, setCurrentYear] = React.useState(-1);
  const [largestMonth, setLargestMonth] = React.useState(-1);
  const [largestRetention, setLargestRetention] = React.useState(0);
  const [defaultRDS, setDefaultRDS] = React.useState([]);
  // const [addedRemarks, setAddedRemarks] = React.useState("");

  const [boxData, setBoxData] = React.useState<BoxDetails>({
    // uID: "",
    office_id: officeID,
    box_code: "",
    priority_level: "Green",
    classification: "STORAGE",
    box_details: [
      {
        id: 0,
        document_title: "",
        rds_number: "",
        retention_period: "",
        document_date: "",
      },
    ],
    remarks: "",
    disposal_date: "",
  });

  const retentions = useQuery(
    "document-retentions",
    async () => (await api(Method.GET, `${getRetentionsQuery}`)) as any,
    { refetchOnWindowFocus: false }
  );

  const resetValues = () => {
    setCurrentYear(0);
    setLargestMonth(0);
    setLargestRetention(0);
    setBoxData({
      // uID: boxID + 1,
      office_id: officeID,
      box_code: newBoxCode,
      priority_level: "Green",
      classification: "STORAGE",
      box_details: [
        {
          id: 0,
          document_title: "",
          rds_number: "",
          retention_period: "",
          document_date: "",
        },
      ],
      remarks: "",
      disposal_date: "",
    });
  };

  const handleBoxData = () => {
    getBoxData(boxData);
    resetValues();
  };

  const setPriorityLevel = (largestRetention, permanent) => {
    if (permanent) return "Red";
    else if (largestRetention > 2) return "Green";
    else return "Black";
  };

  const handleDocumentDateChange = (date, year, largest, index) => {
    // console.log("year: " + year);
    let permanent = false;
    boxData.box_details.forEach((detail) => {
      if (Object.values(detail).includes("Permanent")) permanent = true;
    });

    if (parseInt(year) > 0 && !date.includes("undefined")) {
      boxData.box_details[index].document_date = date;
      setBoxData({
        ...boxData,
        box_details: boxData.box_details,
        priority_level: setPriorityLevel(largestRetention, permanent),
        disposal_date: permanent
          ? "Permanent"
          : months[largest] + " " + (parseInt(year) + largestRetention + 1),
      });
      setCurrentYear(year);
      setLargestMonth(largest);
    }
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setBoxData({
      ...boxData,
      priority_level: event.target.value as PriorityLevel,
    });
  };

  const handleChangeValue = (selected, index) => {
    // console.log("selected: " + JSON.stringify(selected));
    // console.log("index: " + index);
    if (selected) {
      let newSelected = boxData.box_details;
      if (newSelected[index] !== undefined) {
        newSelected[index] = {
          id: selected.id,
          document_title:
            selected.series_title_description + " (" + selected.dept_unit + ")",
          rds_number: selected.rds_no + " #" + selected.rds_item_no,
          retention_period: selected.retention_period,
          document_date: "",
        };
      } else {
        newSelected.push({
          id: selected.id,
          document_title:
            selected.series_title_description + " (" + selected.dept_unit + ")",
          rds_number: selected.rds_no + " #" + selected.rds_item_no,
          retention_period: selected.retention_period,
          document_date: "",
        });
      }

      // console.log("newSelected: " + JSON.stringify(newSelected));

      let permanent = false;
      newSelected.forEach((detail) => {
        if (Object.values(detail).includes("Permanent")) permanent = true;
      });
      setBoxData({
        ...boxData,
        box_details: [...newSelected],
        disposal_date: permanent ? "Permanent" : "",
        remarks: selected.remarks
          ? selected.remarks + "\n" + boxData.remarks
          : "",
      });
    }
  };

  React.useEffect(() => {
    // console.log("editBoxData: " + JSON.stringify(editBoxData));
    if (editBoxData) {
      setBoxData(editBoxData);
    }
  }, [editBoxData]);

  React.useEffect(() => {
    let retention_array = [];
    let defaultVal = [];
    let permanent = false;
    let months_array = [];

    boxData.box_details.map((details) => {
      retention_array.push(parseInt(details.retention_period));
      const doc_date = details.document_date.split(" ");
      if (doc_date[0].includes("-")) {
        const doc_months = doc_date[0].split("-");
        months_array.push(months.indexOf(doc_months[0]));
        months_array.push(months.indexOf(doc_months[1]));
      } else {
        months_array.push(months.indexOf(doc_date[0]));
      }
      setLargestMonth(Math.max(...months_array));

      if (Object.values(details).includes("Permanent")) permanent = true;
      retentions.data?.find((rds) => {
        if (rds.id === details.id) {
          defaultVal.push(rds);
          return true;
        }
        return false;
      });
    });
    if (defaultVal !== undefined) setDefaultRDS(defaultVal);

    const date_array = boxData.box_details[0].document_date.split(" ");
    setCurrentYear(parseInt(date_array[date_array.length - 1]));
    setLargestRetention(Math.max(...retention_array));

    if (currentYear >= 0) {
      // const disposalYear =
      // console.log("date_array: " + date_array);

      setBoxData({
        ...boxData,
        disposal_date: permanent
          ? "Permanent"
          : months[Math.max(...months_array)] +
            " " +
            (parseInt(date_array[date_array.length - 1]) +
              largestRetention +
              1),
      });
    }
  }, [boxData]);

  React.useEffect(() => {
    // console.log("newBoxCode: "+newBoxCode);

    setBoxData({
      ...boxData,
      box_code: newBoxCode,
    });
  }, [newBoxCode]);

  return (
    <React.Fragment>
      <Dialog
        fullWidth
        maxWidth={"lg"}
        open={isOpen}
        onClose={() => onClose(false)}
      >
        <DialogTitle>{editBoxData ? "Edit Box" : "Add Box"}</DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            You can set my maximum width and whether to adapt or not.
          </DialogContentText> */}
          <Box display={"flex"} mt={2}>
            <Box sx={{ flexGrow: 1, pr: 1 }}>
              <TextField
                autoFocus
                required
                fullWidth
                id="box_code"
                name="box_code"
                label="Box Code"
                type="text"
                value={boxData.box_code}
                // value={newBoxCode.data}
                // onChange={(event) => {
                //   setBoxData({ ...boxData, box_code: event.target.value });
                // }}
                variant="outlined"
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>

            <Box sx={{ flexGrow: 1, pl: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Priority Level
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={boxData.priority_level}
                  label="Priority Level"
                  onChange={(event) => handlePriorityChange(event)}
                >
                  <MenuItem value={"Red"}>RED (Permanent Files)</MenuItem>
                  <MenuItem value={"Green"}>
                    GREEN (3 years above retention period)
                  </MenuItem>
                  <MenuItem value={"Black"}>
                    BLACK (1-2 years retention period or photocopied documents)
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box sx={{ p: 1, my: 1, border: "1px dashed gray", borderRadius: 2 }}>
            {boxData.box_details.map((row, idx) => {
              // console.log('defaultRDS: '+JSON.stringify(defaultRDS));

              return (
                <React.Fragment key={idx}>
                  <Box display="flex" alignItems={"center"} sx={{ pt: 1 }}>
                    <Autocomplete
                      freeSolo
                      id={"retentions" + idx}
                      sx={{ flexGrow: 1, mr: 1 }}
                      options={retentions?.data}
                      value={row.document_title}
                      groupBy={(option: any) => option.dept_unit}
                      getOptionLabel={(option: any) => {
                        return option.series_title_description
                          ? option.series_title_description
                          : option;
                      }}
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
                        // const optionRemarks = option.remarks? '('+option.remarks+')':'';
                        // const showOption = option.series_title_description+' '+optionRemarks;
                        const matches = match(
                          option.series_title_description,
                          // showOption,
                          inputValue
                        );
                        const parts = parse(
                          option.series_title_description,
                          // showOption,
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
                      value={row.rds_number}
                      id="rds_no"
                      name="rds_no"
                      label="RDS No."
                    />
                    <TextField
                      sx={{ width: 120, mr: 1 }}
                      inputProps={{ readOnly: true }}
                      value={
                        parseInt(row.retention_period) > 1
                          ? row.retention_period + " years"
                          : parseInt(row.retention_period) == 1
                          ? row.retention_period + " year"
                          : row.retention_period
                      }
                      id="retention_period"
                      label="Retention"
                      // helperText="Read-only"
                    />
                    <DocumentDate
                      boxDetails={row}
                      // boxDetails={row}
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
                          disposal_date: boxData.box_details[0].document_date
                            .split(" ")
                            .pop.toString(),
                        });
                      }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>

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
                    document_title: null,
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
            <TextField
              id="remarks"
              name="remarks"
              label="Remarks"
              variant="outlined"
              multiline
              rows={3}
              fullWidth
              value={boxData.remarks}
              onChange={(event) => {
                setBoxData({
                  ...boxData,
                  remarks: event.target.value,
                });
              }}
            />
          </Box>
          <Box>
            <Alert severity="info" sx={{ my: 1 }}>
              The document with longest retention period is the basis for the
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
          <Button
            color="inherit"
            onClick={() => {
              resetValues();
              onClose(false);
            }}
          >
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

// function updateArray(arr, index, value) {
//   let updatedArray = arr;
//   updatedArray[index] = value;

//   return [...updatedArray];
// }
