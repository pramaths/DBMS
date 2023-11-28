import React, { useState } from 'react';
import './signup.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import img from "../../img/login-office-dark.jpeg";
import { Link } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student'); 

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Signup with:', email, username, phoneNumber, password, role);

    try {
      const response = await fetch('http://localhost:8000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          username,
          phone_number: phoneNumber,
          password,
          role
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Verification email sent. Please check your email to verify your account.", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(data.message || "An error occurred", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred during signup", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div className='signup-container'>
      <div className='signup-container-image'>
        <img src={img} alt="img" />
      </div>
      <div className="signup-container-input">
        <ToastContainer />
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className='texto'>Signup</h2>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-role">
            <label>
              <input
                type="radio"
                value="Student"
                checked={role === 'Student'}
                onChange={() => setRole('Student')}
              />
              Student
            </label>
            <label>
              <input
                type="radio"
                value="Developer"
                checked={role === 'Developer'}
                onChange={() => setRole('Developer')}
              />
              Developer
            </label>
          </div>

          <button type="submit" style={{background:"blue", margin:"1rem"}}>Signup</button>

          {/* Google Login Button */}
          <button type="button" className="google-login-button">
            <FaGoogle /> Sign up with Google
          </button>

          {/* GitHub Login Button */}
          <button type="button" className="github-login-button">
            <FaGithub /> Sign up with GitHub
          </button>
               <p>Already have an account? <Link to="/login" style={{color:"#0056b3"}}>Login here</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
