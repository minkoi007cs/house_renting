import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';
import { DashboardData } from '@/types';

export const useDashboardStats = (
  startDate?: string,
  endDate?: string,
  enabled = true,
) => {
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (start?: string, end?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params: Record<string, string> = {};
      const s = start !== undefined ? start : startDate;
      const e = end !== undefined ? end : endDate;
      if (s) params.startDate = s;
      if (e) params.endDate = e;
      const res = await api.get('/analytics/dashboard', { params });
      setStats(res.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (enabled) fetchStats();
  }, [fetchStats, enabled]);

  return { stats, isLoading, error, fetchStats };
};
