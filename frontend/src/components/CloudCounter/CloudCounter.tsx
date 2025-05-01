import { useRequestCounter } from '../../context/RequestCounterContext';
import { MAX_REQUESTS_PER_HOUR } from '../../constants/rateLimits';
import cloudImg from '../../assets/cloud.png';
import './cloud-counter.scss';

const CloudCounter = () => {
  const { requestsRemaining } = useRequestCounter();

  const counterColor =
    requestsRemaining === 0
      ? '#ff5c5c' // red
      : requestsRemaining <= 3
        ? '#ffb84d' // orange
        : '#ffd93d'; // bright yellow

  const remainingText = requestsRemaining === null ? '?' : requestsRemaining;

  return (
    <div className="cloud-counter">
      <div className="cloud-container">
        {/* <div className="cloud-image">
          <img src={cloudImg}></img>
        </div> */}
        <div className="rate-limit-counter">
          Requests: {remainingText}/{MAX_REQUESTS_PER_HOUR}
        </div>
      </div>
    </div>
  );
};

export default CloudCounter;
