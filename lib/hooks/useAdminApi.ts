import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession();
  return { Authorization: `Bearer ${session?.access_token}` };
}

export function useAdminApi<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = await getAuthHeader();
      const res = await fetch(endpoint, { headers });
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.error);
    } catch (e) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const create = async (body: Partial<T>) => {
    const headers = await getAuthHeader();
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (json.success) await fetchData();
    return json;
  };

  const update = async (id: string, body: Partial<T>) => {
    const headers = await getAuthHeader();
    const res = await fetch(endpoint, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...body }),
    });
    const json = await res.json();
    if (json.success) await fetchData();
    return json;
  };

  const remove = async (id: string) => {
    const headers = await getAuthHeader();
    const res = await fetch(`${endpoint}?id=${id}`, {
      method: 'DELETE',
      headers,
    });
    const json = await res.json();
    if (json.success) await fetchData();
    return json;
  };

  return { data, loading, error, refetch: fetchData, create, update, remove };
}