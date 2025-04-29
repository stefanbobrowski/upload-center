import ProductList from '../../components/ProductList/ProductList';
import SentimentChecker from '../../components/SentimentChecker/SentimentChecker';
import ImageAnalyzer from '../../components/ImageAnalyzer/ImageAnalyzer';
import UploadText from '../../components/UploadText/UploadText';
import UploadJSON from '../../components/UploadJSON/UploadJSON';
import './examples.scss';
import CloudCounter from '../../components/CloudCounter/CloudCounter';

const Examples = () => {
  return (
    <main className="examples-root">
      <div className="left-col">
        <h1>Examples</h1>
        <p>
          A handful of <strong>Google Cloud Platform (GCP)</strong> examples.
        </p>
        <p>
          Global Rate Limit set to <strong>5 requests per hour</strong> (See cloud <i>☁️</i> to the
          right).
        </p>
        <br />
        <ol className="example-list" type="I">
          <li>
            <ProductList />
          </li>
          <li>
            <SentimentChecker />
          </li>
          <li>
            <ImageAnalyzer />
          </li>
          <li>
            <UploadText />
          </li>
          <li>
            <UploadJSON />
          </li>
        </ol>
      </div>
      <CloudCounter />
    </main>
  );
};

export default Examples;
