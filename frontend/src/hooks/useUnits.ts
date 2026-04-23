import { useState, useEffect } from 'react';
import { Unit } from '@/types';
import api from '@/services/api';

export const useUnits = (propertyId: string) => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get(`/properties/${propertyId}/units`);
      setUnits(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch units');
    } finally {
      setIsLoading(false);
    }
  };

  const createUnit = async (data: Partial<Unit>) => {
    try {
      const response = await api.post(`/properties/${propertyId}/units`, data);
      setUnits([response.data.data, ...units]);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateUnit = async (id: string, data: Partial<Unit>) => {
    try {
      const response = await api.patch(`/properties/${propertyId}/units/${id}`, data);
      setUnits(units.map((u) => (u.id === id ? response.data.data : u)));
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteUnit = async (id: string) => {
    try {
      await api.delete(`/properties/${propertyId}/units/${id}`);
      setUnits(units.filter((u) => u.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchUnits();
    }
  }, [propertyId]);

  return {
    units,
    isLoading,
    error,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
  };
};
