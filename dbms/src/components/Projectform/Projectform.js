import React, { useState } from 'react';
import './projectform.css';

const Projectform = () => {
  const [formData, setFormData] = useState({
    title: "",
    requirements: "",
    price: "",
    duration: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      file: e.target.files[0]
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className='projectform-container'>
      <form className='projectform' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Project Title:</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter project title"
          />
        </div>
        <div className='form-group'>
          <label>Requirements:</label>
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleChange}
            placeholder="Specify project requirements"
          />
        </div>
        <div className='form-group'>
          <label>Price Range:</label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter your price range"
          />
        </div>
        <div className='form-group'>
          <label>Duration:</label>
          <input
            type="text"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Project duration"
          />
        </div>
        <div className='form-group'>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Project description"
          />
        </div>
        <div className='form-group'>
          <label>Related Document (Optional):</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>
        <div className='form-group'>
          <button type="submit">Submit Project</button>
        </div>
      </form>
    </div>
  );
};

export default Projectform;
