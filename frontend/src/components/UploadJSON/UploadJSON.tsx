import { useState } from 'react';
import { UploadInput } from '../UploadInput/UploadInput';
import './upload-json.scss';

const UploadJSON = () => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'analyzing' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [queryResult, setQueryResult] = useState<any | null>(null);

  const handleUploadStart = () => {
    setUploadStatus('uploading');
    setUploadMessage('📤 Uploading JSON file to Cloud Storage...');
    setErrorMessage(null);
    setFileUrl(null);
    setQueryResult(null);
  };

  const handleUploadSuccess = async (url: string) => {
    setUploadStatus('uploading');
    setUploadMessage('✅ Uploaded to Cloud Storage.\n📡 Sending to BigQuery...');
    setFileUrl(url);

    try {
      setUploadStatus('analyzing');

      const res = await fetch('/api/upload-json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gcsUrl: url }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server responded with ${res.status}: ${errorText.slice(0, 100)}`);
      }

      const data = await res.json();

      setUploadStatus('success');
      setUploadMessage((prev) => prev + '\n✅ BigQuery analysis complete!');

      if (data.summary) {
        setQueryResult(data.summary);
      }
    } catch (err: any) {
      console.error('BigQuery load error:', err);
      setUploadStatus('error');
      setErrorMessage(`❌ BigQuery load failed: ${err.message}`);
    }
  };

  const handleUploadError = (error: string) => {
    setUploadStatus('error');
    setErrorMessage(error);
  };

  return (
    <section className="upload-json example-container">
      <h3>Cloud Storage - Upload JSON File for BigQuery</h3>

      <UploadInput
        acceptedTypes={['.json']}
        storagePath="uploads/json/"
        label="Upload JSON File"
        onUploadStart={handleUploadStart}
        onUploadSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />

      <div className="status-box">
        {(uploadStatus === 'uploading' || uploadStatus === 'analyzing') && (
          <pre className="success">{uploadMessage}<span className="dot-anim" /></pre>
        )}
        {uploadStatus === 'success' && (
          <pre className="success">{uploadMessage}</pre>
        )}
        {uploadStatus === 'error' && (
          <p className="error">{errorMessage}</p>
        )}
      </div>


      {queryResult && (
        <div className="result">
          <h4>📊 BigQuery Analysis Result:</h4>

          {queryResult.totalRows !== undefined && (
            <p><strong>Total Rows Uploaded:</strong> {queryResult.totalRows}</p>
          )}

          {queryResult.categorySummary && queryResult.categorySummary.length > 0 && (
            <div className="category-summary">
              <h5>Top Categories:</h5>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {queryResult.categorySummary.map((row: any, idx: number) => (
                    <tr key={idx}>
                      <td>{row.category}</td>
                      <td>{row.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!queryResult.categorySummary?.length && (
            <p>No category breakdown available.</p>
          )}
          {queryResult.averageScore !== undefined && (
            <p><strong>Average Score:</strong> {queryResult.averageScore.toFixed(2)}</p>
          )}
        </div>
      )}

    </section>
  );
};

export default UploadJSON;
