import { useState, useRef } from 'react';

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

  // ✅ Generate a unique ID per instance
  const uniqueId = useRef(`file-upload-${Math.random().toString(36).slice(2, 11)}`).current;

  const validateJsonFile = (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          if (!content.trim()) {
            throw new Error('File is empty.');
          }
          if (content.trim().startsWith('[')) {
            // JSON array
            JSON.parse(content);
          } else {
            // JSONL format
            const lines = content.split('\n').filter(Boolean);
            lines.forEach((line) => JSON.parse(line));
          }
          resolve();
        } catch (err: any) {
          reject(new Error('Invalid JSON/JSONL format: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file.'));
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    onUploadStart();

    try {
      const isJsonUpload = acceptedTypes.includes('.json');

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (!fileExtension || !acceptedTypes.includes(`.${fileExtension}`)) {
        throw new Error(`Unsupported file type: .${fileExtension}`);
      }

      if (isJsonUpload) {
        await validateJsonFile(file);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', storagePath);

      const res = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Upload failed: ${errorText.slice(0, 100)}`);
      }

      const data = await res.json();
      onUploadSuccess(data.url);
    } catch (err: any) {
      console.error('Upload error:', err);
      onError(err.message);
    } finally {
      if (inputRef.current) {
        inputRef.current.value = '';
      }
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
