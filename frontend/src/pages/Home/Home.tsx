import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main>
      <h1>Upload Center 🌆</h1>
      <p>
        Welcome to my Cloud Playground!
      </p>

      <p>
        Head straight to the <Link to="/examples">Examples</Link> to see it in action.
      </p>

      <p>
        This site is a hands-on demonstration of what I've been building while diving deeper into backend development,
        cloud infrastructure, and AI integrations — all powered by <strong>Google Cloud Platform (GCP)</strong>.
      </p>

      <p>
        It showcases a secure, scalable full-stack architecture using a modern GCP-first stack, including:
      </p>

      <ul>
        <li><strong>Cloud SQL (PostgreSQL)</strong> for structured database storage.</li>
        <li><strong>Cloud Run</strong> for hosting Dockerized backend APIs and delivering the entire web app.</li>
        <li><strong>Cloud Storage</strong> for managing text, image, and JSON file uploads.</li>
        <li><strong>BigQuery</strong> for large-scale data analysis on uploaded JSON files.</li>
        <li><strong>Vertex AI & Gemini AI</strong> for advanced text and image analysis.</li>
      </ul>

      <h2>Technology Stack Overview</h2>
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
            <td>Vite + React (TypeScript, SWC)</td>
          </tr>
          <tr>
            <td>Backend</td>
            <td>Node.js, Express</td>
          </tr>
          <tr>
            <td>AI</td>
            <td>Gemini 1.5 Pro (text + image), Vertex AI Text Analysis</td>
          </tr>
          <tr>
            <td>Big Data</td>
            <td>BigQuery</td>
          </tr>
          <tr>
            <td>Database</td>
            <td>Cloud SQL (PostgreSQL)</td>
          </tr>
          <tr>
            <td>Storage</td>
            <td>Google Cloud Storage</td>
          </tr>
          <tr>
            <td>Security</td>
            <td>Cloud IAM, Rate Limiters, Helmet, CORS, reCAPTCHA v3 (planned)</td>
          </tr>
          <tr>
            <td>Build</td>
            <td>Docker</td>
          </tr>
          <tr>
            <td>CI/CD</td>
            <td>GitHub Actions (Docker build and deploy)</td>
          </tr>
          <tr>
            <td>Hosting</td>
            <td>Google Cloud Run, Artifact Registry</td>
          </tr>
        </tbody>
      </table>

      <p>
        In addition to integrating these services, I've focused heavily on <strong>securing access</strong> and <strong>preventing abuse</strong> of cloud resources.
        Measures like API rate limiting, reCAPTCHA v3 (optional), IP logging, strict CORS policies, and secure Helmet configurations
        ensure the platform is resilient against bot traffic and excessive API use — both for demo and real-world production use.
      </p>

      <p>
        Upload Center isn't just a learning project — it's a real foundation for building scalable, secure, cloud-native applications.
      </p>
    </main>
  );
};

export default Home;
