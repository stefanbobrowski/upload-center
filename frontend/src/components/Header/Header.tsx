import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark;
  });

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('theme', theme);
    localStorage.setItem('theme', theme);
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <header>
      <div className='header-inner-container'>
        <Link to='/' className='logo-home-link'>
          <h1>Cloud Playground</h1>
        </Link>
        <nav>
          <NavLink
            to='/'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Home
          </NavLink>
          <NavLink
            to='/about'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            About
          </NavLink>
        </nav>
        <div className='theme-toggle'>
          <span>Light</span>
          <label className='switch'>
            <input
              type='checkbox'
              onChange={handleToggleDarkMode}
              checked={darkMode}
            />
            <span className='slider'></span>
          </label>
          <span>Dark</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
