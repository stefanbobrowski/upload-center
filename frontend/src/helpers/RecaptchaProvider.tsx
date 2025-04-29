import { createContext, useContext, useEffect, useState } from 'react';

const RecaptchaContext = createContext(false);

export const useRecaptchaReady = () => useContext(RecaptchaContext);

export const RecaptchaProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src^="https://www.google.com/recaptcha/api.js"]',
    );
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setReady(true));
      return;
    }
    if (existingScript) {
      existingScript.addEventListener('load', () => setReady(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setReady(true);
    script.onerror = () => console.error('Failed to load reCAPTCHA script');
    document.head.appendChild(script);
  }, []);

  return <RecaptchaContext.Provider value={ready}>{children}</RecaptchaContext.Provider>;
};
