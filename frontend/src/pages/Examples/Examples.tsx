import ProductList from '../../components/ProductList/ProductList';
import SentimentChecker from '../../components/SentimentChecker/SentimentChecker';
import ImageAnalyzer from '../../components/ImageAnalyzer/ImageAnalyzer';
import UploadText from '../../components/UploadText/UploadText';
import UploadJSON from '../../components/UploadJSON/UploadJSON';
import './examples.scss';
import CloudCounter from '../../components/CloudCounter/CloudCounter';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { MAX_REQUESTS_PER_HOUR } from '../../constants/rateLimits.ts';

const Examples = () => {
  const { requestsRemaining } = useRequestCounter();

  const counterColor =
    requestsRemaining === 0
      ? '#ff5c5c' // red
      : requestsRemaining <= 2
        ? '#ffb84d' // orange
        : '#ffd93d'; // bright yellow

  const remainingText = requestsRemaining === null ? '?' : requestsRemaining;

  return (
    <main className="examples-root">
      <div className="left-col">
        <h1>Examples</h1>
        <p>
          A handful of <strong>Google Cloud Platform (GCP)</strong> examples.
        </p>
        <p>
          Global Rate Limit set to <strong>{MAX_REQUESTS_PER_HOUR} requests per hour</strong> (See
          cloud <i>☁️</i>).
        </p>
        <p className="requests-remaining-text" style={{ color: counterColor }}>
          Requests Remaining: {remainingText}/{MAX_REQUESTS_PER_HOUR}
        </p>
        <ol className="examples-list" type="I">
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
