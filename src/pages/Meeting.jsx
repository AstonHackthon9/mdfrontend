import React from 'react'
import CodeEditor from '../components/CodeEditor'
import Compiler from '../components/Compiler'
import { Container, Grid, Paper, Box, Typography } from '@mui/material'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  

const Meeting = () => {
    const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container maxWidth='xl'>
    <Grid container mt={7}>
        <Grid item md={8}>
        <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Description" {...a11yProps(0)} />
          <Tab label="Editor" {...a11yProps(1)} />
          <Tab label="Canvas" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        Description
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <Compiler/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        Canvas
      </CustomTabPanel>
    </Box>
        </Grid>
        <Grid item md={4} >
            <Paper sx={{height:'300px', margin:'10px 10px', backgroundColor:'#EEEDEB'}}>

            </Paper>
            <Paper sx={{height:'300px', margin:'70px 10px 0 10px', backgroundColor:'#EEEDEB'}}>

            </Paper>
        </Grid>
    </Grid>
    </Container>
  )
}

export default Meeting