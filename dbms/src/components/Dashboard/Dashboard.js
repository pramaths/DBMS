import React, { useEffect,useState } from 'react';
import './dashboard.css'; 
import { FaUserCircle , FaClock,FaUserFriends} from 'react-icons/fa'; 
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import moment from "moment"
import ProjectPostModal from '../postprojectmodal/PostProjectModal';
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
const[user,setUser]=useState({})
  const [status, setStatus] = useState('open'); // Default status
  const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/projects?status=${status}`, {
      credentials: 'include' 
    }).then(response => response.json())
      .then(data => setProjects(data.data))
      .catch(error => console.error('Fetch error:', error));
  }, [status]); 
  useEffect(() => {
    fetch(`http://localhost:8000/api/user`,{
      credentials:'include'
    })
      .then(response => response.json())
      .then(data => setUser(data.users[0]))
      .catch(error => console.error('Fetch error:', error));
  }, []); 
  console.log("projects",projects)
  console.log("pro",user)
  const calculateProfileCompletion = (user) => {
    let completedFields = 0;
    let totalFields = 0;
    if (user.username) {
      completedFields++;
    }
    if (user.email) {
      completedFields++;
    }
    if (user.image_url) {
      completedFields++;
    }

    totalFields = 3;
    return (completedFields / totalFields) * 100;
  };
  const completionPercentage = calculateProfileCompletion(user);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('all'); 
  useEffect(() => {
    fetch(`http://localhost:8000/api/projects?status=${status}`)
      .then(response => response.json())
      .then(data => setProjects(data.data))
      .catch(error => console.error('Fetch error:', error));
  }, [status]);

  const filteredProjects = projects
    .filter(project => project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       project.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === 'recommend') {
        return b.total_proposals - a.total_proposals;
      }
      return 0;
    });
    const handleFormSubmit = async (event) => {
      event.preventDefault();
      const { title, description, price } = event.target.elements;
      const projectData = {
        title: title.value,
        description: description.value,
        price: price.value,
      };
      const response = await fetch('http://localhost:8000/api/postproject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
    
      if (response.ok) {
        closeModal();
      } else {
        console.log("error")
      }
    };
    
  return (
    <div className='dashboard-container'>
        <Navbar/>
    <div className="dashboard">
    
      <div className="main-content">
      
        <div className="left-section">
        <div className="user-profile">
              <div className="profile-icon-wrapper" style={{ '--percentage': completionPercentage }}>
                {user.image_url ? (
   <img src={`http://localhost:8000${user.image_url}`} alt="User" className="user-image" />
                ) : (
                  <FaUserCircle size={50} />
                )}
              </div>
              <div className='user-info'>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              </div>
           
              <Link to="/profile">
Complete your profile

              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="user-nav">
              <ul>
                <li>Home</li>
                <li>Projects</li>
                <li>Blogs</li>
                <li>Developer</li>
              </ul>
            </nav>
          </div>
        

        <div className="middle-section">
        <div className="dashboard-controls">
        <button onClick={openModal}>Post New Project</button>
  <ProjectPostModal 
    isOpen={isModalOpen} 
    onClose={closeModal} 
    onSubmit={handleFormSubmit} 
  />
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <select onChange={(e) => setSortOption(e.target.value)}>
              <option value="all">All Projects</option>
              <option value="recommend">Recommended</option>
            </select>
          </div>
        <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="Completed">Closed</option>
            <option value="In progress">Ongoing</option>
          </select>

          { Array.isArray(projects) && projects.map((project, index) => (
           <Link key={index} className="project">
            <div className='project-pds'>
              <div className='prices'>
            <div className='project-price'>${project.price}  </div>
            <div className='project-priceI'>{" "}  ₹ {project.price*86}</div>
            </div>
            <div className='deadlines'>
            <FaClock />
            <div className='project-due'>Ends {moment(project.due, "YYYYMMDD").fromNow()}.</div>
            <div className='project-status'>{project.status}</div>
            </div>
            </div>
            <Link to={`/project/${project.id}`} key={index} className="project">

           <div className='project-title'>{project.title}</div>
           <div className='project-description'>
           {project.description.length > 200
        ? `${project.description.substring(0, 200)}...`
        : project.description}
           </div>
           </Link>
<div className='project-oa'>
  <div className='project-poster'>
  <div className='student-image-container'>
  <img 
    src={project.uname ? `http://localhost:8000${project.S_image}` : '/path/to/default/image.jpg'}
    alt="Student" 
    className='student-image'
/>
.
</div>
.
  <div className='project-owner'>{project.uname}</div>
  <div className='project-due'>{moment(project.created_at, "YYYYMMDD").fromNow()}.</div>
  </div>
  <div className='proj-applicants'>
  <FaUserFriends/>
  <div className='proj-app'>
  {project.total_proposals}  Applicants
  </div>
    </div>
</div>
         </Link>
          ))}
        </div>
        </div>
      </div>
   
      </div>

  );
};

export default Dashboard;
