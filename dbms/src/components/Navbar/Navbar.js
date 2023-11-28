import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './navbar.css'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className='navbar'>
      <div className='companyname'>WinkWise</div>
      <div className='hamburger' onClick={() => setMenuOpen(!menuOpen)}>
        &#9776; {/* This is a Unicode character for the hamburger icon. */}
      </div>
      <div className={`routing ${menuOpen ? 'show' : ''}`}>
        <nav>
          <ul className='nav-links'>
            <li>Projects</li>
            <li>Developers</li>
            <li>Hire Developers</li>
            <li>Contact</li>
            <li>About Us</li>
            <li className='authenticationmobile'>
            <Link to="/signup">SignUp</Link></li>
          
          </ul>
        </nav>
      </div>
      <div className='authenticationdesktop'>
      <Link to="/signup">SignUp</Link> 
      </div>
    </div>
  )
}

export default Navbar;
