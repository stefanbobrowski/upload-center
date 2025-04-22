import { useState, FormEvent, ChangeEvent } from 'react';
import './image-analyzer.css';

const ImageAnalyzer = () => {
  const [image, setImage] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [requestsRemaining, setRequestsRemaining] = useState<number | null>(
    null
  );



  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!image || !prompt) return;

    setLoading(true);
    setError(null);
    setResult('');

    try {
      const recaptchaToken = await window.grecaptcha.execute(
        import.meta.env.VITE_RECAPTCHA_SITE_KEY,
        { action: 'analyze_image' }
      );

      const formData = new FormData();
      formData.append('image', image);
      formData.append('prompt', prompt);
      formData.append('recaptchaToken', recaptchaToken);

      const res = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      });

      const remaining = res.headers.get('ratelimit-remaining');
      console.log('Rate limit remaining:', remaining); // ← debug

      for (const [key, value] of res.headers.entries()) {
        console.log(key + ': ' + value);
      }

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
    <div className='image-analyzer'>
      <h3>Gemini Image Analyzer</h3>
      <p>
        Choose an image, provide a prompt, and let Vision AI take care of the
        rest.
      </p>
      <form onSubmit={handleSubmit}>
        <input type='file' accept='image/*' onChange={handleFileChange} />
        <br />
        <input
          className='text-input'
          type='text'
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Enter a prompt like "Is there a cat in this image?"'
        />
        <br />
        <button
          type='submit'
          disabled={
            loading ||
            !image ||
            !prompt ||
            !window.grecaptcha ||
            requestsRemaining === 0
          }
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
