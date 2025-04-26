import ProductList from '../../components/ProductList/ProductList';
import SentimentChecker from '../../components/SentimentChecker/SentimentChecker';
import ImageAnalyzer from '../../components/ImageAnalyzer/ImageAnalyzer';
import UploadText from '../../components/UploadText/UploadText';
import UploadJSON from '../../components/UploadJSON/UploadJSON';
import './examples.scss';

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
            <ol className='example-list' type="I">
                <li><ProductList /></li>
                <li><SentimentChecker /></li>
                <li><ImageAnalyzer /></li>
                <li><UploadText /></li>
                <li><UploadJSON /></li>
            </ol>
        </main>
    );
};

export default Examples;
