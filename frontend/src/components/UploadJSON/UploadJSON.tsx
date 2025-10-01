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
    setUploadMessage('✅ Uploaded to Cloud Storage.\n📡 Sending to BigQuery...');

    if (!recaptchaReady) return setErrorMessage('reCAPTCHA not ready.');
    if (requestsRemaining === 0) return setErrorMessage('Request limit reached.');

    try {
      const recaptchaToken = await getRecaptchaToken('analyze_text');
      setUploadStatus('analyzing');

      const response = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-recaptcha-token': recaptchaToken },
        body: JSON.stringify({ gcsUrl: url }),
      });

      const remaining = response.headers.get('ratelimit-remaining');
      if (remaining !== null) setRequestsRemaining(parseInt(remaining, 10));

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(data.error || `Server error ${response.status}`);
        if (typeof data.requestsRemaining === 'number')
          setRequestsRemaining(data.requestsRemaining);
        setUploadStatus('error');
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
      setErrorMessage(err instanceof Error ? err.message : 'BigQuery load failed.');
      setUploadStatus('error');
    }
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
          setErrorMessage(null);
          setQueryResult(null);
        }}
        onUploadSuccess={handleUploadSuccess}
        onError={(error) => {
          setUploadStatus('error');
          setErrorMessage(error);
        }}
      />
      {errorMessage && <p className="error">{errorMessage}</p>}
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
