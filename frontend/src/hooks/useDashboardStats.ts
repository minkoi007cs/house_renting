import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface DashboardStats {
  summary: {
    total_properties: number;
    occupied_units: number;
    vacant_units: number;
    total_income: number;
    total_expense: number;
    net_profit: number;
  };
}

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(
        `/analytics/dashboard${params.toString() ? '?' + params.toString() : ''}`,
      );
      setStats(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    fetchStats,
  };
};
