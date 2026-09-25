'use client';

import { useState, useCallback } from 'react';
import { getSupabase } from '@/lib/supabase';
import { BlogPost } from '@/lib/types';

export const usePosts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPosts = useCallback(async (published = true) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      let query = supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (published) {
        query = query.eq('published', true);
      }

      const { data, error: err } = await query;

      if (err) throw err;
      return (data || []) as BlogPost[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar posts';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getPostBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (err) throw err;
      return data as BlogPost;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Post não encontrado';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPostsByCategory = useCallback(async (categorySlug: string) => {
    setLoading(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { data, error: err } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('category', categorySlug)
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (err) throw err;
      return (data || []) as BlogPost[];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar posts da categoria';
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getPosts,
    getPostBySlug,
    getPostsByCategory,
    loading,
    error,
  };
};
