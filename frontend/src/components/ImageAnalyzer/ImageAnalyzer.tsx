import { useState, FormEvent, ChangeEvent } from 'react';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/useRecaptchaReady';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';
import './image-analyzer.scss';

const ImageAnalyzer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaReady = useRecaptchaReady();
  const { requestsRemaining, setRequestsRemaining } = useRequestCounter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image || !prompt.trim()) return setError('Image and prompt are required.');
    if (!recaptchaReady) return setError('reCAPTCHA not ready.');
    if (requestsRemaining === 0) return setError('Request limit reached.');

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const recaptchaToken = await getRecaptchaToken('analyze_image');
      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt.trim());
      formData.append('recaptchaToken', recaptchaToken);

      const response = await fetch('/api/analyze-image', { method: 'POST', body: formData });
      const remaining = response.headers.get('ratelimit-remaining');
      if (remaining !== null) setRequestsRemaining(parseInt(remaining, 10));

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(data.error || 'Something went wrong.');
        if (typeof data.requestsRemaining === 'number') {
          setRequestsRemaining(data.requestsRemaining);
        }
        return;
      }

      if (data.response?.description) {
        setResult(data.response.description);
      } else {
        setError('Invalid response from server.');
        console.warn('Raw image response:', data);
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      setError('Something went wrong while analyzing the image.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-analyzer example-container">
      <h3>Gemini Vision - Image Analyzer</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (e.target.files?.[0]) setImage(e.target.files[0]);
          }}
        />
        <input
          className="text-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter a prompt like "Is there a cat?"'
        />
        <button
          type="submit"
          disabled={loading || !image || !prompt.trim() || requestsRemaining === 0}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </form>
      {result && (
        <div className="analysis-result">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
