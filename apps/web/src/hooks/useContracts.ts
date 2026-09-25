import { useState, useEffect, useCallback } from 'react';
import { RentalContract } from '@/types';
import api from '@/services/api';

export const useContracts = (status?: string) => {
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/contracts', { params: status ? { status } : {} });
      setContracts(res.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const createContract = async (unitId: string, data: Partial<RentalContract>) => {
    const res = await api.post(`/units/${unitId}/contracts`, data);
    await fetchContracts();
    return res.data.data;
  };

  const updateContract = async (id: string, data: Partial<RentalContract>) => {
    const res = await api.patch(`/contracts/${id}`, data);
    setContracts((list) => list.map((c) => (c.id === id ? { ...c, ...res.data.data } : c)));
    return res.data.data;
  };

  const deleteContract = async (id: string) => {
    await api.delete(`/contracts/${id}`);
    setContracts((list) => list.filter((c) => c.id !== id));
  };

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { contracts, isLoading, error, fetchContracts, createContract, updateContract, deleteContract };
};

export const useContractsByUnit = (unitId: string | undefined) => {
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchContracts = useCallback(async () => {
    if (!unitId) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/units/${unitId}/contracts`);
      setContracts(res.data.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  return { contracts, isLoading, fetchContracts };
};
