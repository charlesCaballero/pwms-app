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
import Cookie from "js-cookie";

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

const officeID = Cookie.get("office_id");

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
  // uID: any;
  office_id: string;
  box_code: string;
  box_details: DocumentDetails[];
  disposal_date: string;
}

interface StorageDialogProps extends DialogProps {
  getBoxData(data: any): void;
  editBoxData: any;
  boxID: number;
}

export default function AddStorageDialog(props: StorageDialogProps) {
  const { isOpen, onClose, getBoxData, boxID, editBoxData } = props;
  const [addDetail, setAddDetail] = React.useState([false]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentYear, setCurrentYear] = React.useState(-1);
  const [largestMonth, setLargestMonth] = React.useState(-1);
  const [largestRetention, setLargestRetention] = React.useState(0);
  const [defaultRDS, setDefaultRDS] = React.useState([]);
  const [boxData, setBoxData] = React.useState<BoxDetails>({
    // uID: "",
    office_id: officeID,
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

  const resetValues = () => {
    setCurrentYear(0);
    setLargestMonth(0);
    setLargestRetention(0);
    setBoxData({
      // uID: boxID + 1,
      office_id: officeID,
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
  };

  const handleBoxData = () => {
    getBoxData(boxData);
    resetValues();
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
        disposal_date: permanent
          ? "Permanent"
          : months[largest] + " " + (parseInt(year) + largestRetention),
      });
      setCurrentYear(year);
      setLargestMonth(largest);
    }
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
          description: "",
          rds_number: selected.rds_no + " #" + selected.rds_item_no,
          retention_period: selected.retention_period,
          document_date: "",
        };
      } else {
        newSelected.push({
          id: selected.id,
          document_title:
            selected.series_title_description + " (" + selected.dept_unit + ")",
          description: "",
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
    setCurrentYear(parseInt(date_array[1]));
    setLargestRetention(Math.max(...retention_array));
    if (currentYear >= 0) {
      setBoxData({
        ...boxData,
        disposal_date: permanent
          ? "Permanent"
          : months[Math.max(...months_array)] +
            " " +
            (parseInt(date_array[1]) + largestRetention),
      });
    }
  }, [boxData]);

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
            sx={{ mt: 2 }}
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
                      value={
                        defaultRDS[idx] !== undefined ? defaultRDS[idx] : null
                      }
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
                      value={row.rds_number}
                      id="rds_no"
                      name="rds_no"
                      label="RDS No."
                      disabled
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
                      disabled
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
                        row.description = "";
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
                      value={row.description}
                      onChange={(event) => {
                        row.description = event.target.value;
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

function updateArray(arr, index, value) {
  let updatedArray = arr;
  updatedArray[index] = value;

  return [...updatedArray];
}
