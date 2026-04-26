import { useState, useEffect, useCallback } from 'react';
import { Property } from '@/types';
import api from '@/services/api';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async (page = 1, limit = 50) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/properties', { params: { page, limit } });
      setProperties(res.data.data.items || []);
      setTotal(res.data.data.pagination?.total || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteProperty = async (id: string) => {
    await api.delete(`/properties/${id}`);
    setProperties((list) => list.filter((p) => p.id !== id));
  };

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return { properties, total, isLoading, error, fetchProperties, deleteProperty };
};

export const useProperty = (id: string | undefined) => {
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/properties/${id}`);
      setProperty(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load property');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return { property, isLoading, error, fetchProperty };
};
