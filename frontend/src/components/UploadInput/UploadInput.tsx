import { useRef } from 'react';

type UploadInputProps = {
  acceptedTypes: string[];
  storagePath: string;
  label: string;
  onUploadStart: () => void;
  onUploadSuccess: (url: string) => void;
  onError: (error: string) => void;
};

export const UploadInput = ({ acceptedTypes, storagePath, label, onUploadStart, onUploadSuccess, onError }: UploadInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ Generate a unique ID per instance
  const uniqueId = useRef(`file-upload-${Math.random().toString(36).substr(2, 9)}`).current;

  const validateAndPrepareFile = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;

          if (content.trim().startsWith('[')) {
            // Regular JSON array detected
            const parsed = JSON.parse(content);
            if (!Array.isArray(parsed)) {
              throw new Error('Expected a JSON array.');
            }

            // Convert to NDJSON (newline-delimited JSON)
            const ndjson = parsed.map((obj: any) => JSON.stringify(obj)).join('\n');
            const blob = new Blob([ndjson], { type: 'application/json' });
            const convertedFile = new File([blob], file.name, { type: 'application/json' });

            resolve(convertedFile);
          } else {
            // Newline-delimited JSON detected
            const lines = content.split('\n').filter(Boolean);
            for (const line of lines) {
              JSON.parse(line); // Will throw if not valid
            }
            resolve(file); // No need to modify
          }
        } catch (err: any) {
          reject(new Error('Invalid JSON format: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    onUploadStart();

    try {
      const validatedFile = await validateAndPrepareFile(file);

      const formData = new FormData();
      formData.append('file', validatedFile);
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
      <label className="upload-label" htmlFor="file-upload">
        <p>{label}</p>
        <input
          id={uniqueId}
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileChange}
          hidden
        />
      </label>

    </div>
  );
};
