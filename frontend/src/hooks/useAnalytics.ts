import { useState, useEffect } from 'react';
import api from '@/services/api';

export interface PropertyAnalytics {
  summary: {
    total_income: number;
    total_expense: number;
    net_profit: number;
  };
  by_category: Record<string, number>;
  by_unit: Record<string, { income: number; expense: number }>;
  units_breakdown: any[];
}

export const useAnalytics = (propertyId: string) => {
  const [analytics, setAnalytics] = useState<PropertyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async (startDate?: string, endDate?: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(
        `/analytics/properties/${propertyId}${params.toString() ? '?' + params.toString() : ''}`,
      );
      setAnalytics(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchAnalytics();
    }
  }, [propertyId]);

  return {
    analytics,
    isLoading,
    error,
    fetchAnalytics,
  };
};
