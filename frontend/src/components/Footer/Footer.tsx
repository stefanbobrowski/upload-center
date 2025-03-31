import { NavLink } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='footer-inner-container'>
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
          <NavLink
            to='/privacy'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Privacy Policy
          </NavLink>
          <NavLink
            to='/terms'
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Terms of Service
          </NavLink>
        </nav>
        <p>&copy; 2025 Stefan Bobrowski • Stefan Cloud Playground.</p>
      </div>
    </footer>
  );
};

export default Footer;
