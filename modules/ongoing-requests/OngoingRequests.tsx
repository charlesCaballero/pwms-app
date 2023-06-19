import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import UpdateStorageRequest from './UpdateStorageRequests';
import UpdateWithdrawalRequest from './UpdateWithdrawalRequests';
import UpdateReturnRequest from './UpdateReturnRequests';
import UpdateDisposalRequest from './UpdateDisposalRequests';

export default function OngoingRequests() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="pending requests">
            <Tab label="Storage" value="1" />
            <Tab label="Withdrawal" value="2" />
            <Tab label="Return" value="3" />
            <Tab label="Disposal" value="4" />
          </TabList>
        </Box>
        <TabPanel value="1">
            <UpdateStorageRequest />
        </TabPanel>
        <TabPanel value="2">
            <UpdateWithdrawalRequest />
        </TabPanel>
        <TabPanel value="3">
            <UpdateReturnRequest />
        </TabPanel>
        <TabPanel value="4">
          <UpdateDisposalRequest />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
