import React, { useEffect,useState } from 'react';
import './myproject.css'; 
import { FaUserCircle , FaClock,FaUserFriends} from 'react-icons/fa'; 
import Navbar from '../Navbar/Navbar';
import { Link } from 'react-router-dom';
import moment from "moment"
import ProjectPostModal from '../postprojectmodal/PostProjectModal';
import Cookies from 'js-cookie';
const Dashboard = () => {
  const [projects, setProjects] = useState([]);
const[user,setUser]=useState({})
  const [status, setStatus] = useState('open'); // Default status
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState({});
const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
const [reviewText, setReviewText] = useState('');

const [rating, setRating] = useState(0);
const handleReviewSubmit = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/submitreview/${projectId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, review_text: reviewText }),
        credentials: 'include'
      });
      if (response.ok) {
        console.log('Review and rating submitted successfully');
        setSubmittedReviews({ ...submittedReviews, [projectId]: true }); // Mark review as submitted
        setReviewText('');
        setRating(0); 
      } else {
        console.error('Failed to submit review and rating');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8000/api/myproject`, {
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
  const handleDeleteProject = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/deleteproject/${projectId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        console.log('Project deleted successfully');
        setProjects(projects.filter(project => project.id !== projectId));
      } else {
        console.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
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
    const [userRole, setUserRole] = useState('');

useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        setUserRole(payload.role); // Assuming 'role' is part of the token payload
    }
}, []);

  

    
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
                <Link to="/myprojects"> <li>Projects</li></Link>
                
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
          </div>
        <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="In progress">Ongoing</option>
          </select>

          { Array.isArray(projects) && projects.map((project, index) => (
           <Link  key={index} className="project">
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
           {project.status === 'Completed' && !submittedReviews[project.id] && (
            <div>
              <div>
                <label>Rating: </label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Enter your review here"
              />
              <button onClick={() => handleReviewSubmit(project.id)}>Submit Review</button>
            </div>
          )}
           {project.status === 'Open' && (
        <button onClick={() => handleDeleteProject(project.id)}>Delete</button>
      )}
          
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
<div>

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
