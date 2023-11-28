// ProjectPostModal.js
import React from 'react';
import "./postproject.css"
const ProjectPostModal = ({ isOpen, onClose, onSubmit }) => {
  if (!isOpen) return null;
  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const formData = new FormData(event.target);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    try {
      const response = await fetch('http://localhost:8000/api/postproject', { // Replace '/api/projects' with your actual API endpoint
        method: 'POST',
        credentials: 'include', // to send cookies
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Server responded with an error');
      }
  
      const result = await response.json();
      console.log(result);
      onClose(); // Close the modal on success
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="modal">
      <div className="modal-content">
        <div className='modal-header'>
        <h2>Post a New Project</h2>
        <span className="close" onClick={onClose}>&times;</span>
        </div>
        <div className='project-content'>
  <form onSubmit={handleSubmit}>
    <div >
      <label htmlFor="title">Project Title</label>
      <input type="text" id="title" name="title" placeholder="Enter project title" required />
    </div>
    <div>
      <label htmlFor="due">Target Completion Date</label>
      <input type="date" id="due" name="due" placeholder='26-11-2023'required />
    </div>
    <div>
      <label htmlFor="description">Description</label>
      <textarea id="description" name="description" placeholder="Describe the project" required></textarea>
    </div>

    <div>
      <label htmlFor="requirements">Requirements</label>
      <textarea id="requirements" name="requirements" placeholder="Project requirements"></textarea>
    </div>

    <div>
      <label htmlFor="deadline">Bidding Ends in</label>
      <input type="date" id="deadline" name="deadline" required />
    </div>

    <div>
      <label htmlFor="price">Price</label>
      <input type="number" id="price" name="price" placeholder="Set a price" required />
    </div>

    <div>
      <label htmlFor="document">Upload File</label>
      <input type="file" id="document" name="document" accept=".pdf, .doc, .docx" />
    </div>
<div>By posting a Project, you agree to the Terms.</div>
    <button type="submit">Post Project</button>
  </form>
</div>

      </div>
    </div>
  );
};

export default ProjectPostModal;
