import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export function useSupabaseData<T>(table: string, options?: {
  filter?: { column: string; value: unknown };
  orderBy?: { column: string; ascending?: boolean };
}) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    let query = supabase.from(table).select('*');

    if (options?.filter) {
      query = query.eq(options.filter.column, options.filter.value);
    }
    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? false
      });
    }

    const { data: result, error: err } = await query;
    if (err) setError(err.message);
    else setData(result as T[]);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [table]);

  return { data, loading, error, refetch: fetchData };
}