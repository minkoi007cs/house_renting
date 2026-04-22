import { useState, useEffect } from 'react';
import { Property } from '@/types';
import api from '@/services/api';

export const useProperties = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      const response = await api.get('/properties', {
        params: { page, limit },
      });
      setProperties(response.data.data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  };

  const createProperty = async (data: Partial<Property>) => {
    try {
      const response = await api.post('/properties', data);
      setProperties([response.data.data, ...properties]);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateProperty = async (id: string, data: Partial<Property>) => {
    try {
      const response = await api.patch(`/properties/${id}`, data);
      setProperties(
        properties.map((p) => (p.id === id ? response.data.data : p)),
      );
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteProperty = async (id: string) => {
    try {
      await api.delete(`/properties/${id}`);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return {
    properties,
    isLoading,
    error,
    fetchProperties,
    createProperty,
    updateProperty,
    deleteProperty,
  };
};
