import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home/Home';
import Examples from './pages/Examples/Examples';
import Terms from './pages/Terms/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import { RecaptchaProvider } from './helpers/RecaptchaProvider';
import { RequestCounterProvider } from './context/RequestCounterContext';
import ThemeToggle from './components/ThemeToggle/ThemeToggle';

function App() {
  return (
    <RequestCounterProvider>
      <RecaptchaProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/examples" element={<Examples />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
        </Routes>
        <ThemeToggle />
        <Footer />
      </RecaptchaProvider>
    </RequestCounterProvider>
  );
}

export default App;
