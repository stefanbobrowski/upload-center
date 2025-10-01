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

    window.grecaptcha.ready(() => {
      window.grecaptcha.execute(SITE_KEY, { action }).then(resolve).catch(reject);
    });
  });
}
