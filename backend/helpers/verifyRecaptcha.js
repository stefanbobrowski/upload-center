const fetch = require('node-fetch');

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

if (!RECAPTCHA_SECRET_KEY) throw new Error('Missing reCAPTCHA secret key.');

async function verifyRecaptcha(token) {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    return res.json();
}

module.exports = { verifyRecaptcha };
