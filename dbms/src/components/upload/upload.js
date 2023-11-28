import React, { useState } from 'react';

const UploadModal = ({ projectId, onDocumentUpload, onClose }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async () => {
        if (file) {
            await onDocumentUpload(projectId, file);
        }
    };

    return (
        <div className="upload-modal">
            <h2>Upload Document</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={onClose}>Close</button>
        </div>
    );
};

export default UploadModal;
