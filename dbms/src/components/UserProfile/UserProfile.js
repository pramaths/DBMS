import React, { useState, useEffect } from "react";
import "./userprofile.css";
import { FaUser, FaPhone, FaEnvelope, FaAddressCard, FaEdit, FaUpload } from "react-icons/fa";

const UserProfile = () => {
  const [user, setUser] = useState({
    username: "",
    avatar: "",
    bio: "",
    email: "",
    address: "",
    PhoneNo: "",
    resume: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/user', {
          credentials: 'include' 
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.users[0]);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
console.log("hfuhfueu",user)
  const calculateProfileCompletion = (user) => {
    const totalFields = Object.keys(user).length;
    const filledFields = Object.values(user).filter(value => value !== "").length;
    return (filledFields / totalFields) * 100;
  };

  const handleResumeUpload = (event) => {
    const file = event.target.files[0];
    console.log(file); // Handle the file upload as needed
  };

  const completionPercentage = calculateProfileCompletion(user);

  return (
    <div className="userprofilecontainer">
      <div className="mainuserinfo">
        <div className="infocontainer">
          <div className="Image">
            {user.avatar ? (
              <img src={user.avatar} alt="User avatar" />
            ) : (
              <FaUser size={80} />
            )}
          </div>
          <div>
            <FaEdit /> {user.username}
            <div>
              Profile Completion: {completionPercentage}%
            </div>
          </div>
        </div>
        <div className="userinfo">
          <div>
            <div>
              {user.username}
            </div>
            <div> 
              Last Updated: {new Date().toLocaleDateString()} 
            </div>
            <div>Project Completed:{user.Completed_projects_Count}</div>
          </div>
          <div>
            <div>
              <FaAddressCard /> {user.address} 
            </div>
            <div style={{display:"flex", margin:"1rem"}}>
              <FaPhone /> {user.PhoneNo}
            </div>
            <div>
              <FaEnvelope /> {user.email}
            </div>
          </div>
          <div className="incompletedetails">
            <div className="details"></div>
          </div>
        </div>
      </div>
     
      <div className="resume-section">
        <h3>Resume Upload</h3>
        <input type="file" id="resumeUpload" name="resume" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
        <label htmlFor="resumeUpload" className="resume-upload-label">
          <FaUpload /> Upload Resume
        </label>
        {user.resume && <div className="uploaded-resume">Resume Uploaded</div>}
      </div>  
      <div>Career Profile</div>
      <div className="sociallinks">
        <div>Github Link</div>
        <div>LinkedIn Link</div>
        <div>Twitter Link</div>
      </div>
      <div className="payment">
        <div>Phonepay No</div>
        <div>
          <label>Price Range:</label>
          <input
            type="text" 
            name="price"
            placeholder="Enter your price range"
          />
        </div>
        <div>UPI ID</div>
        <div>Bank Account No</div>
      </div>
    </div>
  );
};

export default UserProfile;
