import { useState, useEffect, useCallback } from 'react';
import { Reminder } from '@/types';
import api from '@/services/api';

export const useReminders = (status?: string) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get('/reminders', { params: status ? { status } : {} });
      setReminders(res.data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reminders');
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  const createReminder = async (propertyId: string, data: Partial<Reminder>) => {
    const res = await api.post(`/properties/${propertyId}/reminders`, data);
    await fetchReminders();
    return res.data.data;
  };

  const updateReminder = async (id: string, data: Partial<Reminder>) => {
    const res = await api.patch(`/reminders/${id}`, data);
    setReminders((list) => list.map((r) => (r.id === id ? { ...r, ...res.data.data } : r)));
    return res.data.data;
  };

  const toggleReminder = async (r: Reminder) => {
    const newStatus = r.status === 'pending' ? 'done' : 'pending';
    await updateReminder(r.id, { status: newStatus });
  };

  const deleteReminder = async (id: string) => {
    await api.delete(`/reminders/${id}`);
    setReminders((list) => list.filter((r) => r.id !== id));
  };

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return {
    reminders,
    isLoading,
    error,
    fetchReminders,
    createReminder,
    updateReminder,
    toggleReminder,
    deleteReminder,
  };
};
