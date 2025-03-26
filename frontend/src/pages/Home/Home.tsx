// import ProductList from '../../components/ProductList/ProductList';
import SentimentChecker from '../../components/SentimentChecker/SentimentChecker';
import './home.css';
const Home = () => {
  return (
    <main>
      <h1>Home</h1>
      <p>Here are a few examples of Google Cloud Services and AI</p>
      <ol className='feature-list'>
        <li>Cloud SQL integration</li>
        <p>'Live product data from Google Cloud SQL'</p>
        {/* <ProductList /> */} Disabled for now
        <li>Vertex AI integration - Sentiment Analysis</li>
        <SentimentChecker />
        <li>Vision AI - Text + Image Upload</li>
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
