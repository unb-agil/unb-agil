import { useCallback, useState } from 'react';
import { AcademicHistory } from '@unb-agil/academic-history';

export default function useExtractAcademicHistory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AcademicHistory | null>(null);

  const extract = useCallback((file: File) => {
    setLoading(true);
    setError(null);
    setData(null);

    const formData = new FormData();
    formData.append('file', file);

    fetch('http://localhost:3000/academic-history', {
      method: 'POST',
      headers: {
        'User-Agent': 'insomnia/10.3.0',
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        return response.json();
      })
      .then((data) => {
        console.log('File uploaded successfully', data);
        setData(data);
      })
      .catch((error) => {
        console.error('Error uploading file:', error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { extract, loading, error, data };
}
