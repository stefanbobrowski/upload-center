import { useState, FormEvent, ChangeEvent } from 'react';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/RecaptchaProvider';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';
import './image-analyzer.scss';

const ImageAnalyzer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaReady = useRecaptchaReady();
  const { requestsRemaining, setRequestsRemaining } = useRequestCounter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image || !prompt.trim()) {
      setError('Image and prompt are required.');
      return;
    }

    if (!recaptchaReady) {
      setError('reCAPTCHA not ready. Please wait a moment.');
      return;
    }

    if (requestsRemaining === 0) {
      setError('Request limit reached.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const recaptchaToken = await getRecaptchaToken('analyze_text');

      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt.trim());
      formData.append('recaptchaToken', recaptchaToken);

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const remaining = res.headers.get('ratelimit-remaining');
      if (remaining !== null) {
        setRequestsRemaining(parseInt(remaining, 10));
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong.');
        return;
      }

      setResult(data.response || 'No response received.');
    } catch (err) {
      console.error('Error during analysis:', err);
      setError('Something went wrong while analyzing the image.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <div className="image-analyzer example-container">
      <h3>Gemini Vision - Image Analyzer</h3>
      <form onSubmit={handleSubmit}>
        <p>Choose an image, provide a prompt, and let Vision AI take care of the rest.</p>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <br />
        <input
          className="text-input"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter a prompt like "Is there a cat in this image?"'
        />
        <br />
        <button
          type="submit"
          disabled={loading || !image || !prompt.trim() || requestsRemaining === 0}
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      {result && (
        <p>
          <strong>Result:</strong> {result}
        </p>
      )}
    </div>
  );
};

export default ImageAnalyzer;
