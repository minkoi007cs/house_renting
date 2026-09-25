import { useState, useEffect, useCallback } from 'react';
import { Tenant } from '@/types';
import api from '@/services/api';

export const useTenants = (search?: string) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTenants = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/tenants', { params: search ? { search } : {} });
      setTenants(res.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tenants');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  const createTenant = async (unitId: string, data: Partial<Tenant>) => {
    const res = await api.post(`/units/${unitId}/tenants`, data);
    await fetchTenants();
    return res.data.data;
  };

  const updateTenant = async (id: string, data: Partial<Tenant>) => {
    const res = await api.patch(`/tenants/${id}`, data);
    setTenants((list) => list.map((t) => (t.id === id ? { ...t, ...res.data.data } : t)));
    return res.data.data;
  };

  const deleteTenant = async (id: string) => {
    await api.delete(`/tenants/${id}`);
    setTenants((list) => list.filter((t) => t.id !== id));
  };

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, isLoading, error, fetchTenants, createTenant, updateTenant, deleteTenant };
};

export const useTenantsByUnit = (unitId: string | undefined) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTenants = useCallback(async () => {
    if (!unitId) return;
    try {
      setIsLoading(true);
      const res = await api.get(`/units/${unitId}/tenants`);
      setTenants(res.data.data || []);
    } finally {
      setIsLoading(false);
    }
  }, [unitId]);

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  return { tenants, isLoading, fetchTenants };
};
