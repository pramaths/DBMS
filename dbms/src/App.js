import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Hero from './components/Hero/Hero'
import Testimonials from './components/Testimonials/Testimonials';
import Carousel from './components/Carousel/Carousel';
import UserProfile from './components/UserProfile/UserProfile';
import Projects from './components/Projects/Projects';
import Projectform from './components/Projectform/Projectform';
import ProjectDetails from './components/ProjectDetails/ProjectDetails';
import Entries from './components/entries/Entries';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import { useEffect } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import SingleProject from './components/SingleProject/SingleProject';
import Myprojects from "./components/myprojects/myproject"
function App() {
  return (
    <div className="App">
   
     <Router>
      <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/project/:id" element={<SingleProject/>} />
      <Route path="/profile" element={<UserProfile/>} />
      <Route path="/myprojects" element={<Myprojects/>} />
      </Routes>
 
    </Router>
   
{/* <Hero/>
<Testimonials/>
<Carousel/>
     <UserProfile/>
     <Projects/>
     <ProjectDetails/>
     <Entries/>
     <Footer/>
<Dashboard/> */}
    </div>
  
  );
}

export default App;
