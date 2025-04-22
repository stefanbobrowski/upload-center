import { ChangeEvent, useState } from "react";

interface UploadInputProps {
  acceptedTypes: string[]; // e.g., ['.txt', '.json', 'image/*']
  storagePath: string; // e.g., 'uploads/sentiment/', 'uploads/images/'
  label?: string;
  onUploadSuccess?: (gcsUrl: string) => void;
  onError?: (error: string) => void;
}

export const UploadInput = ({
  acceptedTypes,
  storagePath,
  label = 'Upload a file',
  onUploadSuccess,
  onError,
}: UploadInputProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', storagePath); // dynamic bucket foldering

    try {
      const res = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUploadSuccess?.(data.url);
    } catch (err: any) {
      const msg = err.message || 'Upload failed';
      setError(msg);
      onError?.(msg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" accept={acceptedTypes.join(',')} onChange={handleChange} />
      {file && <p>Selected: {file.name}</p>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
};
