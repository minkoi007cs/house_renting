import { useState, useEffect } from 'react';
import api from '@/services/api';
import { DashboardData } from '@/types';

export const useDashboardStats = (startDate?: string, endDate?: string) => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (start?: string, end?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      const actualStart = start !== undefined ? start : startDate;
      const actualEnd = end !== undefined ? end : endDate;
      
      if (actualStart) params.startDate = actualStart;
      if (actualEnd) params.endDate = actualEnd;
      
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
  }, [startDate, endDate]);

  return { stats, isLoading, error, fetchStats };
};
