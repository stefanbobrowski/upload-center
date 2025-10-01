import { useState } from 'react';
import { UploadInput } from '../UploadInput/UploadInput';
import { useRequestCounter } from '../../context/RequestCounterContext';
import { useRecaptchaReady } from '../../helpers/useRecaptchaReady';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';
import './upload-json.scss';

interface CategorySummaryRow {
  category: string;
  total: number;
}

interface QuerySummary {
  totalRows: number;
  categorySummary: CategorySummaryRow[];
  averageScore: number | null;
}

const UploadJSON = () => {
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'analyzing' | 'success' | 'error'
  >('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<QuerySummary | null>(null);
  const recaptchaReady = useRecaptchaReady();
  const { requestsRemaining, setRequestsRemaining } = useRequestCounter();

  const handleUploadSuccess = async (url: string) => {
    setUploadStatus('uploading');
    setUploadMessage('📤 Uploading JSON file to Cloud Storage...');
    setErrorMessage(null);
    setQueryResult(null);

    if (!recaptchaReady) {
      setUploadStatus('error');
      setErrorMessage('reCAPTCHA not ready.');
      return;
    }
    if (requestsRemaining === 0) {
      setUploadStatus('error');
      setErrorMessage('Request limit reached.');
      return;
    }

    try {
      const recaptchaToken = await getRecaptchaToken('analyze_text');

      setUploadStatus('analyzing');
      setUploadMessage('✅ Uploaded to Cloud Storage.\n📡 Sending to BigQuery...');

      const response = await fetch('/api/upload-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-recaptcha-token': recaptchaToken,
        },
        body: JSON.stringify({ gcsUrl: url }),
      });

      const remaining = response.headers.get('ratelimit-remaining');
      if (remaining !== null) {
        setRequestsRemaining(parseInt(remaining, 10));
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setUploadStatus('error');
        setErrorMessage(data.error || `Server error ${response.status}`);
        if (typeof data.requestsRemaining === 'number') {
          setRequestsRemaining(data.requestsRemaining);
        }
        return;
      }

      setUploadStatus('success');
      setUploadMessage((prev) => prev + '\n✅ BigQuery analysis complete!');

      if (data.summary) {
        type RawRow = { category?: unknown; total?: unknown };
        setQueryResult({
          totalRows: Number(data.summary.totalRows || 0),
          categorySummary: Array.isArray(data.summary.categorySummary)
            ? (data.summary.categorySummary as RawRow[]).map((row) => ({
                category: String(row.category ?? ''),
                total: Number(row.total ?? 0),
              }))
            : [],
          averageScore:
            data.summary.averageScore !== null ? Number(data.summary.averageScore) : null,
        });
      }
    } catch (err) {
      console.error('BigQuery load error:', err);
      setUploadStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'BigQuery load failed.');
    }
  };

  const handleUploadError = (error: string) => {
    setUploadStatus('error');
    setErrorMessage(error);
  };

  return (
    <section className="upload-json example-container">
      <h3>BigQuery - JSONL Analysis</h3>

      <UploadInput
        acceptedTypes={['.json']}
        storagePath="uploads/json/"
        label="Upload JSON/JSONL File to Cloud Storage for BigQuery Analysis"
        onUploadStart={() => {
          setUploadStatus('uploading');
          setUploadMessage('📤 Uploading JSON file to Cloud Storage...');
          setErrorMessage(null);
          setQueryResult(null);
        }}
        onUploadSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />

      <div className="status-box">
        {uploadStatus === 'uploading' && (
          <pre className="success">
            {uploadMessage}
            <span className="dot-anim" />
          </pre>
        )}
        {uploadStatus === 'analyzing' && (
          <pre className="success">
            {uploadMessage}
            <span className="dot-anim" />
          </pre>
        )}
        {uploadStatus === 'success' && <pre className="success">{uploadMessage}</pre>}
        {uploadStatus === 'error' && <p className="error">{errorMessage}</p>}
      </div>

      {queryResult && (
        <div className="result">
          <p>
            <strong>Total Rows:</strong> {queryResult.totalRows}
          </p>
          {queryResult.categorySummary.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {queryResult.categorySummary.map((r, i) => (
                  <tr key={i}>
                    <td>{r.category}</td>
                    <td>{r.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {queryResult.averageScore !== null && (
            <p>
              <strong>Average Score:</strong> {queryResult.averageScore.toFixed(2)}
            </p>
          )}
        </div>
      )}
    </section>
  );
};

export default UploadJSON;
