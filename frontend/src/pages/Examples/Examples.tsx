import ProductList from '../../components/ProductList/ProductList';
import SentimentChecker from '../../components/SentimentChecker/SentimentChecker';
import ImageAnalyzer from '../../components/ImageAnalyzer/ImageAnalyzer';
import UploadText from '../../components/UploadText/UploadText';
import './examples.css';

const Examples = () => {
    return (
        <main>
            <h1>Examples</h1>
            <p>A handful of <strong>Google Cloud Platform (GCP)</strong> examples.</p>
            <p className='small-text'>
                <i>
                    * Requests are limited to 3 per example, 10 total that resets every 15
                    minutes.
                </i>
            </p>
            <ol type="I">
                <li><ProductList /></li>
                <li><SentimentChecker /></li>
                <li><ImageAnalyzer /></li>
                <li><UploadText /></li>
                <li>Cloud Storage Upload - optional signed URLs</li>
                <li>Pub/Sub integration - Realtime updates</li>
                <li>
                    BigQuery Demo: Stats on your data: Run a BigQuery job that summarizes
                    Cloud SQL product data e.g., category breakdowns, prices, inventory.
                </li>
                <li>Fire/SQL realtime chat OR message board</li>
            </ol>
        </main>
    );
};

export default Examples;
