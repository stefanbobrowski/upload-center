import { Link } from 'react-router-dom';
import ProductList from '../../components/ProductList/ProductList';
import SentimentChecker from '../../components/SentimentChecker/SentimentChecker';
import ImageAnalyzer from '../../components/ImageAnalyzer/ImageAnalyzer';
import './home.css';

const Home = () => {
  return (
    <main>
      <h1>Home</h1>
      <p>
        Welcome to my Cloud Playground. <Link to='/about'>What is it?</Link>
      </p>
      <p>Here are a few examples* of Google Cloud Services and AI.</p>
      <p className='small-text'>
        <i>
          * Requests are limited to 3 per example, 10 total that resets every 15
          minutes.
        </i>
      </p>
      <ol className='feature-list'>
        <li>Cloud SQL - Retrieve Data</li>
        <ProductList />
        <li>Gemini AI - Sentiment Analysis</li>
        <SentimentChecker />
        <li>Gemini AI - Image Upload and Analysis</li>
        <ImageAnalyzer />
        <li>Fire/SQL realtime chat OR message board</li>
        <li>Cloud Storage Upload - optional signed URLs</li>
        <li>Pub/Sub integration - Realtime updates</li>
        <li>
          BigQuery Demo: Stats on your data: Run a BigQuery job that summarizes
          Cloud SQL product data e.g., category breakdowns, prices, inventory.
        </li>
      </ol>
    </main>
  );
};

export default Home;
