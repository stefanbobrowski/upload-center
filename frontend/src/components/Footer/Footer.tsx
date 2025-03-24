import { Link } from 'react-router-dom';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <p>&copy; 2025 Stefan Cloud Playground. All rights reserved.</p>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/about'>About</Link>
        <Link to='/privacy'>Privacy Policy</Link>
        <Link to='/terms'>Terms of Service</Link>
      </nav>
    </footer>
  );
};

export default Footer;
