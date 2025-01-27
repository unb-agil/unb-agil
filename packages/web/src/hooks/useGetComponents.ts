import { useCallback, useState, useRef } from 'react';
import { Component } from '@/models/entities';

interface SearchOptions {
  curriculumSigaaId?: string;
  type?: string;
  query?: string;
}

const DEBOUNCE_DELAY = 300;

export default function useGetComponents() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<Component[] | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const search = useCallback((options: SearchOptions) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      setLoading(true);
      setError(null);

      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(options)) {
        if (!value) {
          continue;
        }

        searchParams.append(key, value);
      }

      fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/curricula-components/search?${searchParams}`,
        {
          method: 'GET',
        },
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch components');
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
    }, DEBOUNCE_DELAY);
  }, []);

  return { search, loading, error, data };
}
