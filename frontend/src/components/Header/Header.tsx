import { useState } from 'react';
import { Link } from 'react-router-dom';
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
      <h1>Stefan Cloud Playground</h1>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
      </nav>
      <div className='theme-toggle'>
        <span>{darkMode ? 'Dark' : 'Light'} Mode</span>
        <label className='switch'>
          <input
            type='checkbox'
            onChange={handleToggleDarkMode}
            checked={darkMode}
          />
          <span className='slider round'></span>
        </label>
      </div>
    </header>
  );
};

export default Header;
