import React, { useEffect } from "react";
import Editor from '@monaco-editor/react';
import { Grid, Paper, Typography } from "@mui/material";

const CodeEditor = () => {

    function handleEditorChange(value, event) {
        console.log('here is the current model value:', value);
      }
    
      function handleEditorValidation(markers) {
        // model markers
        markers.forEach((marker) => console.log('onValidate:', marker.message));
      }
  return(
    <>
    <Typography variant="h4" sx={{textAlign:'center'}}>Meeting Room</Typography>
    <Grid container>
        <Grid item md={9}>
            <Editor 
                height="90vh" 
                defaultLanguage="javascript" 
                defaultValue="// some comment" 
                onChange={handleEditorChange}
                onValidate={handleEditorValidation}
            />
        </Grid>
        <Grid item md={3}>
            <Paper sx={{height:'100%'}}>
                Hello
            </Paper>
        </Grid>
    </Grid>
    </>
  )
};

export default CodeEditor;