// const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;
const SITE_KEY = '6LeGJwIrAAAAAB0bVze42uHwybeLsHD79rLf4J0t';

export async function getRecaptchaToken(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error('reCAPTCHA not loaded'));
    }

    window.grecaptcha.ready(async () => {
      try {
        const maxWaitMs = 5000;
        const pollIntervalMs = 100;
        let waited = 0;

        while (waited < maxWaitMs) {
          const clients = (window.grecaptcha as any)?.getClients?.();
          if (clients && Object.keys(clients).length > 0) {
            break;
          }
          await new Promise((r) => setTimeout(r, pollIntervalMs));
          waited += pollIntervalMs;
        }

        const clients = (window.grecaptcha as any)?.getClients?.();
        if (!clients || Object.keys(clients).length === 0) {
          console.warn('No reCAPTCHA clients found after waiting. Manually creating client.');
          const dummyContainer = document.createElement('div');
          dummyContainer.style.display = 'none';
          document.body.appendChild(dummyContainer);
          (window.grecaptcha as any).render(dummyContainer, {
            sitekey: SITE_KEY,
            size: 'invisible',
          });
        }

        const token = await window.grecaptcha.execute(SITE_KEY, { action });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
}
