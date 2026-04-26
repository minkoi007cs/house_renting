import { useState, useEffect } from 'react';
import api from '@/services/api';
import { DashboardData } from '@/types';

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const res = await api.get('/analytics/dashboard', { params });
      setStats(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, isLoading, error, fetchStats };
};
