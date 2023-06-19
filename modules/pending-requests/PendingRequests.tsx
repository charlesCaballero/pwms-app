import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import ConfirmStorageRequest from './ConfirmStorageRequest';
import ConfirmWithdrawalRequest from './ConfirmWithdrawalRequest';
import ConfirmReturnRequest from './ConfirmReturnRequest';
import ConfirmDisposalRequest from './ConfirmDisposalRequest';

export default function PendingRequests() {
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
          <ConfirmStorageRequest />
        </TabPanel>
        <TabPanel value="2">
          <ConfirmWithdrawalRequest />
        </TabPanel>
        <TabPanel value="3">
          <ConfirmReturnRequest />
        </TabPanel>
        <TabPanel value="4">
          <ConfirmDisposalRequest/>
        </TabPanel>
      </TabContext>
    </Box>
  );
}
