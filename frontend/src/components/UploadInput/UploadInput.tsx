import { useState, ChangeEvent } from 'react';

export interface UploadInputProps {
  acceptedTypes: string[]; // e.g., ['.txt', 'image/*']
  storagePath: string;     // e.g., 'uploads/text-files/'
  label?: string;
  onUploadSuccess?: (gcsUrl: string) => void;
  onError?: (error: string) => void;
  onUploadStart?: () => void;
}

export const UploadInput = ({
  acceptedTypes,
  storagePath,
  label = 'Upload File',
  onUploadSuccess,
  onError,
  onUploadStart,
}: UploadInputProps) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    onUploadStart?.();

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', storagePath);

      const res = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Upload failed');

      onUploadSuccess?.(data.url);
    } catch (err: any) {
      const errorMessage = err.message || 'Upload failed';
      onError?.(errorMessage);
    }
  };

  return (
    <div className="upload-input">
      <label>{label}</label>
      <input
        type="file"
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
      />
      <button
        type="button"
        disabled={!file}
        onClick={handleUpload}
      >
        Upload
      </button>
    </div>
  );
};
