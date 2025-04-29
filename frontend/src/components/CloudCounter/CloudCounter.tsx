import { useRequestCounter } from '../../context/RequestCounterContext';
import cloudImg from '../../assets/cloud.png';
import './cloud-counter.scss';

const CloudCounter = () => {
  const { requestsRemaining } = useRequestCounter();

  const counterColor =
    requestsRemaining === 0
      ? '#ff5c5c' // red
      : requestsRemaining <= 2
        ? '#ffb84d' // orange
        : '#ffd93d'; // bright yellow

  return (
    <div className="cloud-counter">
      <div className="cloud-icon">
        {/* ☁️ */}
        <img src={cloudImg}></img>
        <div className="rate-limit-counter" style={{ color: counterColor }}>
          Requests Remaining: {requestsRemaining}/5
        </div>
      </div>
    </div>
  );
};

export default CloudCounter;
