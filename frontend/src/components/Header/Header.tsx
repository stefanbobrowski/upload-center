import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import './header.css';

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);

  const handleToggleDarkMode = () => {
    const nextMode = !darkMode;
    const attr = nextMode ? 'dark' : 'light';
    setDarkMode(nextMode);
    document.documentElement.setAttribute('theme', attr);
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
            <span className='slider round'></span>
          </label>
          <span>Dark</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
