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
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Falha ao ler histórico acadêmico');
        }

        return response.json();
      })
      .then((data) => {
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { extract, loading, error, data };
}
