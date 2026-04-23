import { useState, useEffect } from 'react';
import { RentalContract } from '@/types';
import api from '@/services/api';

export const useContracts = (propertyId: string) => {
  const [contracts, setContracts] = useState<RentalContract[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Fetch all units first, then their contracts
      const unitsResponse = await api.get(`/properties/${propertyId}/units`);
      const units = unitsResponse.data.data;

      const allContracts: RentalContract[] = [];
      for (const unit of units) {
        try {
          const contractsResponse = await api.get(`/units/${unit.id}/contracts`);
          allContracts.push(...contractsResponse.data.data);
        } catch (err) {
          // Continue if unit has no contracts
        }
      }
      setContracts(allContracts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contracts');
    } finally {
      setIsLoading(false);
    }
  };

  const createContract = async (data: Partial<RentalContract>) => {
    try {
      // Need unit_id to create contract
      if (!data.unit_id) throw new Error('unit_id is required');
      const response = await api.post(`/units/${data.unit_id}/contracts`, data);
      setContracts([response.data.data, ...contracts]);
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const updateContract = async (id: string, data: Partial<RentalContract>) => {
    try {
      const response = await api.patch(`/contracts/${id}`, data);
      setContracts(contracts.map((c) => (c.id === id ? response.data.data : c)));
      return response.data.data;
    } catch (err) {
      throw err;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      await api.delete(`/contracts/${id}`);
      setContracts(contracts.filter((c) => c.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchContracts();
    }
  }, [propertyId]);

  return {
    contracts,
    isLoading,
    error,
    fetchContracts,
    createContract,
    updateContract,
    deleteContract,
  };
};
