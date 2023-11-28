import React, { useState } from 'react';

const DocumentDetailsModal = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filePath, setFilePath] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpload({ title, description, filePath });
    onClose(); 
  };

  if (!isOpen) return null;

  return (
    <div className='modal'>
      <form onSubmit={handleSubmit}>
        <h2>Upload Document</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="File Path"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <button type="submit">Submit</button>
        <button onClick={onClose}>Close</button>
      </form>
    </div>
  );
};

export default DocumentDetailsModal;
