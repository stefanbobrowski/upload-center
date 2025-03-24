import './about.css';

const About = () => {
  return (
    <main>
      <h1>About Page</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
        consectetur, nunc nec vehicula ultricies, nunc elit ultricies nunc, nec
        fermentum turpis elit a dolor. Donec nec nunc nec nunc ultricies
        fermentum. Nullam consectetur, nunc nec vehicula ultricies, nunc elit
        ultricies nunc, nec fermentum turpis elit a dolor. Donec nec nunc nec
      </p>
      <h2>New Google Cloud Stack:</h2>
      <table>
        <tr>
          <th>Layer</th>
          <th>Technologies Used</th>
        </tr>
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
      </table>
    </main>
  );
};

export default About;
