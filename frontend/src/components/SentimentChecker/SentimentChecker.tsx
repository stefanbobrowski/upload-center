import { useState, useRef } from 'react';
import './sentiment-checker.css';

interface SentimentResult {
  sentiment: string;
  score: number;
}

const MAX_REQUESTS = 3;

export default function SentimentChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAnalyzedText, setLastAnalyzedText] = useState('');
  const [requestsRemaining, setRequestsRemaining] = useState(MAX_REQUESTS);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

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

    if (requestsRemaining <= 0) {
      setError('Request limit reached.');
      return;
    }

    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-demo-token': 'demo-1234', // optional gatekeeping
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.sentiment?.sentiment && data.sentiment?.score !== undefined) {
        setResult({
          sentiment: data.sentiment.sentiment,
          score: data.sentiment.score,
        });
        setLastAnalyzedText(text);
        setRequestsRemaining((prev) => prev - 1);
      } else {
        setError('Invalid response from server.');
        console.warn('Raw sentiment response:', data);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      // Ready for analysis if needed
    }, 500);
  };

  return (
    <div className='sentiment-checker'>
      <h3>Gemini Sentiment Analysis</h3>
      <textarea
        rows={5}
        placeholder='Type something here like "I love this product. Will buy again."'
        value={text}
        onChange={handleChange}
      />
      <button onClick={analyze} disabled={!text || requestsRemaining <= 0}>
        Analyze
      </button>

      <div className='request-counter'>
        Requests remaining: {requestsRemaining}
      </div>

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
