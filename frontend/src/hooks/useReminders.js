import { useState, useEffect } from 'react';
import api from '@/services/api';
export const useReminders = (propertyId) => {
    const [reminders, setReminders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchReminders = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await api.get(`/properties/${propertyId}/reminders`);
            setReminders(response.data.data);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
        }
        finally {
            setIsLoading(false);
        }
    };
    const createReminder = async (data) => {
        try {
            const response = await api.post(`/properties/${propertyId}/reminders`, data);
            setReminders([response.data.data, ...reminders]);
            return response.data.data;
        }
        catch (err) {
            throw err;
        }
    };
    const updateReminder = async (id, data) => {
        try {
            const response = await api.patch(`/properties/${propertyId}/reminders/${id}`, data);
            setReminders(reminders.map((r) => (r.id === id ? response.data.data : r)));
            return response.data.data;
        }
        catch (err) {
            throw err;
        }
    };
    const deleteReminder = async (id) => {
        try {
            await api.delete(`/properties/${propertyId}/reminders/${id}`);
            setReminders(reminders.filter((r) => r.id !== id));
        }
        catch (err) {
            throw err;
        }
    };
    useEffect(() => {
        if (propertyId) {
            fetchReminders();
        }
    }, [propertyId]);
    return {
        reminders,
        isLoading,
        error,
        fetchReminders,
        createReminder,
        updateReminder,
        deleteReminder,
    };
};
