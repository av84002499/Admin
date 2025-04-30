import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { removeUserLogged } from '../auth';

const Navbar = () => {
  const [sticky, setSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 50);
    };

    // Attach scroll listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup scroll listener on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };


  return (
    <nav ref={navRef} className={`navbar-container ${sticky ? 'dark-nav' : ''}`}>
      <a href="/home">
        <img src="../images/logo-white.png" alt="Logo" className="logo" />
      </a>

      <div className={`menu-icon ${mobileMenuOpen ? 'open' : ''}`} onClick={toggleMobileMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>

      <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
      <li>
          <Link to="/User" onClick={() => setMobileMenuOpen(false)}>User</Link>
        </li>
        <li>
          <Link to="/gameCard" onClick={() => setMobileMenuOpen(false)}>Game Cards</Link>
        </li>
        <li>
          <Link to="/todayReport" onClick={() => setMobileMenuOpen(false)}>Today Report</Link>
        </li>
        <li>
          <Link to="/number" onClick={() => setMobileMenuOpen(false)}>Lucky Number</Link>
        </li>
        <li>
          <Link to="/withdrawRequests" onClick={() => setMobileMenuOpen(false)}>Withdraw Requests</Link>
        </li>
        <li>
          <Link to="/" onClick={() => removeUserLogged()}>Logout</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
