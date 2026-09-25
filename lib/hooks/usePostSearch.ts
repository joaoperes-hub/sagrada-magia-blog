import { useState, useCallback } from 'react';

export interface SearchResult {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  author_name: string;
  views: number;
  reading_time: number;
  created_at: string;
}

export const usePostSearch = () => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPosts = useCallback(async (query: string, category?: string) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        q: query,
        limit: '20',
      });

      if (category) {
        params.append('category', category);
      }

      const response = await fetch(`/api/posts/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar posts');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar posts';
      setError(message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    searchPosts,
    clearResults,
  };
};
