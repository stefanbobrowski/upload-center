const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

/**
 * Safely obtains a reCAPTCHA v3 token for a given action.
 * Wraps grecaptcha.ready and grecaptcha.execute in a Promise.
 *
 * @param action - The reCAPTCHA action (e.g. 'analyze', 'upload', etc.)
 * @returns A Promise resolving to the reCAPTCHA token
 */
export async function getRecaptchaToken(action: string): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!window.grecaptcha) {
      return reject(new Error('reCAPTCHA not available on window'));
    }

    window.grecaptcha.ready(() => {
      window.grecaptcha
        .execute(RECAPTCHA_SITE_KEY, { action })
        .then(resolve)
        .catch((err) => reject(new Error(`reCAPTCHA execution failed: ${err.message || err}`)));
    });
  });
}
