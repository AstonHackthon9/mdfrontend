import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from '@monaco-editor/react';
import "../styles/compiler.css";
import { Grid } from "@mui/material";

const Compiler = () => {
  const [input, setInput] = useState(localStorage.getItem('input') || '');
  const [output, setOutput] = useState('');
  const [languageId, setLanguageId] = useState(localStorage.getItem('language_Id') || 2);
  const [userInput, setUserInput] = useState('');

  const inputChange = (event) => {
    setInput(event?.target?.value)
    localStorage.setItem('input', event?.target?.value);
  };

  function handleEditorChange(value, event) {
    setInput(value);
  }

  const userInputChange = (event) => {
    event.preventDefault();
    setUserInput(event.target.value);
  };

  const languageChange = (event) => {
    event.preventDefault();
    setLanguageId(event.target.value);
    localStorage.setItem('language_Id', event.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      let outputText = document.getElementById("output");
      outputText.innerHTML = "";
      outputText.innerHTML += "Creating Submission ...\n";
  
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          source_code: input,
          stdin: userInput,
          language_id: languageId,
        },
        {
          headers: {
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "x-rapidapi-key": "b1267bef0cmsh4fa804ab6b87c3cp119988jsna87a74c23c84", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
            "content-type": "application/json",
            accept: "application/json",
          },
        }
      );
  
      outputText.innerHTML += "Submission Created ...\n";
  
      let jsonGetSolution = {
        status: { description: "Queue" },
        stderr: null,
        compile_output: null,
      };
  
      while (
        jsonGetSolution.status.description !== "Accepted" &&
        jsonGetSolution.stderr == null &&
        jsonGetSolution.compile_output == null
      ) {
        outputText.innerHTML = `Creating Submission ... \nSubmission Created ...\nChecking Submission Status\nstatus : ${jsonGetSolution.status.description}`;
  
        if (response.data.token) {
          let url = `https://judge0-ce.p.rapidapi.com/submissions/${response.data.token}?base64_encoded=true`;
          const getSolution = await axios.get(url, {
            headers: {
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "x-rapidapi-key": "b1267bef0cmsh4fa804ab6b87c3cp119988jsna87a74c23c84", // Get yours for free at https://rapidapi.com/judge0-official/api/judge0-ce/
              "content-type": "application/json",
            },
          });
  
          jsonGetSolution = getSolution.data;
        }
      }
  
      if (jsonGetSolution.stdout) {
        const output = atob(jsonGetSolution.stdout);
        outputText.innerHTML = "";
        outputText.innerHTML += `Results :\n${output}\nExecution Time : ${jsonGetSolution.time} Secs\nMemory used : ${jsonGetSolution.memory} bytes`;
      } else if (jsonGetSolution.stderr) {
        const error = atob(jsonGetSolution.stderr);
        outputText.innerHTML = "";
        outputText.innerHTML += `\n Error :${error}`;
      } else {
        const compilationError = atob(jsonGetSolution.compile_output);
        outputText.innerHTML = "";
        outputText.innerHTML += `\n Error :${compilationError}`;
      }
    } catch (error) {
      console.error("An error occurred during submission:", error);
    }
  };

  return (
    <>
      <div className="row container-fluid">
        <Grid item md={6} className="col-6 ml-4 ">
          <label htmlFor="solution ">
            <span className="badge badge-info heading mt-2 ">
              <i className="fas fa-code fa-fw fa-lg"></i> Code Here
            </span>
          </label>
          <Editor 
                height="50vh"
                theme="vs-dark" 
                defaultLanguage="javascript" 
                defaultValue="// write your code here!"
                onChange={handleEditorChange}
            />
          {/* <textarea
            required
            name="solution"
            id="source"
            onChange={inputChange}
            className=" source"
            value={input}
          ></textarea> */}
          <button
            type="submit"
            className="btn btn-danger ml-2 mr-2 "
            onClick={submit}
          >
            <i className="fas fa-cog fa-fw"></i> Run
          </button>

          <label htmlFor="tags" className="mr-1">
            <b className="heading">Language:</b>
          </label>
          <select
            value={languageId}
            onChange={languageChange}
            id="tags"
            className="form-control form-inline mb-2 language"
          >
            <option value="54">C++</option>
            <option value="50">C</option>
            <option value="62">Java</option>
            <option value="71">Python</option>
            <option value="63">Java Script</option>
          </select>
        </Grid>
        <div className="col-5">
          <div>
            <span className="badge badge-info heading my-2 ">
              <i className="fas fa-exclamation fa-fw fa-md"></i> Output
            </span>
            <div id="output"></div>
          </div>
        </div>
      </div>
      {/* <div className="mt-2 ml-5">
        <span className="badge badge-primary heading my-2 ">
          <i className="fas fa-user fa-fw fa-md"></i> User Input
        </span>
        <br />
        <textarea id="input" onChange={userInputChange}></textarea>
      </div> */}
    </>
  );
};

export default Compiler;
