import { useState } from 'react';
import './sentiment-checker.css';

interface SentimentResult {
  sentiment: string;
  score: number;
}

export default function SentimentChecker() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<SentimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setError(null);
    setResult(null);

    if (!text.trim()) {
      setError('Please enter some text.');
      return;
    }

    try {
      const response = await fetch('/api/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (data.sentiment?.sentiment && data.sentiment?.score !== undefined) {
        setResult({
          sentiment: data.sentiment.sentiment,
          score: data.sentiment.score,
        });
      } else {
        setError('Invalid response from server.');
        console.warn('Raw sentiment response:', data);
      }
    } catch (err) {
      console.error('Request failed:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='sentiment-checker'>
      <h3>Gemini Sentiment Analysis</h3>
      <textarea
        rows={5}
        placeholder='Type something here like "I love this product. Will buy again."'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={analyze}>Analyze</button>

      {error && <div style={{ color: 'red', marginTop: '1rem' }}>{error}</div>}

      {result && (
        <div
          className='sentiment-result'
          style={{ marginTop: '1rem', padding: '1rem', background: '#eef' }}
        >
          <strong>Sentiment:</strong> {result.sentiment} <br />
          <strong>Score:</strong> {result.score}
        </div>
      )}
    </div>
  );
}
