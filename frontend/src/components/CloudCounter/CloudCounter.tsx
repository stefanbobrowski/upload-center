import { useRequestCounter } from '../../context/RequestCounterContext';
import { MAX_REQUESTS_PER_HOUR } from '../../constants/rateLimits';
import './cloud-counter.scss';

const CloudCounter = () => {
  const { requestsRemaining } = useRequestCounter();

  const remainingText = requestsRemaining === null ? '?' : requestsRemaining;

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
