import { Link } from 'react-router-dom';
import './home.scss';

const Home = () => {
  return (
    <main className="home-page">
      <h1>Upload Center 🌆</h1>
      <p>Welcome to the Cloud Playground — Upload Center!</p>
      <p>
        Head straight to the <Link to="/examples">Examples</Link> to see it in action.
      </p>
      <p>
        Upload Center is a hands-on demonstration of what I've been building while diving deeper
        into backend development, cloud infrastructure, and AI integrations — all powered by{' '}
        <a
          href="https://cloud.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="gcp-link"
        >
          Google Cloud Platform (GCP)
        </a>
        .
      </p>
      <p>
        It showcases a secure, scalable full-stack architecture using a modern GCP-first stack,
        including:
      </p>
      <ul className="tech-stack-list">
        <li>
          <strong>Cloud SQL (PostgreSQL):</strong> Structured data storage.
        </li>
        <li>
          <strong>Cloud Run:</strong> Dockerized backend + full app delivery.
        </li>
        <li>
          <strong>Cloud Storage:</strong> File uploads (text, images, JSON).
        </li>
        <li>
          <strong>BigQuery:</strong> Large-scale JSON analysis
        </li>
        <li>
          <strong>Vertex AI & Gemini Pro:</strong> AI text and image understanding.
        </li>
      </ul>
      <h2>🛠️ Technology Stack Overview</h2>
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
            <td>Gemini 1.5 Pro (text + image), Vertex AI</td>
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
            <td>IAM, Helmet, CORS, Rate Limiting, reCAPTCHA v3</td>
          </tr>
          <tr>
            <td>Build</td>
            <td>Docker</td>
          </tr>
          <tr>
            <td>CI/CD</td>
            <td>GitHub Actions (Docker build &amp; deploy)</td>
          </tr>
          <tr>
            <td>Hosting</td>
            <td>Cloud Run, Artifact Registry</td>
          </tr>
        </tbody>
      </table>

      <h2>🔐 Focus on Security</h2>
      <p>
        Built with real-world production security in mind. Heavy focus on securing access and
        preventing abuse of cloud resources from users and bot traffic. Measures include:
      </p>

      <ul>
        <li>Global & route-based API rate limiting</li>
        <li>reCAPTCHA v3 integration</li>
        <li>IP logging & strict CORS rules</li>
        <li>Hardened HTTP headers with Helmet</li>
        <li>Role-based access controls via Google Cloud IAM</li>
      </ul>

      <h2>🚀 Why It Matters</h2>
      <p>
        Upload Center is more than a learning sandbox — it's a blueprint for building secure,
        scalable, cloud-native web applications using toda&apos;s most powerful tools from Google
        Cloud. Whether you're testing uploads, analyzing data, or integrating AI, this platform
        offers a real-world, extensible foundation for modern web development.
      </p>

      <h2>📦 Full Code Repository</h2>
      <p>
        Check out the full source code here:{' '}
        <a
          href="https://github.com/stefanbobrowski/upload-center"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub - Upload Center
        </a>
        .{' '}
      </p>
    </main>
  );
};

export default Home;
