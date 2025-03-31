import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div className='footer-inner-container'>
        <p>&copy; 2025 Stefan Bobrowski • Stefan Cloud Playground.</p>
        <nav>
          <Link to='/'>Home</Link>
          <Link to='/about'>About</Link>
          <Link to='/privacy'>Privacy Policy</Link>
          <Link to='/terms'>Terms of Service</Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
