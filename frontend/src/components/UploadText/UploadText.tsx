import { useState } from 'react';
import { UploadInput } from '../UploadInput/UploadInput';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/useRecaptchaReady';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';
import './upload-text.scss';

const UploadText = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle',
  );
  const [analyzeStatus, setAnalyzeStatus] = useState<
    'idle' | 'starting' | 'processing' | 'success' | 'error'
  >('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recaptchaReady = useRecaptchaReady();
  const { requestsRemaining, setRequestsRemaining } = useRequestCounter();

  const handleUploadSuccess = async (url: string) => {
    setUploadStatus('success');
    setUploadMessage('✅ Upload complete!');
    setAnalyzeStatus('starting');

    if (!recaptchaReady) return setErrorMessage('reCAPTCHA not ready.');
    if (requestsRemaining === 0) return setErrorMessage('Request limit reached.');

    try {
      const recaptchaToken = await getRecaptchaToken('analyze_text');
      setAnalyzeStatus('processing');

      const response = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-recaptcha-token': recaptchaToken },
        body: JSON.stringify({ gcsUrl: url }),
      });

      const remaining = response.headers.get('ratelimit-remaining');
      if (remaining !== null) setRequestsRemaining(parseInt(remaining, 10));

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.error || 'Vertex AI analysis failed.');
        if (typeof data.requestsRemaining === 'number')
          setRequestsRemaining(data.requestsRemaining);
        setAnalyzeStatus('error');
        return;
      }

      if (data.summary) {
        setAnalysisResult(data.summary);
        setAnalyzeStatus('success');
      } else {
        setErrorMessage('Invalid response from server.');
        setAnalyzeStatus('error');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setAnalyzeStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Vertex AI analysis failed.');
    }
  };

  return (
    <section className="upload-text example-container">
      <h3>Cloud Storage + Vertex AI - Upload Text File + Summary</h3>
      <UploadInput
        acceptedTypes={['.txt']}
        storagePath="uploads/text-files/"
        label="Upload a Text File (.txt) and summarize"
        onUploadStart={() => {
          setUploadStatus('uploading');
          setAnalyzeStatus('idle');
          setAnalysisResult(null);
          setErrorMessage(null);
        }}
        onUploadSuccess={handleUploadSuccess}
        onError={(error) => {
          setUploadStatus('error');
          setErrorMessage(error);
        }}
      />
      <div className="status-box">
        {uploadStatus === 'success' && <p className="success">{uploadMessage}</p>}
        {analyzeStatus === 'success' && <pre className="result">{analysisResult}</pre>}
        {errorMessage && <p className="error">{errorMessage}</p>}
      </div>
    </section>
  );
};

export default UploadText;
