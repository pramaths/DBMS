// ApplyModal.js

import React, { useState } from 'react';
import "./Applymodal.css"
import { useParams } from 'react-router-dom'; 
const ApplyModal = ({ onClose, onSubmit }) => {
  const [applicationMessage, setApplicationMessage] = useState('');
  const [email, setEmail] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const { id: project_id } = useParams();
  const handleSubmit = () => {
    const requestBody = {
      proposal_text: applicationMessage,
      Estimated_cost: estimatedCost,
      Estimated_Time: estimatedTime,
      project_id
    };
  console.log(requestBody)
    // Make the POST request
    fetch(`http://localhost:8000/api/proposalforproject/${project_id}`, { // Replace with your actual API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      credentials: 'include' // If you're using cookies for authentication
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Application submitted:', data);
      onSubmit(); // Call the onSubmit prop to notify the parent component
      onClose(); // Close the modal
    })
    .catch(error => {
      console.error('Error submitting application:', error);
    });
  };
  

  return (
    <div className="apply-modal">
      <div className="apply-modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Apply to work on Bounty</h2>
        <p>Your application message will be publicly posted to this Bounty.</p>
        <textarea
          value={applicationMessage}
          onChange={(e) => setApplicationMessage(e.target.value)}
          placeholder="Explain why you're the best candidate..."
        />
        <input
          type="text"
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.value)}
          placeholder="Estimated cost"
        />
        <input
          type="text"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          placeholder="Estimated time"
        />
        <button onClick={handleSubmit}>Send Application</button>
      </div>
    </div>
  );
};

export default ApplyModal;
