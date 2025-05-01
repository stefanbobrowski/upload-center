export async function getRecaptchaToken(action: string): Promise<string> {
  const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

  if (!SITE_KEY) {
    console.error('❌ No reCAPTCHA site key found! Check environment variables.');
    throw new Error('No reCAPTCHA site key found.');
  }

  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error('reCAPTCHA not loaded'));
    }

    window.grecaptcha.ready(async () => {
      try {
        const maxWaitMs = 4000;
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

          if (!document.getElementById('recaptcha-dummy')) {
            const dummyContainer = document.createElement('div');
            dummyContainer.id = 'recaptcha-dummy';
            dummyContainer.style.display = 'none';
            document.body.appendChild(dummyContainer);

            (window.grecaptcha as any).render(dummyContainer, {
              sitekey: SITE_KEY,
              size: 'invisible',
            });
          }
        }

        const token = await window.grecaptcha.execute(SITE_KEY, { action });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
}
