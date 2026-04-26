import { useState, useEffect, useCallback } from 'react';
import { Unit } from '@/types';
import api from '@/services/api';

export const useUnits = (propertyId: string | undefined) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = useCallback(async () => {
    if (!propertyId) return;
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get(`/properties/${propertyId}/units`);
      setUnits(res.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch units');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  const createUnit = async (data: Partial<Unit>) => {
    if (!propertyId) throw new Error('Missing property');
    const res = await api.post(`/properties/${propertyId}/units`, data);
    setUnits((list) => [res.data.data, ...list]);
    return res.data.data;
  };

  const updateUnit = async (id: string, data: Partial<Unit>) => {
    const res = await api.patch(`/properties/${propertyId}/units/${id}`, data);
    setUnits((list) => list.map((u) => (u.id === id ? { ...u, ...res.data.data } : u)));
    return res.data.data;
  };

  const deleteUnit = async (id: string) => {
    await api.delete(`/properties/${propertyId}/units/${id}`);
    setUnits((list) => list.filter((u) => u.id !== id));
  };

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  return { units, isLoading, error, fetchUnits, createUnit, updateUnit, deleteUnit };
};
