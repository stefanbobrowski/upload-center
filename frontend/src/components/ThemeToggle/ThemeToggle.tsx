import { useState, useEffect } from 'react';
import './theme-toggle.scss';

const ThemeToggle = () => {
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

  return (
    <div className="theme-toggle">
      <div className="theme-toggle-container">
        <span>Light</span>
        <label className="switch">
          <input type="checkbox" onChange={() => setDarkMode((prev) => !prev)} checked={darkMode} />
          <span className="slider"></span>
        </label>
        <span>Dark</span>
      </div>
    </div>
  );
};

export default ThemeToggle;
