import { useState, useEffect } from 'react';
import api from '@/services/api';
export const useDashboardStats = () => {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchStats = async (startDate, endDate) => {
        try {
            setIsLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (startDate)
                params.append('startDate', startDate);
            if (endDate)
                params.append('endDate', endDate);
            const response = await api.get(`/analytics/dashboard${params.toString() ? '?' + params.toString() : ''}`);
            setStats(response.data.data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        }
        finally {
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
