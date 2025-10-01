import { useRequestCounter } from '../../context/RequestCounterContext';
import { MAX_REQUESTS_PER_HOUR } from '../../constants/rateLimits';
import './cloud-counter.scss';

const CloudCounter = () => {
  const { requestsRemaining } = useRequestCounter();

  // keep `?` fallback, clamp negative to 0
  const remainingText = requestsRemaining === null ? '?' : Math.max(0, requestsRemaining);

  return (
    <div className="cloud-counter">
      <div className="cloud-container">
        <div className="rate-limit-counter">
          Requests: {remainingText}/{MAX_REQUESTS_PER_HOUR}
        </div>
      </div>
    </div>
  );
};

export default CloudCounter;
