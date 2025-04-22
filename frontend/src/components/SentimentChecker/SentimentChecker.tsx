import { useState, useRef, useEffect } from 'react';
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

const RECAPTCHA_SITE_KEY = '6LeGJwIrAAAAAB0bVze42uHwybeLsHD79rLf4J0t';

export default function SentimentChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => { });
    }
  }, []);

  const analyze = async () => {
    setError(null);
    setResult(null);

    if (!text.trim()) {
      setError('Please enter some text.');
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

    setLoading(true);

    try {
      const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: 'analyze',
      });

      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': token,
        },
        body: JSON.stringify({ text }),
      });

      const remaining = response.headers.get('ratelimit-remaining');
      if (remaining !== null) {
        setRequestsRemaining(parseInt(remaining, 10));
      }

      const data = await response.json();

      if (
        data.sentiment?.sentiment &&
        typeof data.sentiment?.score === 'number'
      ) {
        setResult({
          sentiment: data.sentiment.sentiment,
          score: data.sentiment.score,
        });
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
    debounceTimer.current = setTimeout(() => { }, 500);
  };

  return (
    <div className='sentiment-checker example-container'>
      <h3>Gemini AI - Sentiment Analysis</h3>
      <p>Accepts text and JSON.</p>
      <textarea
        rows={5}
        placeholder='Enter a sentiment here like "I love this product. Will buy again."'
        value={text}
        onChange={handleChange}
      />
      <button
        onClick={analyze}
        disabled={!text || requestsRemaining === 0 || loading}
      >
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>

      {requestsRemaining !== null && (
        <div
          className={`request-counter${requestsRemaining <= 0 ? ' depleted' : ''
            }`}
        >
          Requests remaining: {requestsRemaining}
        </div>
      )}

      {error && <div className='error-message'>{error}</div>}

      {result && (
        <div className='sentiment-result'>
          <strong>Sentiment:</strong> {result.sentiment} <br />
          <strong>Score:</strong> {result.score}
        </div>
      )}
    </div>
  );
}
