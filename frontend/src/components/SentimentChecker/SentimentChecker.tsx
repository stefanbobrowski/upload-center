import { useState, useRef } from 'react';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/RecaptchaProvider';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';
import './sentiment-checker.scss';

interface SentimentResult {
  sentiment: string;
  score: number;
}

declare global {
  interface Window {
    grecaptcha: {
      execute(siteKey: string, options: { action: string }): Promise<string>;
      ready(callback: () => void): void;
    };
  }
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

    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }

    if (text.length > MAX_LENGTH) {
      setError('Text too long. Please shorten your input.');
      return;
    }

    if (text === lastAnalyzedText) {
      setError('You already analyzed this exact text.');
      return;
    }

    if (requestsRemaining === 0) {
      setError('Request limit reached.');
      return;
    }

    if (!recaptchaReady) {
      setError('reCAPTCHA not ready. Please wait.');
      return;
    }

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
        if (remaining !== null) {
          setRequestsRemaining(parseInt(remaining, 10));
        }

        const data = await response.json();

        if (data.sentiment?.sentiment && typeof data.sentiment?.score === 'number') {
          setResult({ sentiment: data.sentiment.sentiment, score: data.sentiment.score });
          setLastAnalyzedText(text);
        } else {
          setError('Invalid response from server.');
          console.warn('Raw sentiment response:', data);
        }

        setLoading(false);
    } catch (err) {
      console.error('Request failed:', err);
      setError('Something went wrong. Please try again.');
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
      <p>Type a sentiment expressing your opinion or feeling.</p>

      <textarea
        rows={5}
        maxLength={MAX_LENGTH}
        placeholder='Example: "I absolutely loved this product! Great price and quality."'
        value={text}
        onChange={handleChange}
      />

      <div className="input-footer">
        <small className={`char-counter${text.length >= WARNING_THRESHOLD ? ' warning' : ''}`}>
          {text.length}/{MAX_LENGTH} characters
        </small>
        <small className="input-note">* Accepts plain text and JSON inputs.</small>
      </div>

      <button
        onClick={analyze}
        disabled={!text.trim() || text.length > MAX_LENGTH || requestsRemaining === 0 || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {error && <div className="error-message">{error}</div>}

      {result && (
        <>
          <div className="sentiment-result">
            <strong>Sentiment:</strong> {result.sentiment} <br />
            <strong>Score:</strong> {result.score}
          </div>
          <small style={{ display: 'block', marginTop: '0.5rem', marginLeft: '0.1rem' }}>
            A higher score means a stronger feeling. Scores close to 1 or more are strong.{' '}
          </small>
        </>
      )}
    </div>
  );
}
