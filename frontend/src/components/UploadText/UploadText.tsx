import { useState } from 'react';
import { UploadInput } from '../UploadInput/UploadInput';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/RecaptchaProvider';
import './upload-text.scss';

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string;

const UploadText = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [analyzeStatus, setAnalyzeStatus] = useState<'idle' | 'starting' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { requestsRemaining, setRequestsRemaining } = useRequestCounter();
  const recaptchaReady = useRecaptchaReady();

  const handleUploadSuccess = async (url: string) => {
    setUploadStatus('success');
    setUploadMessage('✅ Upload complete!');
    setAnalyzeStatus('starting');

    try {
      if (!recaptchaReady) {
        throw new Error('reCAPTCHA not ready. Please wait.');
      }

      if (requestsRemaining === 0) {
        throw new Error('Request limit reached.');
      }

      const recaptchaToken = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
        action: 'analyze_text',
      });

      setAnalyzeStatus('processing');

      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': recaptchaToken,
        },
        body: JSON.stringify({ gcsUrl: url }),
      });

      const remaining = res.headers.get('ratelimit-remaining');
      if (remaining !== null) {
        setRequestsRemaining(parseInt(remaining, 10));
      }

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Vertex AI analysis failed.');

      setAnalysisResult(data.result || 'No result returned.');
      setAnalyzeStatus('success');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalyzeStatus('error');
      setErrorMessage(err.message || 'Vertex AI analysis failed.');
    }
  };

  const handleUploadError = (error: string) => {
    setUploadStatus('error');
    setErrorMessage(error);
  };

  return (
    <section className="example-container">
      <h3>Cloud Storage + Vertex AI - Upload Text File + Summary</h3>

      <UploadInput
        acceptedTypes={['.txt']}
        storagePath="uploads/text-files/"
        label="Upload a Text File (.txt) to Cloud Storage, summarize with Vertex AI after upload"
        onUploadStart={() => {
          setUploadStatus('uploading');
          setAnalyzeStatus('idle');
          setAnalysisResult(null);
          setErrorMessage(null);
        }}
        onUploadSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />

      <div className="status-box">
        {uploadStatus === 'uploading' && <p>📤 Uploading<span className="dot-anim" /></p>}
        {uploadStatus === 'success' && <p className="success">{uploadMessage}</p>}
        {uploadStatus === 'error' && <p className="error">❌ Upload failed: {errorMessage}</p>}

        {analyzeStatus === 'starting' && <p>🧠 Starting Vertex AI Analysis...</p>}
        {analyzeStatus === 'processing' && <p>🧠 Summarizing<span className="dot-anim" /></p>}
        {analyzeStatus === 'success' && (
          <>
            <p className="success">✅ Summary complete:</p>
            <pre className="result">{analysisResult}</pre>
          </>
        )}
        {analyzeStatus === 'error' && <p className="error">❌ Summary failed: {errorMessage}</p>}
      </div>
    </section>
  );
};

export default UploadText;
