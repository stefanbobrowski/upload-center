export async function getRecaptchaToken(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error('reCAPTCHA not loaded'));
    }

    window.grecaptcha.ready(async () => {
      try {
        // 🔥 Wait until reCAPTCHA client exists
        const maxWaitMs = 3000; // 3 seconds max
        const pollIntervalMs = 100;
        let waited = 0;

        while (waited < maxWaitMs) {
          const clients = (window.grecaptcha as any)?.getClients?.();
          if (clients && Object.keys(clients).length > 0) {
            break; // clients exist, safe to proceed
          }
          await new Promise((r) => setTimeout(r, pollIntervalMs));
          waited += pollIntervalMs;
        }

        // Final check
        const clients = (window.grecaptcha as any)?.getClients?.();
        if (!clients || Object.keys(clients).length === 0) {
          return reject(new Error('No reCAPTCHA clients available after waiting.'));
        }

        const token = await window.grecaptcha.execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, {
          action,
        });
        resolve(token);
      } catch (err) {
        reject(err);
      }
    });
  });
}
