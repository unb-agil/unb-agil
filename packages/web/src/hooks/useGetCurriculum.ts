import { Curriculum } from '@/models/entities';
import { useEffect, useState } from 'react';

export default function useGetCurriculum(sigaaId?: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);

  useEffect(() => {
    if (!sigaaId) {
      return;
    }

    setLoading(true);
    setError(null);

    fetch(`http://localhost:3000/curricula?sigaaId=${sigaaId}`, {
      method: 'GET',
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setCurriculum(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [sigaaId]);

  return { loading, error, curriculum };
}
