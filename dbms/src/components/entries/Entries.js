import React,{useState} from 'react';
import "./entries.css";

const Entries = () => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "JHON DEY",
      deadline: "2023-12-31",
      skillsRequired: ["JavaScript", "React", "Node.js"],
      description: "Looking for a skilled web designer to create a modern and professional website for a small business.",
      studentName: "Jane Doe"
    },
    {
      id: 2,
      name: "Project Apollo",
      deadline: "2024-01-15",
      skillsRequired: ["Python", "Django"],
      description: "Need a Python developer to build a backend system with Django for an e-commerce platform.",
      studentName: "John Smith"
    },
    {
      id: 3,
      name: "Project Atlas",
      deadline: "2023-11-30",
      skillsRequired: ["Angular", "TypeScript"],
      description: "Seeking an experienced Angular developer to refactor and enhance an existing application's UI.",
      studentName: "Alice Johnson"
    }
  ]);
  const [filters, setFilters] = useState({
    category: '',
    budgetRange: '',
    duration: '',
    experienceLevel: '',
    skills: [],
    minimumRating: 0
  });
  const [availableSkills, setAvailableSkills] = useState(['JavaScript', 'React', 'Node.js', 'Python', 'Django', 'Angular']);
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'skills') {
      setFilters(prevFilters => ({
        ...prevFilters,
        skills: checked
          ? [...prevFilters.skills, value]
          : prevFilters.skills.filter(skill => skill !== value)
      }));
    } else {
      setFilters(prevFilters => ({
        ...prevFilters,
        [name]: value
      }));
    }
  };
  const applyFilters = () => {
    console.log('Applying filters with the following selection:', filters);
    // Implement the logic to filter projects...
  };

  return (
    <div>
      <div className="searchbar">
        Browse projects
      </div>

      <div className='projectscontainer'>
        <div className='sidebar'>
        <h3>Filters</h3>
          <div className='filter-section'>
            <label>Skills:</label>
            {availableSkills.map(skill => (
              <div key={skill}>
                <input
                  type="checkbox"
                  name="skills"
                  value={skill}
                  id={`skill_${skill}`}
                  onChange={handleFilterChange}
                />
                <label htmlFor={`skill_${skill}`}>{skill}</label>
              </div>
            ))}
          </div>

          <div className='filter-section'>
            <label htmlFor='minimumRating'>Minimum Rating:</label>
            <select name='minimumRating' id='minimumRating' onChange={handleFilterChange}>
              <option value='0'>Any</option>
              <option value='1'>1+</option>
              <option value='2'>2+</option>
              <option value='3'>3+</option>
              <option value='4'>4+</option>
              <option value='5'>5</option>
            </select>
          </div>

          <button onClick={applyFilters}>Apply Filters</button>
        </div>
        <div className='projects'>
        <div className='projects'>
          {projects.map((project) => (
            <div className='project' key={project.id}>
              <div className='projectdetails'>
                <h2>{project.name}</h2>
                <p><strong>Ends in:</strong> {project.deadline}</p>
                <p>{project.description}</p>
                <p><strong>Posted by:</strong> {project.studentName}</p>
                <p style={{color:"blue"}}> {project.skillsRequired.join(', ')}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default Entries;
