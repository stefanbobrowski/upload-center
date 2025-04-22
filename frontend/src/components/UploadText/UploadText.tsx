import { useState } from 'react';
import { UploadInput } from '../UploadInput/UploadInput';
import './upload-text.scss';


const UploadText = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [analyzeStatus, setAnalyzeStatus] = useState<'idle' | 'starting' | 'processing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUploadSuccess = async (url: string) => {
    setUploadStatus('success');
    setUploadMessage('✅ Upload complete!');
    setAnalyzeStatus('starting');

    try {
      setAnalyzeStatus('processing');

      const res = await fetch('/api/analyze-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gcsUrl: url }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Vertex AI analysis failed.');

      setAnalysisResult(data.result || 'No result returned');
      setAnalyzeStatus('success');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setAnalyzeStatus('error');
      setErrorMessage(err.message || 'Vertex AI analysis failed');
    }
  };

  const handleUploadError = (error: string) => {
    setUploadStatus('error');
    setErrorMessage(error);
  };

  return (
    <section className="example-container">
      <h3>Vertex AI + Cloud Storage - Upload text file</h3>

      <UploadInput
        acceptedTypes={['.txt']}
        storagePath="uploads/text-files/"
        label="Upload Text File"
        onUploadSuccess={handleUploadSuccess}
        onError={handleUploadError}
        onUploadStart={() => {
          setUploadStatus('uploading');
          setAnalyzeStatus('idle');
          setAnalysisResult(null);
          setErrorMessage(null);
        }}
      />

      <div className="status-box">
        {uploadStatus === 'uploading' && <p>📤 Uploading<span className="dot-anim" /></p>}
        {uploadStatus === 'success' && <p className="success">{uploadMessage}</p>}
        {uploadStatus === 'error' && <p className="error">❌ Upload failed: {errorMessage}</p>}

        {analyzeStatus === 'starting' && <p>🧠 Starting Vertex AI Analysis...</p>}
        {analyzeStatus === 'processing' && <p>🧠 Analyzing<span className="dot-anim" /></p>}
        {analyzeStatus === 'success' && (
          <>
            <p className="success">✅ Analysis complete:</p>
            <pre className="result">{analysisResult}</pre>
          </>
        )}
        {analyzeStatus === 'error' && <p className="error">❌ Analysis failed: {errorMessage}</p>}
      </div>
    </section>
  );
};

export default UploadText;
