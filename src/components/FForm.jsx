import React, { useState } from 'react';
import './Fcss.css'; // Make sure to create a corresponding CSS file


function InterviewForm() {
  const [interviewers, setInterviewers] = useState([
    { name: '', email: '' }
  ]);

  const [intervieweeName, setIntervieweeName] = useState('');
  const [intervieweeEmail, setIntervieweeEmail] = useState('');
  const [interviewTime, setInterviewTime] = useState('');

  const handleAddInterviewer = () => {
    setInterviewers([...interviewers, { name: '', email: '' }]);
  };

  const handleRemoveInterviewer = (index) => {
    setInterviewers(interviewers.filter((_, i) => i !== index));
  };

  const handleInterviewerChange = (index, event, field) => {
    const newInterviewers = interviewers.map((interviewer, i) => {
      if (i === index) {
        return { ...interviewer, [field]: event.target.value };
      }
      return interviewer;
    });
    setInterviewers(newInterviewers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Process form data here
    console.log({
      interviewers,
      intervieweeName,
      intervieweeEmail,
      interviewTime,
    });
  };

  return (
    <div className="interview-form-container">
      <form onSubmit={handleSubmit}>
        <h2>Interview Information</h2>
        {interviewers.map((interviewer, index) => (
          <div key={index} className="interviewer-entry">
            <input
              type="text"
              placeholder={`Interviewer ${index + 1} Name`}
              value={interviewer.name}
              onChange={(e) => handleInterviewerChange(index, e, 'name')}
            />
            <input
              type="email"
              placeholder={`Interviewer ${index + 1} Email Address`}
              value={interviewer.email}
              onChange={(e) => handleInterviewerChange(index, e, 'email')}
            />
            <button type="button" onClick={handleAddInterviewer} className="add-interviewer-button">
              +
            </button>
            {interviewers.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveInterviewer(index)}
                className="remove-interviewer-button"
              >
                -
              </button>
            )}
          </div>
        ))}
        <input
          type="text"
          placeholder="Interviewee Name"
          value={intervieweeName}
          onChange={(e) => setIntervieweeName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Interviewee Email Address"
          value={intervieweeEmail}
          onChange={(e) => setIntervieweeEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Interview Time"
          value={interviewTime}
          onChange={(e) => setInterviewTime(e.target.value)}
        />
        <button type="input">Upload CV</button>
      </form>
    </div>
  );
}

export default InterviewForm;

