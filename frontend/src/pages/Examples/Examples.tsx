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

  const remainingText = requestsRemaining === null ? '?' : requestsRemaining;

  return (
    <main className="examples-page">
      <h1>Examples</h1>
      <p>
        A handful of <strong style={{ color: '#4285F4' }}>Google Cloud Platform (GCP)</strong>{' '}
        examples.
      </p>
      <p>
        Global Rate Limit set to{' '}
        <strong className="alt-color">{MAX_REQUESTS_PER_HOUR} requests per hour</strong>.
      </p>
      <p className="requests-remaining-text">
        Requests Remaining:{' '}
        <strong className="alt-color">
          {remainingText}/{MAX_REQUESTS_PER_HOUR}
        </strong>
        .
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
      <CloudCounter />
    </main>
  );
};

export default Examples;
