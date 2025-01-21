import { useCallback, useState } from 'react';
import { AcademicHistory } from '@unb-agil/academic-history';
import { Component } from '@/models/entities';

interface RecommendationOptions {
  maxWorkloadByPeriod?: number;
}

export default function useGetRecommendation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Component[][] | null>(null);

  const recommend = useCallback(
    (academicHistory: AcademicHistory, options: RecommendationOptions) => {
      setLoading(true);
      setError(null);
      setData(null);

      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(options)) {
        searchParams.append(key, value);
      }

      fetch(`http://localhost:3000/recommendation?${searchParams}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(academicHistory),
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
    },
    [],
  );

  return { recommend, loading, error, data };
}
