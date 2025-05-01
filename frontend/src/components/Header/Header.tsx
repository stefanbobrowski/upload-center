import { Link, NavLink } from 'react-router-dom';
import './header.scss';

const Header = () => {
  return (
    <header>
      <div className="header-inner-container">
        <Link to="/" className="logo-home-link">
          <h1>Cloud Playground</h1>
        </Link>
        <nav>
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Home
          </NavLink>
          <NavLink
            to="/examples"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Examples
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
