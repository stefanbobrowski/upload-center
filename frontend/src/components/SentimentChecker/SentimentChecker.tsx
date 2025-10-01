import { useState, useRef } from 'react';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/useRecaptchaReady';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';
import './sentiment-checker.scss';

interface SentimentResult {
  sentiment: string;
  score: number;
}

const MAX_LENGTH = 250;
const WARNING_THRESHOLD = 200;

export default function SentimentChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const recaptchaReady = useRecaptchaReady();
  const { requestsRemaining, setRequestsRemaining } = useRequestCounter();

  const analyze = async () => {
    setError(null);
    setResult(null);

    if (!text.trim()) return setError('Please enter some text.');
    if (text.length > MAX_LENGTH) return setError('Text too long. Please shorten your input.');
    if (text === lastAnalyzedText) return setError('You already analyzed this exact text.');
    if (requestsRemaining === 0) return setError('Request limit reached.');
    if (!recaptchaReady) return setError('reCAPTCHA not ready. Please wait.');

    setLoading(true);

    try {
      const recaptchaToken = await getRecaptchaToken('analyze_text');

      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': recaptchaToken,
        },
        body: JSON.stringify({ text }),
      });

      const remaining = response.headers.get('ratelimit-remaining');
      if (remaining !== null) setRequestsRemaining(parseInt(remaining, 10));

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Request failed.');
        if (typeof data.requestsRemaining === 'number') {
          setRequestsRemaining(data.requestsRemaining);
        }
        setLoading(false);
        return;
      }

      if (data.sentiment?.sentiment && typeof data.sentiment?.score === 'number') {
        setResult({ sentiment: data.sentiment.sentiment, score: data.sentiment.score });
        setLastAnalyzedText(text);
      } else {
        setError('Invalid response from server.');
        console.warn('Raw sentiment response:', data);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {}, 500);
  };

  return (
    <div className="sentiment-checker example-container">
      <h3>Gemini AI - Sentiment Analysis</h3>
      <textarea
        rows={5}
        maxLength={MAX_LENGTH}
        placeholder='Example: "I absolutely loved this product! Great price and quality."'
        value={text}
        onChange={handleChange}
      />
      <div className="input-footer">
        <small className={`char-counter${text.length >= WARNING_THRESHOLD ? ' warning' : ''}`}>
          {text.length}/{MAX_LENGTH}
        </small>
      </div>
      <button
        onClick={analyze}
        disabled={!text.trim() || text.length > MAX_LENGTH || requestsRemaining === 0 || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
      {error && <div className="error-message">{error}</div>}
      {result && (
        <div className="sentiment-result">
          <strong>Sentiment:</strong> {result.sentiment}
          <br />
          <strong>Score:</strong> {result.score}
        </div>
      )}
    </div>
  );
}
