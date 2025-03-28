import './about.css';

const About = () => {
  return (
    <main>
      <h1>About Page</h1>
      <p>
        This site is a hands-on demo of what I’ve been learning while diving
        into the world of backend development, cloud infrastructure, and AI —
        all powered by <strong>Google Cloud Platform (GCP)</strong>.
      </p>

      <p>
        It showcases a growing stack I’ve become comfortable using, built around
        key GCP services:
      </p>

      <ul>
        <li>
          <strong>Cloud SQL (PostgreSQL)</strong> for structured data storage
        </li>
        <li>
          <strong>Cloud Run</strong> for hosting scalable backend APIs
        </li>
        <li>
          <strong>Cloud Storage</strong> for handling file uploads and static
          content
        </li>
        <li>
          <strong>Gemini AI</strong> for powerful language analysis (e.g.,
          sentiment detection)
        </li>
      </ul>

      <h2>New Google Cloud Stack:</h2>
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Technologies Used</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Frontend</td>
            <td>React, TypeScript, Vite, React Router DOM, SWC</td>
          </tr>
          <tr>
            <td>Backend</td>
            <td>Node.js, Express</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>PostgreSQL (via Google Cloud SQL)</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td>Google Cloud Storage (for image uploads and media handling)</td>
          </tr>
          <tr>
            <td>Build</td>
            <td>Docker</td>
          </tr>
          <tr>
            <td>CI/CD</td>
            <td>GitHub Actions</td>
          </tr>
          <tr>
            <td>Deployment</td>
            <td>Google Cloud Run, Artifact Registry</td>
          </tr>
        </tbody>
      </table>

      <p>
        In addition to integrating these services, I’ve focused heavily on{' '}
        <strong>securing access</strong> and <strong>preventing abuse</strong>{' '}
        of cloud resources. Measures like <strong>rate limiting</strong>,{' '}
        <strong>frontend request cooldowns</strong>, <strong>IP logging</strong>
        , CORS restrictions, and <strong>reCAPTCHA v3 protection</strong> ensure
        the site is resilient against bot traffic and excessive API use — both
        in demo and production environments.
      </p>

      <p>
        This isn't just a learning tool — it’s a foundation for building
        scalable, secure, cloud-native apps.
      </p>
    </main>
  );
};

export default About;
