import { useState, useRef } from 'react';
import { getRecaptchaToken } from '../../helpers/getRecaptchaToken';

type UploadInputProps = {
  acceptedTypes: string[];
  storagePath: string;
  label: string;
  onUploadStart: () => void;
  onUploadSuccess: (url: string) => void;
  onError: (error: string) => void;
};

export const UploadInput = ({
  acceptedTypes,
  storagePath,
  label,
  onUploadStart,
  onUploadSuccess,
  onError,
}: UploadInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const uniqueId = useRef(`file-upload-${Math.random().toString(36).slice(2, 11)}`).current;

  const validateJsonFile = (file: File): Promise<void> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = (event.target?.result as string) ?? '';
          if (!content.trim()) throw new Error('File is empty.');

          if (content.trim().startsWith('[')) {
            JSON.parse(content); // array JSON
          } else {
            content
              .split('\n')
              .filter(Boolean)
              .forEach((line) => JSON.parse(line)); // JSONL
          }
          resolve();
        } catch (err) {
          reject(
            err instanceof Error
              ? new Error('Invalid JSON/JSONL format: ' + err.message)
              : new Error('Invalid JSON/JSONL format'),
          );
        }
      };
      reader.onerror = () => reject(new Error('Error reading file.'));
      reader.readAsText(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    onUploadStart();

    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!ext || !acceptedTypes.includes(`.${ext}`)) {
        throw new Error(`Unsupported file type: .${ext || 'unknown'}`);
      }

      if (acceptedTypes.includes('.json')) {
        await validateJsonFile(file);
      }

      const recaptchaToken = await getRecaptchaToken('upload_file');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', storagePath);

      const res = await fetch('/api/upload-file', {
        method: 'POST',
        headers: { 'x-recaptcha-token': recaptchaToken },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Upload failed (status ${res.status})`);
      }

      if (!data.url) throw new Error('No file URL returned by server.');

      onUploadSuccess(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      onError(err instanceof Error ? err.message : 'Unknown upload error');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="upload-input">
      <label className="upload-label" htmlFor={uniqueId}>
        <p>
          <strong>{label}</strong>
        </p>
        <input
          id={uniqueId}
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          hidden
        />
      </label>
      {selectedFileName && <p className="filename-display">{selectedFileName}</p>}
    </div>
  );
};
