import { useState, useEffect } from 'react';
import api from '@/services/api';
export const useAnalytics = (propertyId) => {
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchAnalytics = async (startDate, endDate) => {
        try {
            setIsLoading(true);
            setError(null);
            const params = new URLSearchParams();
            if (startDate)
                params.append('startDate', startDate);
            if (endDate)
                params.append('endDate', endDate);
            const response = await api.get(`/analytics/properties/${propertyId}${params.toString() ? '?' + params.toString() : ''}`);
            setAnalytics(response.data.data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
        }
        finally {
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
